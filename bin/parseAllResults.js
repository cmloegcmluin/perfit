const fs = require('fs')
const parse = require('csv-parse')
const makeSystemKey = require('./makeSystemKey')
const {NOT_APPLICABLE, BASE_PERFORMANCE_MESSAGE} = require('../constants')
const config = require('./config')

const aggregates = {
    resultsBySystemThenCommitNumber: {},
    resultsByCommitNumberThenSystem: {},
    basePerformances: {},
    messages: {},
    systemKeys: {},
}

const resultIsNotHeaderOrBasePerformance = commitNumber => {
    return commitNumber !== 'commit number' && commitNumber !== NOT_APPLICABLE
}

const initializeKeyIfUndefined = (object, key) => {
    if (!object[key]) object[key] = {}
}

const aggregateResult = ({commitNumber, systemKey, droppedRate, message}) => {
    const {
        resultsBySystemThenCommitNumber,
        resultsByCommitNumberThenSystem,
        messages,
        systemKeys,
    } = aggregates

    const commitNumberParsed = parseInt(commitNumber)

    initializeKeyIfUndefined(resultsBySystemThenCommitNumber, systemKey)
    resultsBySystemThenCommitNumber[systemKey][commitNumberParsed] = droppedRate

    initializeKeyIfUndefined(resultsByCommitNumberThenSystem, commitNumberParsed)
    resultsByCommitNumberThenSystem[commitNumberParsed][systemKey] = droppedRate

    systemKeys[systemKey] = 'defined'

    messages[commitNumber] = message
}

const parseResult = entry => {
    const [commitNumber, _, message, os, browser, gpu, droppedRate] = entry
    const systemKey = makeSystemKey(os, browser, gpu)

    if (resultIsNotHeaderOrBasePerformance(commitNumber)) {
        aggregateResult({commitNumber, systemKey, droppedRate, message})
    } else if (message === BASE_PERFORMANCE_MESSAGE) {
        initializeKeyIfUndefined(aggregates.resultsByCommitNumberThenSystem, 0)
        aggregates.resultsByCommitNumberThenSystem[0][systemKey] = droppedRate

        aggregates.basePerformances[systemKey] = droppedRate
    }
}

const readResults = parser => {
    let entry
    while (entry = parser.read()) {
        parseResult(entry)
    }
}

const parsePromise = parser => {
    return new Promise(resolve => {
        parser.on('finish', () => {
            resolve(aggregates)
        })
    })
}

const parseAllResults = () => {
    const data = fs.readFileSync(`${config.outputPath}/results.tsv`, 'utf8')
    const parser = parse({delimiter: '\t'})

    parser.on('readable', () => readResults(parser))

    parser.write(data)
    parser.end()

    return parsePromise(parser)
}

module.exports = parseAllResults

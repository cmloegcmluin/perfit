const fs = require('fs')
const calculateDroppedRate = require('./calculateDroppedRate')
const gpu = require('./gpu')
const {commitNumber, sha, message} = require('./git')
const agent = require('./agent')
const fileReport = require('./fileReport')
const consoleReport = require('./consoleReport')
const formatLine = require('./formatLine')
const config = require('./config')
const parseAllResults = require('./parseAllResults')

const createOutputPathIfDoesNotExist = () => {
    if (!fs.existsSync(config.outputPath)) fs.mkdirSync(config.outputPath)
}

const initializeResultsFileWithHeaderRowIfDoesNotExist = resultsFile => {
    if (fs.existsSync(resultsFile)) return

    fs.appendFileSync(resultsFile, formatLine([
        'commit number',
        'sha',
        'message',
        'os',
        'browser',
        'gpu',
        'percentage of dropped frames',
        'fps',
        'raw measurements of duration of each frame in ms',
    ]))
}

const addNewResultsRow = (resultsFile, results) => {
    fs.appendFileSync(resultsFile, formatLine(results))
}

const handleResults = req => {
    const {os, browser} = agent(req)

    req.on('data', async chunk => {
        const data = JSON.parse(chunk)

        const droppedRate = calculateDroppedRate(data)
        const fps = data.fps
        const measurements = data.measurements.toString()

        const newResult = [commitNumber, sha, message, os, browser, gpu, droppedRate, fps, measurements]

        const resultsFile = `${config.outputPath}/results.tsv`

        createOutputPathIfDoesNotExist()
        initializeResultsFileWithHeaderRowIfDoesNotExist(resultsFile)
        addNewResultsRow(resultsFile, newResult)

        const {
            resultsBySystemThenCommitNumber,
            resultsByCommitNumberThenSystem,
            basePerformances,
            messages,
            systemKeys,
        } = await parseAllResults()

        fileReport({resultsByCommitNumberThenSystem, systemKeys})
        consoleReport({resultsBySystemThenCommitNumber, basePerformances, messages, os, browser, gpu, droppedRate})
    })
}

module.exports = handleResults

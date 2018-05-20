const color = require('./color')
const makeSystemKey = require('./makeSystemKey')
const {baseMode} = require('./config')
const log = require('./log')

const takeOnlyFirstSixDigits = number => number.toString().slice(0, 6)

const formatRate = rate => takeOnlyFirstSixDigits(rate) + '%'

const firstTestMessage = () => {
    log(`
This is the first performance test of this app on this system. 
Please run this test again on the next commit that may impact performance to find out whether you made a positive or negative difference.
    `)
}

const improvedMessage = (droppedRateOfImmediatelyPreviousCommit, droppedRate) => {
    log(color.green(`
With this commit, you have improved performance. 
The frame drop rate has decreased from ${formatRate(droppedRateOfImmediatelyPreviousCommit)} to ${formatRate(droppedRate)}.
    `))
}

const worsenedMessage = (droppedRateOfImmediatelyPreviousCommit, droppedRate) => {
    log(color.magenta(`
With this commit, you have negatively impacted performance. 
The frame drop rate has increased from ${formatRate(droppedRateOfImmediatelyPreviousCommit)} to ${formatRate(droppedRate)}.
    `))
}

const neutralMessage = droppedRate => {
    log(color.yellow(`
This commit has not changed performance. The frame drop rate holds steady at ${formatRate(droppedRate)}.
    `))
}

const getDroppedRateOfImmediatelyPreviousCommit = ({
                                                       commitNumbersExcludingTheCurrentCommit,
                                                       previousResultsForThisSystem
                                                   }) => {
    const immediatelyPreviousCommitNumber = commitNumbersExcludingTheCurrentCommit[commitNumbersExcludingTheCurrentCommit.length - 1]
    return previousResultsForThisSystem[immediatelyPreviousCommitNumber]
}

const reportVersusImmediatelyPreviousPerformance = ({
                                                        previousResultsForThisSystem,
                                                        commitNumbersExcludingTheCurrentCommit,
                                                        droppedRate,
                                                    }) => {
    const droppedRateOfImmediatelyPreviousCommit = getDroppedRateOfImmediatelyPreviousCommit({
        commitNumbersExcludingTheCurrentCommit,
        previousResultsForThisSystem,
    })

    if (droppedRateOfImmediatelyPreviousCommit > droppedRate) {
        improvedMessage(droppedRateOfImmediatelyPreviousCommit, droppedRate)
    } else if (droppedRateOfImmediatelyPreviousCommit < droppedRate) {
        worsenedMessage(droppedRateOfImmediatelyPreviousCommit, droppedRate)
    } else {
        neutralMessage(droppedRate)
    }
}

const maybeReportVersusImmediatelyPreviousPerformance = (previousResultsForThisSystem, droppedRate) => {
    const commitNumbers = Object.keys(previousResultsForThisSystem)
    const commitNumbersExcludingTheCurrentCommit = commitNumbers.slice(0, -1)

    if (commitNumbersExcludingTheCurrentCommit.length === 0) {
        firstTestMessage()
        return
    }

    reportVersusImmediatelyPreviousPerformance({
        previousResultsForThisSystem,
        commitNumbersExcludingTheCurrentCommit,
        droppedRate,
    })
}

const reportVersusBasePerformance = (basePerformances, systemKey) => {
    const basePerformance = basePerformances[systemKey]
    if (!basePerformance) {
        log('Base performance of this system is unknown.')
    } else {
        log(`Base performance of this system (the best you possibly get on it) is ${formatRate(basePerformance)}.`)
    }
}

const reportVersusHistory = (previousResultsForThisSystem, messages) => {
    log('\nHere is the entire history of the frame drop rate on this system:')
    Object.keys(previousResultsForThisSystem).forEach(commitNumber => {
        log(`${formatRate(previousResultsForThisSystem[commitNumber])} @ ${messages[commitNumber]}`)
    })
}

const consoleReport = ({
                           resultsBySystemThenCommitNumber,
                           basePerformances,
                           messages,
                           browser,
                           os,
                           gpu,
                           droppedRate
                       }) => {
    const systemKey = makeSystemKey(os, browser, gpu)

    log(`\nAnalyzing performance change for the current system:\n${systemKey}`)

    const previousResultsForThisSystem = resultsBySystemThenCommitNumber[systemKey]

    if (!baseMode) maybeReportVersusImmediatelyPreviousPerformance(previousResultsForThisSystem, droppedRate)
    reportVersusBasePerformance(basePerformances, systemKey)
    if (previousResultsForThisSystem) reportVersusHistory(previousResultsForThisSystem, messages)

    log(color.cyan('\nResults and report spreadsheets updated.\n'))
}

module.exports = consoleReport

const fs = require('fs')
const formatLine = require('./formatLine')
const config = require('./config')

const deleteReportIfExists = reportFile => fs.existsSync(reportFile) && fs.unlinkSync(reportFile)

const addReportHeaderRow = (reportFile, definedSystemKeys) => {
    fs.appendFileSync(reportFile, formatLine(['commit'].concat(definedSystemKeys)))
}

const addReportDataRow = ({commitNumber, resultsBySystem, definedSystemKeys, reportFile}) => {
    const resultsForThisCommit = definedSystemKeys.map(systemKey => resultsBySystem[systemKey || ''])
    const entryForThisCommit = [commitNumber].concat(resultsForThisCommit)
    fs.appendFileSync(reportFile, formatLine(entryForThisCommit))
}

const addReportDataRows = (reportFile, definedSystemKeys, resultsByCommitNumberThenSystem) => {
    Object.entries(resultsByCommitNumberThenSystem).forEach(([commitNumber, resultsBySystem]) => {
        addReportDataRow({commitNumber, resultsBySystem, definedSystemKeys, reportFile})
    })
}

const fileReport = ({resultsByCommitNumberThenSystem, systemKeys}) => {
    const reportFile = `${config.outputPath}/report.tsv`
    const definedSystemKeys = Object.keys(systemKeys)
    deleteReportIfExists(reportFile)
    addReportHeaderRow(reportFile, definedSystemKeys)
    addReportDataRows(reportFile, definedSystemKeys, resultsByCommitNumberThenSystem)
}

module.exports = fileReport

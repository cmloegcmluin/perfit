const color = require('./color')
const config = require('./config')
const log = require('./log')

const basePerformanceMessage = `
${color.magenta('You are in base performance mode.')}
This will test the rate at which the app can call the function on this system without actually calling it.
`

const serverReadyCallback = () => {
    log(`
Performance testing server up!${config.baseMode ? basePerformanceMessage : ''}

Open your app in any browsers you'd like to test it on.

In a few moments, you'll be notified here.
The result will be saved in ${color.yellow(`\`${config.outputPath}/results.tsv\``)}.
An overall report will be updated in ${color.yellow(`\`${config.outputPath}/report.tsv\``)}.
    `)
}

module.exports = serverReadyCallback

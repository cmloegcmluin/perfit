const log = require('./log')
const color = require('./color')

const help = () => {
    log(`
${color.green('perfit help')}

See ${color.yellow('\`./node_modules/perfit/README.md\`')} for details.

Command line option quick reference:

${color.cyan('-p --port')}
Port the perfit server runs on.
${color.magenta('Default: 8081')}

${color.cyan('-b --base')}
When in base mode, the original function on the test will not actually be called. This will test the base performance on the system before the function is even added to the mix.
${color.magenta('Default: false')}

${color.cyan('-f --fps')}
How many frames per second to hope for your function to achieve.
${color.magenta('Default: 60')}

${color.cyan('-c --count')}
How many measurements for the client to make before sending the results to the server.
${color.magenta('Default: 8192')}

${color.cyan('-s --shave')}
For whatever reason things are usually a bit janky right at the beginning. If you notice that you're still getting some weird measurements right at the beginning of your results, because the default count of measurements to shave is not quite enough for your situation, you can configure this value.
${color.magenta('Default: 16')}
        
${color.cyan('-d --delay')}
In the case where you have not only started the application first but also already opened it in your browser before starting your perfit server, this delay is here to give you time to switch focus back to the browser tab.
${color.magenta('Default: 3000')}

${color.cyan('-o --output')}
Where to save the output spreadsheet files relative to your app's directory.
${color.magenta('Default: ./performance')}
    `)

    process.exit(0)
}

module.exports = help

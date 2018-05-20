const cp = require('child_process')

const stripTrailingReturnCarriage = string => string.slice(0, -1).toString()

const getCommandOutput = command => stripTrailingReturnCarriage(cp.execSync(command))

module.exports = getCommandOutput

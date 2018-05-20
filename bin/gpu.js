const getCommandOutput = require('./getCommandOutput')
const platform = require('./platform')

let gpuFindingCommand
if (platform === 'darwin') {
    gpuFindingCommand = `system_profiler SPDisplaysDataType | sed -e 's/:/ /' | sed -n '3 p'`
} else if (platform === 'win32') {
    gpuFindingCommand = `wmic path win32_VideoController get name | tail -2`
}
const gpu = gpuFindingCommand ? getCommandOutput(gpuFindingCommand).trim() : 'unknown'

module.exports = gpu

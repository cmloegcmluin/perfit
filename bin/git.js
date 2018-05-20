const getCommandOutput = require('./getCommandOutput')
const {NOT_APPLICABLE, BASE_PERFORMANCE_MESSAGE} = require('../constants')
const config = require('./config')

const takeFirstLineOnly = string => string.split('\n')[0]

const git = {}
if (config.baseMode) {
    git.commitNumber = NOT_APPLICABLE
    git.sha = NOT_APPLICABLE
    git.message = BASE_PERFORMANCE_MESSAGE
} else {
    git.commitNumber = getCommandOutput('git rev-list HEAD --count')
    git.sha = getCommandOutput('git rev-parse HEAD')
    git.message = takeFirstLineOnly(getCommandOutput(`git log --format=%B -n 1 ${git.sha}`))
}

module.exports = git

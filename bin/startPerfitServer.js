const http = require('http')
const handleResults = require('./handleResults')
const serverReadyCallback = require('./serverReadyCallback')
const color = require('./color')
const config = require('./config')
const log = require('./log')
const getClientId = require('./getClientId')
const handleStartConditionMet = require('./handleStartConditionMet')
const connectedClients = require('./connectedClients')
const {
    CONNECTED,
    RECORDING_NOW,
    RECORDING_COMPLETE,
    START_CONDITION_MET_ENDPOINT,
    RECORDING_NOW_ENDPOINT,
    RECORDING_COMPLETE_ENDPOINT,
} = require('../constants')

const OKAY_STATUS = 200

const recordingNowMessage = clientId => {
    log(`Client ID ${clientId}: ${color.cyan('Recording now. Give it a few minutes...')}`)
}

const doneRecordingMessage = clientId => {
    log(`Client ID ${clientId}: ${color.green('Done recording!')}`)
}

const handlingRecordingNowAndItReachedServerAfterRecordingCompleteDid = clientId => {
    return connectedClients[clientId] === RECORDING_COMPLETE
}

const handlingRecordingCompleteAndItReachedServerBeforeRecordingNowDid = clientId => {
    return connectedClients[clientId] === CONNECTED
}

const handleRecordingNow = (req, res, clientId) => {
    res.writeHead(OKAY_STATUS, {'Access-Control-Allow-Origin': '*'})

    if (!handlingRecordingNowAndItReachedServerAfterRecordingCompleteDid(clientId)) {
        recordingNowMessage(clientId)
        connectedClients[clientId] = RECORDING_NOW
    }
}

const handleRecordingComplete = (req, res, clientId) => {
    res.writeHead(OKAY_STATUS, {'Access-Control-Allow-Origin': '*'})

    if (handlingRecordingCompleteAndItReachedServerBeforeRecordingNowDid(clientId)) {
        recordingNowMessage(clientId)
        connectedClients[clientId] = RECORDING_COMPLETE
    }

    doneRecordingMessage(clientId)

    handleResults(req)
}

const startPerfitServer = () => {
    http.createServer((req, res) => {
        const clientId = getClientId(req)

        if (req.url.includes(START_CONDITION_MET_ENDPOINT)) {
            handleStartConditionMet(req, res, clientId)
        } else if (req.url.includes(RECORDING_NOW_ENDPOINT)) {
            handleRecordingNow(req, res, clientId)
        } else if (req.url.includes(RECORDING_COMPLETE_ENDPOINT)) {
            handleRecordingComplete(req, res, clientId)
        }

        res.end()
    }).listen(config.serverPort, serverReadyCallback)
}

module.exports = startPerfitServer

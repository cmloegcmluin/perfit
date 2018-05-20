const {CONNECTED, SERVER_READY} = require('../constants')
const color = require('./color')
const config = require('./config')
const log = require('./log')
const connectedClients = require('./connectedClients')

const OKAY_STATUS = 200

const handleStartConditionMet = (req, res, clientId) => {
    if (connectedClients[clientId]) return
    connectedClients[clientId] = CONNECTED

    res.writeHead(OKAY_STATUS, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    })

    log(`
Client ID ${clientId}: ${color.cyan('Start condition met in the app under test. Sending configuration to client.')}
Please keep focus on the browser tab for most accurate results.
You have a couple seconds from now to switch over to it.
        `)

    const {
        baseMode,
        fps,
        measurementCount,
        measurementShaveCount,
        recordingDelay,
    } = config
    const configForClient = {
        baseMode,
        fps,
        measurementCount,
        measurementShaveCount,
        recordingDelay,
    }

    res.write(`event: ${SERVER_READY}\ndata: ${JSON.stringify(configForClient)}\n\n`)
}

module.exports = handleStartConditionMet

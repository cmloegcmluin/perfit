import {RECORDING_NOW_ENDPOINT, SERVER_READY, START_CONDITION_MET_ENDPOINT} from '../constants'
import state from './state'
import config from './config'
import serverEndpoint from './serverEndpoint'

const startRecording = () => {
    state.serverUp = true
    state.time = Date.now()
    fetch(serverEndpoint(RECORDING_NOW_ENDPOINT))
}

const startRecordingInAMoment = () => {
    window.setTimeout(startRecording, config.recordingDelay)
}

const updateConfig = event => {
    const configFromServer = JSON.parse(event.data)
    Object.entries(configFromServer).forEach(([key, value]) => config[key] = value)
}

const startPollingServer = () => new EventSource(serverEndpoint(START_CONDITION_MET_ENDPOINT))

const turnOn = () => {
    if (state.serverEventSource) state.serverEventSource.close()
    state.serverEventSource = startPollingServer()

    state.serverEventSource.addEventListener(SERVER_READY, event => {
        updateConfig(event)
        startRecordingInAMoment()
    })
}

export default turnOn

import serverEndpoint from './serverEndpoint'
import config from './config'
import state from './state'
import {RECORDING_COMPLETE_ENDPOINT} from '../constants'

const measurements = []

const takeMeasurement = () => {
    measurements.push(Date.now() - state.time)
    state.time = Date.now()
}

const shouldSendRecording = () => {
    const {measurementCount, measurementShaveCount} = config
    if (state.recordingSent) return false

    const requiredMeasurementsCount = measurementCount + measurementShaveCount

    return measurements.length >= requiredMeasurementsCount
}

const shavedMeasurements = () => measurements.slice(config.measurementShaveCount)

const sendRecording = () => {
    const measurements = shavedMeasurements()
    const fps = config.fps
    const body = JSON.stringify({fps, measurements})
    const method = 'POST'
    const url = serverEndpoint(RECORDING_COMPLETE_ENDPOINT)
    const options = {method, body}

    fetch(url, options)

    state.recordingSent = true
}

const getInjectedFunction = functionToTest => {
    return () => {
        if (state.serverUp) takeMeasurement()

        if (shouldSendRecording()) sendRecording()

        if (!config.baseMode) functionToTest()
    }
}

export default getInjectedFunction

const MS_PER_S = 1000
const PERCENT_SCALAR = 100

const frameCount = (measurement, expectedFrameDuration) => Math.round(measurement / expectedFrameDuration)

const frameCountsOfEachMeasurement = data => {
    const expectedFrameDuration = MS_PER_S / data.fps

    return data.measurements.map(measurement => frameCount(measurement, expectedFrameDuration))
}

const sum = array => array.reduce((a, b) => a + b)

const calculateDroppedRate = data => {
    if (!data.measurements.length) return 0

    const measurementsCount = data.measurements.length
    const actualFrameCount = sum(frameCountsOfEachMeasurement(data))

    if (actualFrameCount < measurementsCount) return 0

    const countOfDroppedFrames = actualFrameCount - measurementsCount

    return (countOfDroppedFrames / actualFrameCount) * PERCENT_SCALAR
}

module.exports = calculateDroppedRate

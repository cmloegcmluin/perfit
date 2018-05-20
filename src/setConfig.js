import config from './config'

const setConfig = (configKey, value) => {
    if (Object.keys(config).includes(configKey)) {
        config[configKey] = value
    }
}

export default setConfig

import clientId from './clientId'
import config from './config'

const serverEndpoint = endpoint => `http://localhost:${config.serverPort}/${endpoint}?${clientId}`

export default serverEndpoint

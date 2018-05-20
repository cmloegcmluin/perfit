const QUERY_PARAMS_SIDE_OF_SPLIT = 1

const getClientId = req => req.url.split('?')[QUERY_PARAMS_SIDE_OF_SPLIT]

module.exports = getClientId

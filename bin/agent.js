const useragent = require('useragent')

const agent = req => {
    const output = {}

    const [browser, os] = useragent.parse(req.headers['user-agent']).toString().split('/')

    output.browser = browser.trim()
    output.os = os.trim()

    return output
}

module.exports = agent

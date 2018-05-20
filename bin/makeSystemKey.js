const stripMinorVersion = entityWithSemver => entityWithSemver.substr(0, entityWithSemver.indexOf('.'))

const makeSystemKey = (os, browser, gpu) => [stripMinorVersion(os), stripMinorVersion(browser), gpu].join(' / ')

module.exports = makeSystemKey

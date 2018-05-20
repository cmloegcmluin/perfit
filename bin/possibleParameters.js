const possibleParameters = [
    {
        flag: 'help',
        shortcut: 'h',
    },
    {
        flag: 'baseMode',
        shortcut: 'b',
    },
    {
        flag: 'port',
        shortcut: 'p',
        configKey: 'serverPort',
        type: 'int',
    },
    {
        flag: 'fps',
        shortcut: 'f',
        type: 'int',
    },
    {
        flag: 'count',
        shortcut: 'c',
        configKey: 'measurementCount',
        type: 'int',
    },
    {
        flag: 'shave',
        shortcut: 's',
        configKey: 'measurementShaveCount',
        type: 'int',
    },
    {
        flag: 'delay',
        shortcut: 'd',
        configKey: 'recordingDelay',
        type: 'int',
    },
    {
        flag: 'output',
        shortcut: 'o',
        configKey: 'outputPath',
    },
]

module.exports = possibleParameters

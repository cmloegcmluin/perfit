const config = require('./config')
const color = require('./color')
const log = require('./log')
const help = require('./help')
const possibleParameters = require('./possibleParameters')

const NODE_AND_THIS_SCRIPT = 2

const isArgument = maybeArgument => maybeArgument[0] === '-'

const separateArgumentsAndValues = commandLineArgumentsAndOrValues => {
    const separatedArgumentsAndValues = []

    commandLineArgumentsAndOrValues.forEach(argumentAndOrValue => {
        if (argumentAndOrValue.includes('=')) {
            const [argument, value] = argumentAndOrValue.split('=')
            separatedArgumentsAndValues.push(argument)
            separatedArgumentsAndValues.push(value)
        } else {
            const argumentOrValue = argumentAndOrValue
            separatedArgumentsAndValues.push(argumentOrValue)
        }
    })

    return separatedArgumentsAndValues
}

const argumentFollowedByValue = (previousElementWasArgument, currentElementIsArgument) => {
    return previousElementWasArgument && !currentElementIsArgument
}

const twoArgumentsInARow = (previousElementWasArgument, currentElementIsArgument) => {
    return previousElementWasArgument && currentElementIsArgument
}

const twoValuesInARow = (previousElementWasArgument, currentElementIsArgument) => {
    return !previousElementWasArgument && !currentElementIsArgument
}

const addArgumentAndValueCombination = (parsedArgumentsAndValues, argument, value) => {
    parsedArgumentsAndValues.push({argument, value})
}

const addPresentOrAbsentArgument = (parsedArgumentsAndValues, argument) => {
    const value = true
    addArgumentAndValueCombination(parsedArgumentsAndValues, argument, value)
}

const addParsedArgumentAndValueIfFinalElementIsArgument = (
    parsedArgumentsAndValues, finalElementWasArgument, argumentFromFinalElement
) => {
    if (finalElementWasArgument) {
        addPresentOrAbsentArgument(parsedArgumentsAndValues, argumentFromFinalElement)
    }
}

const parseArgumentsAndValues = separatedArgumentsAndValues => {
    const parsedArgumentsAndValues = []

    let argumentFromCurrentElement,
        valueFromCurrentElement,
        argumentFromPreviousElement,
        valueFromPreviousElement,
        currentElementIsArgument,
        previousElementWasArgument

    separatedArgumentsAndValues.forEach(argumentOrValue => {
        currentElementIsArgument = isArgument(argumentOrValue)
        if (currentElementIsArgument) {
            argumentFromCurrentElement = argumentOrValue
            valueFromCurrentElement = undefined
        } else {
            argumentFromCurrentElement = undefined
            valueFromCurrentElement = argumentOrValue
        }

        if (argumentFollowedByValue(previousElementWasArgument, currentElementIsArgument)) {
            addArgumentAndValueCombination(parsedArgumentsAndValues, argumentFromPreviousElement, valueFromCurrentElement)
        } else if (twoArgumentsInARow(previousElementWasArgument, currentElementIsArgument)) {
            addPresentOrAbsentArgument(parsedArgumentsAndValues, argumentFromPreviousElement)
        } else if (twoValuesInARow(previousElementWasArgument, currentElementIsArgument)) {
            log(color.magenta('You stranded a value in your command line arguments: ' + valueFromCurrentElement))
        }

        previousElementWasArgument = currentElementIsArgument
        argumentFromPreviousElement = argumentFromCurrentElement
        valueFromPreviousElement = valueFromCurrentElement
    })

    const finalElementWasArgument = previousElementWasArgument
    const argumentFromFinalElement = argumentFromPreviousElement
    addParsedArgumentAndValueIfFinalElementIsArgument(parsedArgumentsAndValues, finalElementWasArgument, argumentFromFinalElement)

    return parsedArgumentsAndValues
}

const argumentMatchesFlagOrShortcut = ({argument, flag, shortcut}) => {
    return argument.includes(`--${flag}`) || argument.includes(`-${shortcut}`)
}

const defaultConfigKeyToFlag = (configKey, flag) => configKey || flag

const formatValue = (value, type) => type === 'int' ? parseInt(value) : value

const updateConfigIfMatch = (possibleArgument, entry) => {
    const {flag, shortcut, configKey, type} = possibleArgument
    const {argument, value} = entry

    if (argumentMatchesFlagOrShortcut({argument, flag, shortcut})) {
        const configKeyWithDefaultingApplied = defaultConfigKeyToFlag(configKey, flag)
        config[configKeyWithDefaultingApplied] = formatValue(value, type)
    }
}

const checkAgainstPossibleParameters = entry => {
    possibleParameters.forEach(possibleArgument => updateConfigIfMatch(possibleArgument, entry))
}

const readCommandLineArguments = () => {
    const commandLineArgumentsAndOrValues = process.argv.slice(NODE_AND_THIS_SCRIPT)
    const separatedArgumentsAndValues = separateArgumentsAndValues(commandLineArgumentsAndOrValues)
    const parsedArgumentsAndValues = parseArgumentsAndValues(separatedArgumentsAndValues)

    parsedArgumentsAndValues.forEach(checkAgainstPossibleParameters)

    if (config.help) help()
}

module.exports = readCommandLineArguments

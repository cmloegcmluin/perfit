const CYAN = '\x1b[36m'
const MAGENTA = '\x1b[35m'
const YELLOW = '\x1b[33m'
const GREEN = '\x1b[32m'
const RESET_COLOR = '\x1b[0m'

const highlight = (text, color) => color + text + RESET_COLOR

module.exports = {
    cyan: text => highlight(text, CYAN),
    magenta: text => highlight(text, MAGENTA),
    yellow: text => highlight(text, YELLOW),
    green: text => highlight(text, GREEN),
}

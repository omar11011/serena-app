require('colors')

const { getDateTime } = require('./moment')

const logMsg = (msg, color) => {
    msg = getDateTime() + ' | ' + msg

    if (color === 'g') msg = msg.green
    else if (color === 'r') msg = msg.red
    else msg = msg.cyan

    return console.log(msg)
}

module.exports = {
    message: logMsg,
}
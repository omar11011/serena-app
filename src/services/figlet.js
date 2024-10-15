const figlet = require('figlet')

const bigMessage = msg => {
    figlet(msg, (err, data) => {
        if(err) return console.error('Ocurrió el siguiente error: ' + err)
        console.log(data)
    })
}

module.exports = {
    bigMessage,
}
const Nekotina = require('./nekotina')

module.exports = async message => {
    const id = message.author.id
    if (id === '429457053791158281') await Nekotina(message)
}
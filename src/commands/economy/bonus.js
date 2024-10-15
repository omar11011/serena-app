const Command = require('../../class/Command')
const axios = require('../../services/axios')

module.exports = new Command({
    name: 'bonus',
    description: 'Obtén monedas de recompensa.',
    cooldown: 180,
    execute: async (message, props) => {
        let money = Math.ceil(Math.random() * 10)
        let userId = message.author.id
        
        await axios.update('user', {
            userId,
            inc: { 'balance.money': money },
        })

        return message.reply(`Has ganado ${money} pokémonedas.`)
    }
})
const Command = require('../../class/Command')
const axios = require('../../services/axios')
const createEmbed = require('../../utils/createEmbed')

module.exports = new Command({
    name: 'balance',
    alias: ['bal'],
    description: 'Revisa tu balance actual.',
    execute: async (message, props) => {
        let user = await axios.get(`user/${message.author.id}`)
        
        const embed = createEmbed({
            title: `Balance de ${message.author.globalName}`,
            description: 'Actualmente tienes lo siguiente en tus fondos:',
            fields: [
                { name: 'Pokémondas', value: `$ ${user.balance.money}`, inline: true },
                { name: 'Gemas', value: `${user.balance.gems}`, inline: true },
            ],
        })

        return message.reply(embed)
    }
})
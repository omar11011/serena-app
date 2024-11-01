const Command = require('../../class/Command')
const axios = require('../../services/axios')
const createEmbed = require('../../utils/createEmbed')

module.exports = new Command({
    name: 'bang',
    description: 'Disparale a alguien. D:',
    mention: true,
    execute: async (message, props) => {
        let user = message.author.globalName
        let mention = props.mention.id === message.author.id ? null : (props.mention.globalName || props.mention.username)
        let gif = await axios.get('gif/bang')
        
        if (gif.length > 0) {
            return message.reply(createEmbed({
                color: 'random',
                description: mention ? `**${user}** le disparó a **${mention}** ¡Cuidado! >.<` : `**${message.client.user.username}** le dispara a **${user}**. >:3`,
                image: gif[0].url,
            }))
        }
    }
})
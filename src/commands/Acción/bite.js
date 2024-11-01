const Command = require('../../class/Command')
const axios = require('../../services/axios')
const createEmbed = require('../../utils/createEmbed')

module.exports = new Command({
    name: 'bite',
    description: 'Muerde al usuario mencionado. O deja que yo te muerda. owo',
    mention: true,
    execute: async (message, props) => {
        let user = message.author.globalName
        let mention = props.mention.id === message.author.id ? null : (props.mention.globalName || props.mention.username)
        let gif = await axios.get('gif/bite')
        
        if (gif.length > 0) {
            return message.reply(createEmbed({
                color: 'random',
                description: mention ? `¡**${user}** le da un mordisco juguetón a **${mention}**!` : `Ñam... -muerde a **${user}**`,
                image: gif[0].url,
            }))
        }
    }
})
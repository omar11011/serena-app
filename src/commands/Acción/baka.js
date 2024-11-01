const Command = require('../../class/Command')
const axios = require('../../services/axios')
const createEmbed = require('../../utils/createEmbed')

module.exports = new Command({
    name: 'baka',
    description: '¡BAKA!',
    mention: true,
    execute: async (message, props) => {
        let user = message.author.globalName
        let mention = props.mention.id === message.author.id ? null : (props.mention.globalName || props.mention.username)
        let gif = await axios.get('gif/baka')
        
        if (gif.length > 0) {
            return message.reply(createEmbed({
                color: 'random',
                description: `**${mention || user}**, ¡¡BAKA!!`,
                image: gif[0].url,
            }))
        }
    }
})
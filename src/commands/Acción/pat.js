const Command = require('../../class/Command')
const axios = require('../../services/axios')
const createEmbed = require('../../utils/createEmbed')

module.exports = new Command({
    name: 'pat',
    description: 'Acaricia a alguien del servidor.',
    mention: true,
    execute: async (message, props) => {
        let user = message.author.globalName
        let mention = props.mention.id === message.author.id ? null : (props.mention.globalName || props.mention.username)
        if (!mention) return message.reply(`Lo siento >o< pero debes **mencionar** a alguien.`)

        let gif = await axios.get('gif/pat')
        
        if (gif.length > 0) {
            return message.reply(createEmbed({
                color: 'random',
                description: `**${user}** acarició a ${mention}.`,
                image: gif[0].url,
            }))
        }
    }
})
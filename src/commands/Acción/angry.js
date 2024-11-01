const Command = require('../../class/Command')
const axios = require('../../services/axios')
const createEmbed = require('../../utils/createEmbed')

module.exports = new Command({
    name: 'angry',
    description: 'Expresa que estás enfadado.',
    mention: true,
    execute: async (message, props) => {
        let user = message.author.globalName
        let mention = props.mention.id === message.author.id ? null : (props.mention.globalName || props.mention.username)
        let gif = await axios.get('gif/angry')
        
        if (gif.length > 0) {
            return message.reply(createEmbed({
                color: 'random',
                description: mention ? `¡**${user}** se enojó con **${mention}**!` : `**${user}** se enojó.`,
                image: gif[0].url,
            }))
        }
    }
})
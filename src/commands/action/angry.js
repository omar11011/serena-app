const Command = require('../../class/Command')
const axios = require('../../services/axios')
const createEmbed = require('../../utils/createEmbed')

module.exports = new Command({
    name: 'angry',
    description: 'Expresa tu molestia al mundo.',
    execute: async (message, props) => {
        const { url } = await axios.get('image/random?folder=gifs&subfolder=angry')
        const embed = createEmbed({
            description: `**${message.author.globalName}** se enojó.`,
            image: url,
        })

        return message.reply(embed)
    }
})
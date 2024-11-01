const Command = require('../../class/Command')
const axios = require('../../services/axios')
const createEmbed = require('../../utils/createEmbed')

module.exports = new Command({
    name: 'habitat',
    description: 'Muestra información de los habitat Pokémon.',
    cooldown: 4,
    execute: async (message, props) => {
        const embed = {}

        if (props.args.length > 0) {
            const habitat = props.args.join(' ')
            const data = await axios.get(`pokemon-habitat/${habitat}`)
            
            if (data.error) return message.reply(createEmbed({
                color: 'red',
                description: data.error,
            }))

            embed.title = data.name
            embed.description = data.description
            embed.thumbnail = data.image
        }
        else {
            const { results } = await axios.get('pokemon-habitat')

            embed.author = 'Habitats Pokémon'
            embed.description = 'Estos son los habitats disponibles:\n\n' + results.map(e => `${e.emoji} ${e.name}`).join('\n')
        }

        return message.reply(createEmbed(embed))
    }
})
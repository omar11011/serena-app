const Command = require('../../class/Command')
const axios = require('../../services/axios')
const createEmbed = require('../../utils/createEmbed')

module.exports = new Command({
    name: 'type',
    alias: ['tipo'],
    description: 'Muestra información de los tipo Pokémon.',
    cooldown: 4,
    execute: async (message, props) => {
        const embed = {}

        if (props.args.length > 0) {
            const type = props.args.join(' ')
            const data = await axios.get(`pokemon-type/${type}`)
            
            if (data.error) return message.reply(createEmbed({
                color: 'red',
                description: data.error,
            }))
            
            embed.title = `${data.emoji} ${data.name}`

            embed.description = '<:damagex2:1299271812600954885> ' + (data.effectiveness.superEffective.join(', ') || 'Ninguno')
            embed.description += `\n1️⃣ ` + (data.effectiveness.ineffective.join(', ') || 'Ninguno')
            embed.description += '\n<:damage0:1299273049761120307> ' + (data.effectiveness.doesNotAffect.join(', ') || 'Ninguno')

            embed.image = data.image
        }
        else {
            const { results } = await axios.get('pokemon-type')

            embed.author = 'Tipos Pokémon'
            embed.description = 'Estos son los tipos Pokémon disponibles:\n\n' + results.map(e => `${e.emoji} ${e.name}`).join('\n')
        }

        return message.reply(createEmbed(embed))
    }
})
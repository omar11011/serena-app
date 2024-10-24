const Command = require('../../class/Command')
const axios = require('../../services/axios')
const Data = require('../../data')
const createEmbed = require('../../utils/createEmbed')

module.exports = new Command({
    name: 'learn',
    description: 'Has que tu Pokémon aprenda un nuevo movimiento.',
    cooldown: 4,
    args: ['movement'],
    execute: async (message, props) => {
        if (!props.user) return message.reply(createEmbed({
            color: 'red',
            description: 'No tienes ningún Pokémon seleccionado.'
        }))
        
        let nameNewMove = props.args.join(' ')
        let pokemon = await axios.get(`pokemon/${props.user.pokemon}`)
        let levelMove = pokemon.movements.filter(e => e.type === 'nivel')
        if (levelMove.length >= 4) return message.reply(createEmbed({
            color: 'red',
            description: `**${pokemon.traits.nickname || pokemon.pokemon}** ya no puede aprender más movimientos.`,
        }))

        let currentMoves = pokemon.movements.map(e => e.name.toLowerCase())
        if (currentMoves.includes(nameNewMove)) {
            return message.reply(createEmbed({
                color: 'yellow',
                description: `**${pokemon.traits.nickname || pokemon.pokemon}** ya había aprendido este movimiento anteriormente.`,
            }))
        }

        let form = await Data.get('form', pokemon.pokemon)
        if (!form) return message.react('❓')
        else form = await form.data()

        let moves = form.movements.filter(e => e.type === 'nivel')
        let newMove = moves.find(e => e.name.toLowerCase() === nameNewMove)

        if (!newMove) return message.react('❓')
        if (newMove.level > pokemon.status.level) return message.reply(createEmbed({
            color: 'yellow',
            description: `**${pokemon.traits.nickname || pokemon.pokemon}** aún no tiene el nivel necesario para aprender este movimiento.`,
        }))

        pokemon.movements.push({ name: newMove.name })
        await axios.update('pokemon', {
            _id: pokemon._id,
            set: { movements: pokemon.movements },
        })
        
        return message.reply(createEmbed({
            description: `**${pokemon.traits.nickname || pokemon.pokemon}** ha aprendido **${newMove.name}**.`,
        }))
    }
})
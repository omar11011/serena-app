const Command = require('../../class/Command')
const axios = require('../../services/axios')
const Data = require('../../data')
const createEmbed = require('../../utils/createEmbed')

module.exports = new Command({
    name: 'learn',
    description: 'Has que tu Pokémon aprenda un nuevo movimiento.',
    cooldown: 4,
    args: ['movement'],
    useInTrade: false,
    useInDuel: false,
    execute: async (message, props) => {
        if (!props.user.pokemon) return message.reply('No tienes ningún Pokémon seleccionado.')
        
        let nameNewMove = props.args.join(' ')
        let newMove = await axios.get(`pokemon-movement/${nameNewMove}`)

        if (newMove.error) return message.reply(newMove.error)

        let pokemon = await axios.get(`pokemon-capture/${props.user.pokemon}`)
        if (!pokemon) return message.reply('Este Pokémon no está disponible.')
        let moveCanLearn = pokemon.pokemon.movements.byLevel
        newMove = moveCanLearn.find(e => e.name === newMove.name)

        if (!newMove) return message.reply(`${pokemon.traits.nickname || pokemon.pokemon.name} no puede aprender este movimiento.`)

        let learned = pokemon.movements.byLevel.map(e => e.name)
        if (learned.length >= 4) return message.reply(`**${pokemon.traits.nickname || pokemon.pokemon.name}** ya no puede aprender más movimientos.`)

        let currentMoves = learned.concat(pokemon.movements.byMachine, pokemon.movements.byTutor)
        if (currentMoves.includes(newMove.name)) return message.reply(`**${pokemon.pokemon.name}** ya había aprendido este movimiento anteriormente.`)

        if (newMove.level > pokemon.status.level) return message.reply(`**${pokemon.traits.nickname || pokemon.pokemon.name}** aún no tiene el nivel necesario para aprender este movimiento.`)

        pokemon.movements.byLevel.push(newMove.name)
        await axios.update('pokemon-capture', {
            _id: pokemon._id,
            set: { movements: pokemon.movements },
        })
        
        return message.reply(`**${pokemon.traits.nickname || pokemon.pokemon.name}** ha aprendido **${newMove.name}**.`)
    }
})
const Command = require('../../class/Command')
const axios = require('../../services/axios')
const createEmbed = require('../../utils/createEmbed')

module.exports = new Command({
    name: 'forget',
    description: 'Has que tu Pokémon olvide un movimiento aprendido.',
    cooldown: 4,
    args: ['movement'],
    useInTrade: false,
    useInDuel: false,
    execute: async (message, props) => {
        if (!props.user.pokemon) return message.reply('No tienes ningún Pokémon seleccionado.')
        
        let nameMove = props.args.join(' ')
        let movement = await axios.get(`pokemon-movement/${nameMove}`)
        if (movement.error) return message.reply(movement.error)

        let pokemon = await axios.get(`pokemon-capture/${props.user.pokemon}`)
        if (!pokemon) return message.reply('Este Pokémon no está disponible.')
        
        let movements = pokemon.movements.byLevel.concat(pokemon.movements.byMachine, pokemon.movements.byTutor)
        if (!movements.includes(movement.name)) return message.reply(`${pokemon.pokemon.name} no había aprendido ${movement.name}.`)
        
        pokemon.movements.byLevel = pokemon.movements.byLevel.filter(e => e !== movement.name)
        pokemon.movements.byMachine = pokemon.movements.byMachine.filter(e => e !== movement.name)
        pokemon.movements.byTutor = pokemon.movements.byTutor.filter(e => e !== movement.name)

        await axios.update('pokemon-capture', {
            _id: pokemon._id,
            set: { movements: pokemon.movements },
        })
        
        return message.reply(`**${pokemon.traits.nickname || pokemon.pokemon.name}** ha olvidado **${movement.name}**.`)
    }
})
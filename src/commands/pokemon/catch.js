const Command = require('../../class/Command')
const axios = require('../../services/axios')
const memcached = require('../../services/memcached')
const createEmbed = require('../../utils/createEmbed')
const createCapture = require('../../utils/createCapture')

module.exports = new Command({
    name: 'catch',
    alias: ['captura', 'capturar'],
    description: 'Captura un Pokémon salvaje.',
    args: ['name'],
    execute: async (message, props) => {
        const answer = props.args.join(' ')
        const spawn = await memcached.getData(`spawn-${message.channel.id}`)

        if (!spawn) return message.react('❓')
        if (answer !== spawn.pokemon.toLowerCase() && answer !== spawn.specie.toLowerCase()) return message.react('❌')

        let pokemon = await createCapture({
            pokemon: spawn.pokemon,
        })

        if (!pokemon) return

        pokemon.owner = props.user._id
        
        await axios.create('pokemon-capture', pokemon)
        await memcached.deleteData(`spawn-${message.channel.id}`)

        return message.reply(createEmbed({
            description: `¡Felicidades! Has capturado a ${pokemon.features.isShiny ? '⭐ ' : ''}**${pokemon.form}** nivel ${pokemon.status.level}.`,
        }))
    }
})
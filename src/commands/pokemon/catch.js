const Command = require('../../class/Command')
const axios = require('../../services/axios')
const memcached = require('../../services/memcached')
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
        if (answer !== spawn.pokemon.toLowerCase() && answer !== spawn.specie) return message.react('❌')

        let user = await axios.update('user', { userId: message.author.id })
        let pokemon = await createCapture({
            data: { pokemon: spawn.pokemon },
        })

        if (!pokemon) return

        pokemon.owner = user._id

        await axios.create('pokemon', pokemon)

        return message.reply(`¡Felicidades! Has capturado a ${pokemon.features.isShiny ? '⭐ ' : ''}**${pokemon.pokemon}** nivel ${pokemon.status.level}.`)
    }
})
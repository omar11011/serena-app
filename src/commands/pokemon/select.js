const Command = require('../../class/Command')
const axios = require('../../services/axios')
const createEmbed = require('../../utils/createEmbed')

module.exports = new Command({
    name: 'select',
    description: 'Selecciona un Pokémon.',
    args: ['id'],
    cooldown: 4,
    execute: async (message, props) => {
        let { user, args } = props
        let id = args[0]
        let limit = 20

        if (isNaN(id) || parseInt(id) < 1) return message.react('❓')
        else id = parseInt(id)
        
        let page = Math.ceil(id / limit)
        let index = id - (page - 1) * limit - 1
        let data = await axios.get(`pokemon-capture/user/${user._id}?page=${page}`)
        if (data.results.length < 1 || !data.results[index]) return message.react('❓')

        let pokemon = data.results[index]
        if (pokemon._id === user.pokemon) {
            return message.reply(createEmbed({
                color: 'yellow',
                description: `Ya tenías seleccionado a **${pokemon.pokemon.name}**.`,
            }))
        }
        
        if (user.pokemon) {
            await axios.update('pokemon-capture', {
                _id: user.pokemon,
                set: { 'options.isSelected': false },
            })
        }

        await axios.update('pokemon-capture', {
            _id: pokemon._id,
            set: { 'options.isSelected': true },
        })
        await user.setPokemon(pokemon._id)

        return message.reply(createEmbed({
            description: `Acabas de seleccionar a **${pokemon.pokemon.name}** como compañero.`,
        }))
    }
})
const Command = require('../../class/Command')
const axios = require('../../services/axios')

module.exports = new Command({
    name: 'select',
    description: 'Selecciona un Pokémon.',
    args: ['id'],
    execute: async (message, props) => {
        let id = props.args[0]
        let limit = 20

        if (isNaN(id) || parseInt(id) < 1) return message.react('❓')
        else id = parseInt(id)

        let page = Math.ceil(id / limit)
        let index = id - (page - 1) * limit - 1
        let data = await axios.get(`pokemon/captures/${props.user.id}?page=${page}`)
        if (data.results.length < 1 || !data.results[index]) return message.react('❓')

        let pokemon = data.results[index]
        
        let current = await axios.get(`pokemon/captures/${props.user.id}?select=true`)
        current.results.forEach(async e => {
            await axios.update('pokemon', {
                _id: e._id,
                set: { 'options.isSelected': false },
            })
        })

        await axios.update('pokemon', {
            _id: pokemon._id,
            set: { 'options.isSelected': true },
        })

        return message.reply(`Acabas de seleccionar a **${pokemon.traits.nickname || pokemon.pokemon}** como compañero.`)
    }
})
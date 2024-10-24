const Command = require('../../class/Command')
const axios = require('../../services/axios')
const createEmbed = require('../../utils/createEmbed')
const DATA = require('../../data')

module.exports = new Command({
    name: 'info',
    description: 'Muestra información de tu pokémon seleccionado o el último capturado.',
    execute: async (message, props) => {
        let { user, args } = props
        let pokemon = null

        if (args[0] && !isNaN(args[0]) && parseInt(args[0]) > 0) {
            let id = parseInt(args[0])
            let limit = 20
            let page = Math.ceil(id / limit)
            let index = id - (page - 1) * limit - 1
            let data = await axios.get(`pokemon/captures/${user._id}?page=${page}`)
            if (data.results.length < 1 || !data.results[index]) return message.react('❓')
            pokemon = data.results[index]
        }
        else if (!args[0]) {
            if (!user.pokemon) {
                return message.reply(createEmbed({
                    color: 'red',
                    description: `No tienes ningún pokémon seleccionado.`,
                }))
            }
            else pokemon = await axios.get(`pokemon/${user.pokemon}`)
        }
        if (!pokemon) return message.react('❓')
            
        let form = await DATA.get('form', pokemon.pokemon)
        let powers = form.setStatsPower(pokemon)
        form = await form.data()
        
        let specie = await form.specie.data()
        let xpNeeded = specie.growth.xpNeeded(pokemon.status.level)
        
        let embed = {
            color: form.type[0]._name,
            title: (pokemon.features.isShiny ? '⭐ ' : '') + (pokemon.traits.nickname || pokemon.pokemon),
            description: `Tu ${pokemon.pokemon} actualmente está en el nivel ${pokemon.status.level} y su XP es de ${pokemon.status.xp}/${xpNeeded}. ${pokemon.traits.gender ? 'Es de género ' + (pokemon.traits.gender === 'male' ? 'masculino' : 'femenino') : 'No tiene género'} y de naturaleza ${pokemon.traits.nature.toLowerCase()}.\nTiene ${pokemon.status.friendship} puntos de amistad contigo y su IV es de ${pokemon.status.iv}%.`,
            fields: Object.keys(pokemon.stats).map(e => {
                let name = 'Salud'
                if (e === 'attack') name = 'Ataque'
                else if (e === 'defense') name = 'Defense'
                else if (e === 'spattack') name = 'Ataque Esp.'
                else if (e === 'spdefense') name = 'Defensa Esp.'
                else if (e === 'speed') name = 'Velocidad'

                return {
                    name,
                    value: `${powers[e]}\n${pokemon.stats[e]}/31\nEP: ${pokemon.effortValues[e]}/100`,
                    inline: true }
            }),
            image: form.image[pokemon.features.isShiny ? 'shiny' : 'default'],
            footer: `Capturado el ${(new Date(pokemon.createdAt)).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })}`
        }
        
        return message.reply(createEmbed(embed))
    }
})
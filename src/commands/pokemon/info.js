const Command = require('../../class/Command')
const axios = require('../../services/axios')
const createEmbed = require('../../utils/createEmbed')
const DATA = require('../../data')

module.exports = new Command({
    name: 'info',
    description: 'Muestra información de tu pokémon seleccionado o el último capturado.',
    execute: async (message, props) => {
        if (!props.user.pokemon) return message.reply(`No tienes ningún pokémon seleccionado.`)

        let pokemon = await axios.get(`pokemon/${props.user.pokemon}`)
        let form = await DATA.get('form', pokemon.pokemon)
        let powers = form.setStatsPower(pokemon)

        form = await form.data()

        let specie = await form.specie.data()
        let xpNeeded = specie.growth.xpNeeded(pokemon.status.level)
        
        let embed = {
            color: 'green',
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
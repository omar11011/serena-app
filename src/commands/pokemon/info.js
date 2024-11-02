const Command = require('../../class/Command')
const axios = require('../../services/axios')
const createEmbed = require('../../utils/createEmbed')

const calculateXpNeeded = require('../../functions/xpNeeded')
const calculatePowers = require('../../functions/powerOfStats')

module.exports = new Command({
    name: 'info',
    description: 'Muestra información de tu pokémon seleccionado o el último capturado.',
    execute: async (message, props) => {
        let pokemonId = props.user.pokemon
        if (props.args.includes('latest')) {
            let { results } = await axios.get(`pokemon-capture/user/${props.user._id}?latest=yes`)
            if (results.length > 0) pokemonId = results[0]._id
        }
        if (!pokemonId) return message.react('❓')
        let data = await axios.get(`pokemon-capture/${pokemonId}`)

        if (!data) return message.reply(createEmbed({
            color: 'red',
            description: 'No tienes seleccionado ningún Pokémon.',
        }))
        
        let xpNeeded = calculateXpNeeded(data)
        let statPowers = calculatePowers(data)
        
        let embed = {
            color: data.pokemon.type[0].name,
            title: (data.features.isShiny ? '⭐ ' : '') + (data.traits.nickname || data.pokemon.name),
            fields: Object.keys(data.stats).map(e => {
                let name = 'Salud'
                if (e === 'attack') name = 'Ataque'
                else if (e === 'defense') name = 'Defense'
                else if (e === 'spattack') name = 'Ataque Esp.'
                else if (e === 'spdefense') name = 'Defensa Esp.'
                else if (e === 'speed') name = 'Velocidad'

                return {
                    name,
                    value: `${statPowers[e]}\n${data.stats[e]}/31\nEP: ${data.effortValues[e]}/100`,
                    inline: true
                }
            }),
            thumbnail: data.image,
            footer: `Capturado el ${(new Date(data.createdAt)).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })}`
        }

        embed.description = `Tu ${data.pokemon.name} actualmente está en el nivel ${data.status.level} y su XP es de ${data.status.xp}/${xpNeeded}.\n`
        embed.description += `${data.traits.gender ? 'Es de género ' + data.traits.gender : 'No tiene género'} y es de naturaleza ${data.traits.nature.name.toLowerCase()}.\n`
        embed.description += `Tiene ${data.status.friendship} puntos de amistad contigo y su IV es de ${data.status.iv}%.`
        
        return message.reply(createEmbed(embed))
    }
})
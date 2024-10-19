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
        let form = await (await DATA.get('form', pokemon.pokemon)).data()
        let specie = await form.specie.data()
        let xpNeeded = specie.growth.xpNeeded(pokemon.status.level)
        
        let embed = {
            color: 'green',
            title: (pokemon.features.isShiny ? '⭐ ' : '') + (pokemon.traits.nickname || pokemon.pokemon),
            description: `Nivel: ${pokemon.status.level}\nXP: ${pokemon.status.xp}/${xpNeeded}\nAmistad: ${pokemon.status.friendship}\nIV: ${pokemon.status.iv}%`,
            fields: Object.keys(pokemon.stats).map(e => {
                let name = 'Salud'
                if (e === 'attack') name = 'Ataque'
                else if (e === 'defense') name = 'Defense'
                else if (e === 'spattack') name = 'Ataque Esp.'
                else if (e === 'spdefense') name = 'Defensa Esp.'
                else if (e === 'speed') name = 'Velocidad'

                return { name, value: `${pokemon.stats[e]}/31\nEP: ${pokemon.effortValues[e]}/100`, inline: true }
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
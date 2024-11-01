const Command = require('../../class/Command')
const axios = require('../../services/axios')
const createEmbed = require('../../utils/createEmbed')

module.exports = new Command({
    name: 'pokedex',
    alias: ['dex'],
    description: 'Obtén información de la Pokédex de un Pokémon.',
    args: ['pokémon'],
    execute: async (message, props) => {
        let shiny = props.args.includes('shiny')
        let name = props.args.filter(e => e !== 'shiny').join(' ')
        let pokemon = await axios.get(`pokemon-form/${name}`)

        if (pokemon.error) return message.reply(createEmbed({
            color: 'red',
            description: pokemon.error,
        }))

        const embed = createEmbed({
            color: pokemon.type[0].name,
            title: (shiny ? '⭐ ' : '') + pokemon.name,
            author: (!isNaN(pokemon.specie.pokedex) ? '#' : '') + `${pokemon.specie.pokedex} ${pokemon.specie.name}`,
            description: `Tipo: ${pokemon.type.map(e => e.name).join(' / ')}\nCrecimiento: ${pokemon.specie.growth.name}\nGrupo Huevo: ${pokemon.specie.eggGroup.map(e => e.name).join(' / ')}\nAmistad base: ${pokemon.specie.friendship}\nRatio de captura: ${pokemon.specie.captureRatio}`,
            fields: [
                { name: 'Salud', value: String(pokemon.stats.hp), inline: true },
                { name: 'Ataque', value: String(pokemon.stats.attack), inline: true },
                { name: 'Defensa', value: String(pokemon.stats.defense), inline: true },
                { name: 'Ataque Esp.', value: String(pokemon.stats.spattack), inline: true },
                { name: 'Defensa Esp.', value: String(pokemon.stats.spdefense), inline: true },
                { name: 'Velocidad', value: String(pokemon.stats.speed), inline: true },
            ],
            image: pokemon.image[shiny ? 'shiny' : 'default'],
        })
        
        return message.reply(embed)
    }
})
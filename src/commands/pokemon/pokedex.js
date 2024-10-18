const Command = require('../../class/Command')
const Data = require('../../data')
const createEmbed = require('../../utils/createEmbed')

module.exports = new Command({
    name: 'pokedex',
    alias: ['dex'],
    description: 'Obtén información de la Pokédex de un Pokémon.',
    args: ['pokémon'],
    execute: async (message, props) => {
        let shiny = props.args.includes('shiny') ? true : false
        let text = props.args.filter(e => e !== 'shiny').join(' ')
        let pokemon = await Data.get('form', text)
        if (!pokemon) return message.react('❓')

        pokemon = await pokemon.data()
        let specie = await pokemon.specie.data()
        let types = pokemon.type.map(e => e.data().name)
        let egg = specie.eggGroup.map(e => e.data().name)
        let growth = specie.growth.data().name
        let image = pokemon.image.default

        if (shiny) image = pokemon.image.shiny
        console.log(image)
        const embed = createEmbed({
            color: types[0],
            title: (image && shiny ? '⭐ ' : '') + pokemon.name,
            author: (parseInt(specie.pokedex) ? '#' : '') + `${specie.pokedex} ${specie.name}`,
            description: `Tipo: ${types.join(' / ')}\nCrecimiento: ${growth}\nGrupo Huevo: ${egg.join(' / ')}\nAmistad base: ${specie.friendship}\nRatio de captura: ${specie.captureRatio}`,
            fields: [
                { name: 'Salud', value: String(pokemon.stats.hp), inline: true },
                { name: 'Ataque', value: String(pokemon.stats.attack), inline: true },
                { name: 'Defensa', value: String(pokemon.stats.defense), inline: true },
                { name: 'Ataque Esp.', value: String(pokemon.stats.spattack), inline: true },
                { name: 'Defensa Esp.', value: String(pokemon.stats.spdefense), inline: true },
                { name: 'Velocidad', value: String(pokemon.stats.speed), inline: true },
            ],
            image,
        })
        
        return message.reply(embed)
    }
})
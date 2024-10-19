const DATA = require('../data')

module.exports = async props => {
    const pokemon = {}
    const { data, userIsVip, redeem } = props

    Object.keys(data).forEach(e => {
        pokemon[e] = data[e]
    })

    let form = await DATA.get('form', pokemon.pokemon)

    if (!form) return null
    else {
        form = await form.data()
    }

    if (form.isMega || form.isGiga) return null

    // Bases
    let levelBase = 15
    let shinyBase = 1
    let dynamaxBase = 10
    let statBase = 0

    // Config
    if (userIsVip) {
        levelBase += 5
        shinyBase += 15
        statBase += 15
        dynamaxBase += 40
    }
    if (redeem) {
        levelBase += 10
        shinyBase += 30
        statBase = 27
        dynamaxBase = 70
    }

    // Props
    pokemon.pokemon = form.name
    pokemon.traits = {
        gender: form.specie.setGender(),
        nature: form.nature.random(),
    }
    pokemon.status = {
        level: Math.ceil(Math.random() * levelBase),
        friendship: form.specie._friendship,
        iv: 0,
    }
    pokemon.features = {
        isShiny: Math.random() < shinyBase / 4096,
        isDynamax: Math.random() < dynamaxBase / 100,
        isLegendary: form.isLegendary,
        isMythical: form.isMythical,
        isUltraBeast: form.isUltraBeast,
    }
    
    Object.keys(form.stats).forEach(e => {
        if (!pokemon.stats) pokemon.stats = {}
        pokemon.stats[e] = statBase + Math.floor(Math.random() * (32 - statBase))
        pokemon.status.iv += pokemon.stats[e]
    })
    pokemon.status.iv = (pokemon.status.iv / (31 * 6) * 100).toFixed(2)
    
    return pokemon
}
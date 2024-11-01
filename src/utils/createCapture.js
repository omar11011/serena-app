const DATA = require('../data')
const axios = require('../services/axios')

module.exports = async props => {
    const pokemon = {}
    const data = await axios.get(`pokemon-form/${props.pokemon}`)
    const nature = await axios.get('pokemon-nature/random')

    // Bases
    let levelBase = 15
    let shinyBase = 1
    let dynamaxBase = 10
    let statBase = 0

    // Config
    if (props.userIsVip) {
        levelBase += 5
        shinyBase += 15
        statBase += 15
        dynamaxBase += 40
    }
    if (props.redeem) {
        levelBase += 10
        shinyBase += 30
        statBase = 27
        dynamaxBase = 70
    }

    // Props
    pokemon.pokemon = data._id
    pokemon.form = data.name
    pokemon.traits = {
        gender: !data.specie.gender ? null : (Math.random() * 100 > data.specie.gender.male ? 'femenino' : 'masculino'),
        nature: nature._id,
    }
    pokemon.status = {
        level: 1 + Math.ceil(Math.random() * levelBase),
        friendship: data.specie.friendship,
        iv: 0,
    }
    pokemon.features = {
        isShiny: Math.random() < shinyBase / 4096,
        isDynamax: Math.random() < dynamaxBase / 100,
        isLegendary: data.features.isLegendary,
        isMythical: data.features.isMythical,
        isUltraBeast: data.features.isUltraBeast,
    }
    
    Object.keys(data.stats).forEach(e => {
        if (!pokemon.stats) pokemon.stats = {}
        pokemon.stats[e] = statBase + Math.floor(Math.random() * (32 - statBase))
        pokemon.status.iv += pokemon.stats[e]
    })
    pokemon.status.iv = (pokemon.status.iv / (31 * 6) * 100).toFixed(2)
    
    return pokemon
}
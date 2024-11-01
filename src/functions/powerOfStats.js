module.exports = pokemon => {
    const power = {}
    const level = pokemon.status.level
    const effects = pokemon.traits.nature.effects
    
    Object.keys(pokemon.stats).forEach(e => {
        const iv = pokemon.stats[e]
        const base = pokemon.pokemon.stats[e]
        const ev = pokemon.effortValues[e]
        
        power[e] = (2 * base + iv + ev / 4) * level / 100
        
        if (e === 'hp') {
            power[e] = power[e] + level + 10
            power[e] *= (1 + (3 / Math.pow(level, 0.5)))
        }
        else power[e] = (power[e] + 5) * (10 + effects[e]) / 10

        power[e] = Math.round(power[e])
    })
    
    return power
}
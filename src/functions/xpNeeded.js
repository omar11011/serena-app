module.exports = data => {
    let level = data.status.level
    let growth = data.pokemon.specie.growth.name
    let base = Math.pow(level, 3)

    if (growth === 'Rápido') return Math.ceil(0.8 * base)
    if (growth === 'Normal') return base
    if (growth === 'Lento') return Math.ceil(1.25 * base)
    if (growth === 'Parabólico') return Math.ceil(1.2 * base - 15 * Math.pow(level, 2) + 100 * level - 140)
    if (growth === 'Errático') {
        if (level <= 50) return Math.ceil(base * (2 - 0.02 * level))
        if (level > 50 && level <= 68) return Math.ceil(base * (1.5 - 0.01 * level))
        if (level > 68 && level <= 98) {
            let resto = n % 3
            let p = 0
            if (resto === 1) p = 0.008
            else if (resto === 2) p = 0.014
            return Math.ceil(base * (1.274 - 0.02 * level / 3 - p))
        }
        if (level > 98) return Math.ceil(base * (1.6 - 0.01 * level))
    }
    return 1000000
}
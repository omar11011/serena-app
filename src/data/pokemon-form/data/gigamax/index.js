module.exports = [
    require('./03-venusaur.json'),
    require('./06-charizard.json'),
    require('./09-blastoise.json'),
].map(e => {
    e.isGiga = true
    return e
})
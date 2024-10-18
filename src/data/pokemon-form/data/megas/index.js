module.exports = [
    require('./03-venusaur.json'),
    require('./06-charizard-x.json'),
    require('./06-charizard-y.json'),
    require('./09-blastoise.json'),
].map(e => {
    e.isMega = true
    return e
})
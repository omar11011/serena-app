module.exports = {
    Class: require('./class'),
    Data: require('./data.json').map(e => {
        return {
            name: e,
        }
    })
}
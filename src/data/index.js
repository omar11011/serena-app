const capitalizeWord = require('../utils/capitalizeWords')

const getData = async (key, value) => {
    try {
        const { Class, Data } = require(`./pokemon-${key}`)
        const result = Data.find(e => capitalizeWord(e.name) === capitalizeWord(value))
        return new Class(result)
    }
    catch {
        return null
    }
}

module.exports = {
    get: getData,
}
const capitalizeWord = require('../utils/capitalizeWords')

const getData = async (key, value) => {
    try {
        let { Class, Data } = require(`./pokemon-${key}`)
        let result = Data.find(e => capitalizeWord(e.name) === capitalizeWord(value))

        result = JSON.parse(JSON.stringify(result))

        return new Class(result)
    }
    catch {
        return null
    }
}

module.exports = {
    get: getData,
}
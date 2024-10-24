const data = require("../json/colors.json")
const capitalizeWord = require('./capitalizeWords')

const randomColor = () => {
    let colors = Object.keys(data)
    let index = Math.floor(Math.random() * colors.length)
    
    return colors[index]
}

const getColor = name => {
    if (!name) name = 'LimeGreen'
    name = name.toLowerCase()
    let color = Object.keys(data).find(e => capitalizeWord(e) === capitalizeWord(name))
    color = data[color]
    if (!color) color = data[randomColor()]

    return {
        hexa: color,
        int: parseInt(color.slice(1), 16),
    }
}

module.exports = {
    randomColor,
    getColor,
}
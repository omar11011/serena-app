module.exports = str => {
    return str
        .toLowerCase()
        .replace(/[\u0300-\u036f]/g, '')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}
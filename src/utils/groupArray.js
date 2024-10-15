module.exports = data => {
    const groupSize = 100
    const result = []
    
    for (let i = 0; i < data.length; i += groupSize) {
        const group = data.slice(i, i + groupSize)
        result.push(group)
    }
  
    return result
}
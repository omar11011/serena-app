const axios = require('../services/axios')

const categories = ['Acción']

module.exports = async message => {
    const commands = message.client.commands.filter(e => categories.includes(e.category)).map(e => e.name)

    if (message.embeds.length > 0) {
        let category = null
        let embed = message.embeds[0].data
        let messages = await message.channel.messages.fetch({ limit: 3 })

        messages.forEach(e => {
            for (let i = 0; i < commands.length; i++) {
                if (e.content.includes(commands[i])) category = commands[i]
            }
        })

        if (category) {
            await axios.create('gif', {
                category,
                url: embed.image.url
            })
        }
    }
}
const { Events } = require('discord.js')
const axios = require('../services/axios')

module.exports = {
	name: Events.UserUpdate,
	async execute(oldUser, newUser) {
        const discordData = {}

        Object.keys(oldUser).forEach(e => {
            discordData[e] = newUser[e]
        })

        if (Object.keys(discordData).length > 0) {
            await axios.update('user', {
                userId: newUser.id,
                set: { discordData },
            })
        }
	},
}

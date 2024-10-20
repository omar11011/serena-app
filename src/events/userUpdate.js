const { Events } = require('discord.js')
const axios = require('../services/axios')

module.exports = {
	name: Events.UserUpdate,
	async execute(oldUser, newUser) {
        const newData = {}

        Object.keys(oldUser).forEach(e => {
            newData[e] = newUser[e]
        })

        if (Object.keys(newData).length > 0) {
            await axios.update('user', {
                userId: newUser.id,
                set: { discordData: newData },
            })
        }
	},
}

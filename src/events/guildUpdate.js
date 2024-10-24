const { Events } = require('discord.js')
const axios = require('../services/axios')

module.exports = {
	name: Events.GuildUpdate,
	async execute(oldGuild, newGuild) {
        const newData = {}
        console.log(oldGuild)
        Object.keys(oldGuild).forEach(e => {
            newData[e] = newGuild[e]
        })

        if (Object.keys(newData).length > 0) {
            // await axios.update('guild', {
            //     userId: newGuild.id,
            //     set: { discordData: newData },
            // })
        }
	},
}

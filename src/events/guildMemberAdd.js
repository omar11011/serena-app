const { Events } = require('discord.js')
const axios = require('../services/axios')

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
        await axios.create('user', {
            userId: member.user.id,
            discordData: member.user,
        })
	},
}

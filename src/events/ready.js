const { Events } = require('discord.js')
const { bigMessage } = require('../services/figlet')

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		bigMessage(client.user.username)
	},
};
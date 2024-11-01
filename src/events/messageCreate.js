const { Events } = require('discord.js')

const Colors = require('../services/colors')
const User = require('../class/User')
const Guild = require('../class/Guild')
const Bots = require('../bots')

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
        if (message.author.bot) return await Bots(message)
        
        const user = new User(message.author.id)
        const guild = new Guild(message.guild.id)
        
        await user.load(message.author)
        await guild.load(message.guild)

        let checkChannelPermissions = guild.checkChannelPermissions(message)
        if (!checkChannelPermissions) return
        
        if (!message.content.startsWith(guild.prefix)) {
            // Mención al bot
            if (message.mentions.users.has(message.client.user.id)) {
                return message.reply(`Mi prefijo en el servidor es: ` + '`' + guild.prefix +'`')
            }

            if (message.content.length > 5) {
                await user.addXP(1)
                await guild.addXP(1)
                await guild.event(message, 1)
            }
            
            return
        }

        const args = message.content.slice(guild.prefix.length).split(/ +/)
        const nameCommand = args.shift().toLowerCase()
        const command = message.client.commands.find(e => e.name === nameCommand || e.alias.includes(nameCommand))
        
        if (!command) return

        const solveCaptcha = await command.solveCaptcha(message, message.author.id)
        if (!solveCaptcha) return

        const props = { user, guild, args }
        const checkErrors = await command.check(message, props)
        if (checkErrors) return message.reply(checkErrors)
            
        try {
            await command.execute(message, props)
            await command.checkSendCaptcha(message.author.id)
        } catch(err) {
            return Colors.message(err.message, 'r')
        }
	},
}
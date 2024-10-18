const { Events } = require('discord.js')

const Colors = require('../services/colors')
const User = require('../class/User')
const Guild = require('../class/Guild')

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
        if (message.author.bot) return

        const user = new User(message.author.id)
        const guild = new Guild(message.guild.id)
        const props = {
            user: await user.get(),
            guild: await guild.get(),
        }

        let checkChannelPermissions = guild.checkChannelPermissions(message)
        if (!checkChannelPermissions) return
        
        if (!message.content.startsWith(guild.prefix)) {
            // Mención al bot
            if (message.mentions.users.has(message.client.user.id)) {
                return message.reply(`Mi prefijo en el servidor es: ` + '`' + props.guild.prefix +'`')
            }

            if (message.content.length > 5) {
                await user.set({ status: { xp: 1 } })
                await guild.set(message, {
                    status: { xp: 1 },
                    countMessages: 1,
                })
            }
            
            return
        }

        props.args = message.content.slice(props.guild.prefix.length).split(/ +/)
        const nameCommand = props.args.shift().toLowerCase()
        const command = message.client.commands.find(e => e.name === nameCommand || e.alias.includes(nameCommand))
        
        if (!command) return

        let solveCaptcha = await command.solveCaptcha(message, message.author.id)
        if (!solveCaptcha) return

        let checkErrors = await command.check(message, props)
        if (checkErrors) return message.reply(checkErrors)
        
        try {
            await command.execute(message, props)
            await command.checkSendCaptcha(message.author.id)
        } catch(err) {
            return Colors.message(err.message, 'r')
        }
	},
}
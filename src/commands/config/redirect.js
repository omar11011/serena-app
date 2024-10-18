const Command = require('../../class/Command')
const createEmbed = require('../../utils/createEmbed')

module.exports = new Command({
    name: 'redirect',
    description: 'Redirecciona los spawns y eventos a canales específicos.',
    args: ['channel', 'opc. delete'],
    ignoreArgs: true,
    execute: async (message, props) => {
        let { guild, args } = props
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel
        let isAdmin = message.member.permissions.toArray().includes('Administrator')
        let drop = args.includes('delete') || args.includes('d')
        let list = args.includes('list') || args.includes('l')
        
        // Listar canales
        if (list || !isAdmin) {
            let embed = {
                color: 'green',
                author: 'Canales de Spawn',
                description: 'Este servidor aún no tiene ningún canal de spawn.',
            }
            if (guild.spawnChannels.length > 0) {
                embed.description = 'A continuación observarás los canales de tu servidor en los cuales aparecerán Pokémon salvajes y eventos, en caso quieras eliminar alguno usa el comando `' + guild.prefix + 'redirect <channel> delete`.'
                embed.fields = guild.spawnChannels.map((e, i) => {
                    return { name: `Spawn #${i + 1}`, value: `<#${e}>`, inline: true }
                })
            }
            return message.reply(createEmbed(embed))
        }

        // Eliminar canal
        if (drop) {
            if (!guild.spawnChannels.includes(channel.id)) return message.reply(`Este canal no formaba parte de los spawns del servidor.`)

            let spawnChannels = guild.spawnChannels.filter(e => e !== channel.id)
            await guild.set(message, { spawnChannels })

            return message.reply(`Se ha eliminado el canal <#${channel.id}> de los spawns del servidor.`)
        }
        
        // Agregar canal
        if (guild.spawnChannels.includes(channel.id)) return message.reply(`Este canal ya forma parte de los spawn del servidor.`)
        if ((!guild.isVip && guild.spawnChannels.length >= 2) || (guild.isVip && guild.spawnChannels.length >= 5)) {
            return message.reply(`El servidor ya no puede tener más canales de spawn.`)
        }

        await guild.set(message, { spawnChannels: channel.id })

        return message.reply(`Has añadido el canal <#${channel.id}> a los spawns del servidor.`)
    }
})
const Command = require('../../class/Command')
const axios = require('../../services/axios')
const megadb = require('megadb')
const eventDB = new megadb.crearDB('events')

module.exports = new Command({
    name: 'trade',
    description: 'Inicia un intercambio con un usuario.',
    mention: true,
    useInTrade: false,
    useInDuel: false,
    execute: async (message, props) => {
        let mention = props.mention.id === message.author.id || props.mention.bot ? null : props.mention
        if (!mention) return message.react('❓')

        const mentionTrade = await eventDB.obtener(mention.id)
        if (mentionTrade) return message.reply(`${mention.globalName} no puede aceptar tu solicitud de intercambio en este momento.`)

        return message.channel.send(`<@${mention.id}>, ${message.author.globalName} ha enviado una solicitud de intercambio, responde ` + '`yes` para aceptar.').then(msg => {
            let ready = false
            let filter = m => m.author.id === mention.id
            let collector = msg.channel.createMessageCollector({ filter, time: 10000, max: 2 })

            collector.on('collect', async m => {
                const response = m.content.toLowerCase()
                if (response === 'yes' && !ready) {
                    await msg.react('✅')

                    mention = await axios.create('user', {
                        userId: mention.id,
                        discordData: mention,
                    })

                    const trade = await axios.create('trade', {
                        guild: props.guild._id,
                        user: props.user._id,
                        otherUser: mention._id,
                    })
                    if (trade.error) return message.reply('Ocurrió un error inesperado.')
            
                    await eventDB.establecer(message.author.id, 'trade')
                    await eventDB.establecer(mention.discordData.id, 'trade')

                    return message.channel.send('El intercambio ha comenzado. Para añadir algún Pokémon puedes usar el comando `' + props.guild.prefix + 'add p <id>`, para añadir pokémonedas usa `' + props.guild.prefix + 'add c <cantidad>` y para añadir items `' + props.guild.prefix + 'add i <item>`.\n' + `<@${message.author.id}> <@${mention.discordData.id}>`)
                }
            })
            collector.on('end', m => {
                if (!ready) msg.react('⌛')
            })
        })
    }
})
const Command = require('../../class/Command')
const axios = require('../../services/axios')
const megadb = require('megadb')
const eventDB = new megadb.crearDB('events')

module.exports = new Command({
    name: 'cancel',
    description: 'Cancela algún intercambio o duelo forzadamente.',
    execute: async (message, props) => {
        const event = await eventDB.obtener(message.author.id)
        if (!event) return message.reply(`No hay ningún intercambio o duelo activo tuyo en este momento.`)

        const { user, otherUser } = await axios.get(`${event}/${props.user._id}`)
        if (user) {
            await axios.delete(event, { id: user._id })
            await eventDB.eliminar(user.user.userId)
        }
        if (otherUser) {
            await axios.delete(event, { id: otherUser._id })
            await eventDB.eliminar(otherUser.user.userId)
        }

        return message.reply(`Has dado por finalizado tu ${event === 'trade' ? 'intercambio' : 'duelo'} con ${otherUser ? otherUser.user.discordData.globalName : 'tu amigo'}.`)
    }
})
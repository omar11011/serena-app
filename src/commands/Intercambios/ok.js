const Command = require('../../class/Command')
const axios = require('../../services/axios')
const megadb = require('megadb')
const eventDB = new megadb.crearDB('events')

module.exports = new Command({
    name: 'ok',
    description: 'Acepta tu intercambio.',
    useInDuel: false,
    execute: async (message, props) => {
        const event = await eventDB.obtener(message.author.id)
        if (!event || event !== 'trade') return message.reply(`No hay ningún intercambio activo tuyo en este momento.`)

        const { user, otherUser } = await axios.get(`trade/${props.user._id}`)

        if (user.accept) return message.reply('Espera...')
        if (!otherUser.accept) {
            await axios.update('trade', {
                user: user.user._id,
                set: { accept: true },
            })
            return message.reply('Ya has aceptado el intercambio, ahora tendrás que esperar a que tu compañero también lo acepte para intercambiar todo.')
        }

        if (user) {
            await eventDB.eliminar(user.user.userId)
            await axios.update('trade', {
                user: user.user._id,
                set: { current: false, accept: true },
            })
            await axios.update('user', {
                userId: user.user.userId,
                inc: { 'balance.money': (otherUser ? otherUser.money : 0) - user.money },
            })
            if (user.pokemon.length > 0) await axios.update('pokemon-capture', {
                _id: user.pokemon.map(e => e.id),
                set: {
                    owner: otherUser ? otherUser.user._id : null,
                    'options.isSelected': false,
                },
            })
        }

        if (otherUser) {
            await eventDB.eliminar(otherUser.user.userId)
            await axios.update('trade', {
                user: otherUser.user._id,
                set: { current: false },
            })
            await axios.update('user', {
                userId: otherUser.user.userId,
                inc: { 'balance.money': user.money - otherUser.money },
            })
            if (otherUser.pokemon.length > 0) await axios.update('pokemon-capture', {
                _id: otherUser.pokemon.map(e => e.id),
                set: {
                    owner: user.user._id,
                    'options.isSelected': false,
                },
            })
        }

        return message.reply(`¡Se ha transferido correctamente todo!`)
    }
})
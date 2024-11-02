const Command = require('../../class/Command')
const axios = require('../../services/axios')
const createEmbed = require('../../utils/createEmbed')

const megadb = require('megadb')
const eventDB = new megadb.crearDB('events')

module.exports = new Command({
    name: 'add',
    description: 'Agrega pokémonedas, items o Pokémon a tu intercambio.',
    useInDuel: false,
    execute: async (message, props) => {
        const data = await eventDB.obtener(message.author.id)
        if (!data || data !== 'trade') return message.reply(`Necesitas estar en un intercambio para usar este comando.`)
        if (props.args.length < 2) return message.reply('Para añadir algún Pokémon puedes usar el comando `' + props.guild.prefix + 'add p <id>`, para añadir pokémonedas usa `' + props.guild.prefix + 'add c <cantidad>` y para añadir items `' + props.guild.prefix + 'add i <item>`')
        
        const modeSelect = props.args[0]
        const modes = ['p', 'c', 'i']
        if (!modes.includes(modeSelect)) return message.react('❓')
        
        const { user, otherUser } = await axios.get(`trade/${props.user._id}`)
        if (!user || !otherUser) {
            await eventDB.eliminar(message.author.id)
            return message.reply('Ups! Ocurrió un error inesperado en el intercambio.')
        }
        if (user.accept) return message.reply('Ya has aceptado el intercambio, debes esperar a tu compañero.')

        if (modeSelect === 'p') {
            let limit = 20
            let id = parseInt(props.args[1])
            if (isNaN(id) || id < 1) return

            let page = Math.ceil(id / limit)
            let index = id - (page - 1) * limit - 1
            let data = await axios.get(`pokemon-capture/user/${props.user._id}?page=${page}`)
            if (data.results.length < 1 || !data.results[index]) return message.react('❓')

            let pokemon = data.results[index]
            let exist = user.pokemon.find(e => e.id === pokemon._id)
            if (exist) return message.reply('Este Pokémon ya está añadido.')

            user.pokemon.push({ id: pokemon._id, name: `${pokemon.features.isShiny ? '⭐ ' : ''}${pokemon.pokemon.name} (IV: ${pokemon.status.iv}%)` })
            await axios.update('trade', {
                user: props.user._id,
                set: { pokemon: user.pokemon },
            })
        }
        else if (modeSelect === 'c') {
            let money = parseInt(props.args[1])
            if (isNaN(money) || money < 1) return
            if (money > user.user.balance.money) return message.reply(`No tienes suficiente dinero para transferir.`)
            user.money = money
            await axios.update('trade', {
                user: props.user._id,
                set: { money },
            })
        }
        else if (modeSelect === 'i') {
            return message.reply('Próximamente')
        }
        else return

        const embed = {
            title: 'Intercambio Pokémon',
            footer: `Para aceptar el intercambio utiliza el comando ${props.guild.prefix}ok\nPara cancelar y terminar el intercambio utiliza ${props.guild.prefix}cancel`,
        }

        embed.description = `**${user.user.discordData.globalName}**\n`
        if (user.money > 0) embed.description += '```Pokémonedas: ' + user.money +'```\n'
        if (user.pokemon.length > 0) embed.description += '```Pokémon: ' + user.pokemon.map(e => e.name).join(', ') +'```\n'

        embed.description += `**${otherUser.user.discordData.globalName}**`
        if (otherUser.money > 0) embed.description += '```Pokémonedas: ' + otherUser.money +'```\n'
        if (otherUser.pokemon.length > 0) embed.description += '```Pokémon: ' + otherUser.pokemon.map(e => e.name).join(', ') +'```\n'

        return message.reply(createEmbed(embed))
    }
})
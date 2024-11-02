const Command = require('../../class/Command')
const axios = require('../../services/axios')
const createEmbed = require('../../utils/createEmbed')

module.exports = new Command({
    name: 'moveinfo',
    description: 'Obtén información de cualquier movimiento Pokémon.',
    args: ['movement'],
    cooldown: 4,
    execute: async (message, props) => {
        let move = props.args.join(' ')
        let data = await axios.get(`pokemon-movement/${move}`)
        if (data.error) return message.reply(data.error)

        let effects = data.effects.map(e => {
            let stats = ['hp', 'attack', 'defense', 'spattack', 'spdefense', 'speed', 'accuracy', 'evasion']
            let namesStats = ['salud', 'ataque', 'defensa', 'ataque especial', 'defensa especial', 'velocidad', 'precisión', 'evasión']
            if (stats.includes(e.stat)) {
                let nameStat = namesStats[stats.indexOf(e.stat)]
                let user = e.toUser ? 'usuario' : 'rival'
                let inc = e.points > 0 ? 'incrementa' : 'disminuye'
                return `El ${user} ${inc} su ${nameStat} en ${Math.abs(e.points)} punto${Math.abs(e.points) > 1 ? 's' : ''}${e.probability < 100 ? ' con una probabilidad de ' + e.probability + '%' : ''}.`
            }
            else return null
        }).filter(Boolean)

        let embed = createEmbed({
            color: data.type.name,
            title: data.name,
            description: effects.join('\n') || 'Este movimiento no causa ningún efecto.',
            fields: [
                { name: 'Clase', value: data.class, inline: true },
                { name: 'Tipo', value: data.type.name, inline: true },
                { name: 'Potencia', value: String(data.power), inline: true },
                { name: 'Precisión', value: String(data.precision), inline: true },
                { name: 'Prioridad', value: String(data.priority), inline: true },
                { name: 'N° Golpes', value: String(data.hits), inline: true, },
            ],
        })

        return message.reply(embed)
    }
})
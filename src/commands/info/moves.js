const Command = require('../../class/Command')
const axios = require('../../services/axios')
const Data = require('../../data')
const createEmbed = require('../../utils/createEmbed')

module.exports = new Command({
    name: 'moves',
    description: 'Muestra los movimientos que puede aprender un Pokémon.',
    cooldown: 4,
    execute: async (message, props) => {
        let pokemon = null
        let moveType = null
        let moveTypes = ['nivel', 'mt', 'tutor']

        for (let i = 0; i < moveTypes.length; i++) {
            if (props.args.includes(moveTypes[i])) moveType = moveTypes[i]
        }
        props.args = props.args.filter(e => !moveTypes.includes(e))

        if (props.args[0]) pokemon = props.args.join(' ')
        if (!pokemon) {
            let data = await axios.get(`pokemon/${props.user.pokemon}`)
            pokemon = data.pokemon

            if (!moveType) {
                return message.reply(createEmbed({
                    author: data.pokemon,
                    description: data.movements.length > 0 ? `Tu Pokémon ha aprendido los siguientes movimientos:\n\n` + data.movements.map((e, i) => `[${i + 1}] ${e.name} | Lvl ${e.level} | Tipo: ${e.type}`).join('\n') : 'Tu Pokémon aún no ha aprendido ningún movimiento.',
                }))
            }
        }
        if (!moveType) moveType = 'nivel'

        let data = await Data.get('form', pokemon)
        if (!data) return message.react('❓')
        else data = await data.data()

        if (data.name.toLowerCase().includes('gigamax') || data.name.toLowerCase().includes('dinamax')) moveType = 'gigamax'
        let moves = data.movements.filter(e => e.type === moveType)

        return message.reply(createEmbed({
            title: `Categoría: ${moveType.toUpperCase()}`,
            author: data.name,
            thumbnail: data.image.default,
            description: moves.length > 0 ? moves.map(e => {
                if (moveType === 'nivel') return `${e.name} | Nivel: ${e.level}`
                else return e.name
            }).join(moveType === 'nivel' ? '\n' : ', ') : 'No hay movimientos para mostrar.',
            footer: `Recuerda que puedes añadir las palabras nivel, mt o tutor.`,
        }))
    }
})
const Command = require('../../class/Command')
const axios = require('../../services/axios')
const createEmbed = require('../../utils/createEmbed')

module.exports = new Command({
    name: 'moves',
    description: 'Muestra los movimientos que puede aprender un Pokémon.',
    cooldown: 4,
    execute: async (message, props) => {
        let embed = {}
        let currentMoves = null
        let moveType = 'byLevel'

        if (props.args.includes('mt')) {
            moveType = 'byMachine'
        }
        if (props.args.includes('tutor')) {
            moveType = 'byTutor'
        }

        let search = props.args.filter(e => !(['mt', 'tutor']).includes(e)).join(' ')
        
        if (search || props.user.pokemon) {
            let data = null
            if (search) {
                data = await axios.get(`pokemon-form/${search}`)
                data.image = data.image.default
            }
            else {
                data = await axios.get(`pokemon-capture/${props.user.pokemon}`)
                currentMoves = data.movements.byLevel.concat(data.movements.byMachine, data.movements.byTutor)
                data = {
                    ...data.pokemon,
                    image: data.image,
                }
            }
            if (data.error) return message.react('❓')

            embed.author = `Movimientos de ${data.name}`
            embed.title = 'Categoría: ' + (moveType === 'byLevel' ? 'Por Nivel' : (moveType === 'byMachine' ? 'Por MT' : 'Por Tutor'))
            embed.image = data.image.default
            embed.description = 'Para ver los movimientos que aprende por MT puedes usar el comando `' + props.guild.prefix + 'moves mt <pokémon>`, o si quieres ver los que aprende por Tutor escribe `' + props.guild.prefix + 'moves tutor <pokémon>`.\n\n'
            embed.description += data.movements[moveType].map(e => {
                const idx = currentMoves.indexOf(e.name)
                if (moveType === 'byLevel') return `🔸 ${e.name} | Nivel ${e.level}` + (idx < 0 ? '' : ` | **[ Move ${idx + 1} ]**`)
                else return e + (idx < 0 ? '' : ` | **[ Move ${idx + 1} ]**`)
            }).join(moveType === 'byLevel' ? '\n' : ', ') || 'No hay movimientos en esta categoría.'
        }
        else {
            embed.color = 'red'
            embed.description = 'No tienes seleccionado ningún Pokémon.'
        }

        return message.reply(createEmbed(embed))
    }
})
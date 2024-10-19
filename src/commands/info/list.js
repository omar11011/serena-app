const Command = require('../../class/Command')
const axios = require('../../services/axios')
const createEmbed = require('../../utils/createEmbed')

module.exports = new Command({
    name: 'list',
    description: 'Muestra una lista de tus Pokémon capturados. Puedes hacer filtros.',
    cooldown: 4,
    execute: async (message, props) => {
        let { user, args } = props
        let queries = []
        let name = []
        let url = `pokemon/captures/${user.id}?`

        args.forEach(e => {
            if (e === '-s') queries.push('shiny=true')
            else if (e === '-d') queries.push('dynamax=true')
            else if (e === '-l') queries.push('legendary=true')
            else if (e === '-m') queries.push('mythical=true')
            else if (e === '-ub') queries.push('ultrabeast=true')
            else if (e === '-f') queries.push('favorite=true')
            else if (!isNaN(e) && parseInt(e) > 0) queries.push(`page=${e}`)
            else name.push(e)
        })
        if (name.length > 0) queries.push(`name=${name.join(' ')}`)

        let data = await axios.get(url + queries.join('&'))
        if (data.results.length < 1) return message.reply(`No he encontrado resultados para tu búsqueda.`)

        let embed = embedList(data)

        message.reply(createEmbed(embed)).then(msg => {
            let filter = e => e.author.id === message.author.id
            let collector = message.channel.createMessageCollector({ filter, time: 15000 })

            collector.on('collect', async m => {
                let response = m.content.toLowerCase()
                if ((response === 'next' && data.next) || (response === 'back' && data.previous)) {
                    let newUrl = response === 'next' ? data.next : data.previous
                    data = await axios.get(newUrl.split('api/')[1])
                    embed = embedList(data)
                    msg.edit(createEmbed(embed))
                }
            })

            collector.on('end', async collected => msg.react('⌛'))
        })
    }
})

function embedList(data) {
    return {
        color: 'green',
        title: `Capturas Pokémon`,
        description: 'Responde `next` para pasar a la siguiente página y `back` para retroceder.\n\n' + data.results.map(e => {
            return `${e.features.isShiny ? '⭐ ' : ''}**${e.traits.nickname || e.pokemon}** | ID: ${e.index} | Lvl ${e.status.level} | IV: ${e.status.iv}%`
        }).join('\n'),
        footer: `Página ${data.page}/${Math.ceil(data.count / data.limit)} - Mostrando resultados del ${(data.page - 1) * data.limit + 1} al ${(data.page - 1) * data.limit + data.results.length}`,
    }
}
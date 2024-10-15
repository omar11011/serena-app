const path = require('path')
const { getColor } = require('./getColor')
const { EmbedBuilder, AttachmentBuilder } = require('discord.js')

module.exports = props => {
    let files = []
    let embed = new EmbedBuilder()

    embed.setColor(getColor(props.color).int)

    if (props.title) embed.setTitle(props.title)
    if (props.description) embed.setDescription(props.description)
    if (props.author) {
        if (typeof props.author !== 'object') props.author = { name: props.author }
        embed.setAuthor(props.author)
    }
    if (props.image) embed.setImage(props.image)
    if (props.footer) embed.setFooter({ text: props.footer })

    if (props.fields && Array.isArray(props.fields)) {
        props.fields.forEach(e => embed.addFields(e))
    }

    if (props.attachment) {
        let { url, format = 'png' } = props.attachment
        let imagen = new AttachmentBuilder(path.join(__dirname, `../assets/${url}`), { name: `image.${format}` })
        embed.setImage(`attachment://image.${format}`)
        files.push(imagen)
    }

    return {
        embeds: [embed],
        files,
    }
}
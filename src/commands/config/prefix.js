const Command = require('../../class/Command')
const createEmbed = require('../../utils/createEmbed')

module.exports = new Command({
    name: 'prefix',
    alias: ['prefijo'],
    description: 'Asigna un prefijo para tu servidor',
    args: ['newPrefix'],
    userPermissions: ['Administrator'],
    execute: async (message, props) => {
        const { guild, args } = props
        const prefix = args[0]
        const embed = {}

        if (prefix.length > 2) {
            embed.color = 'red'
            embed.description = `El prefijo del servidor no puede tener más de 2 caracteres.`
        }
        else {
            embed.description = 'El prefijo del servidor ha sido actualizado a: `' + prefix + '`'
            await guild.setPrefix(prefix)
        }

        return message.reply(createEmbed(embed))
    }
})
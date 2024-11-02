const Command = require('../../class/Command')

module.exports = new Command({
    name: 'prefix',
    alias: ['prefijo'],
    description: 'Asigna un prefijo para tu servidor',
    args: ['newPrefix'],
    userPermissions: ['Administrator'],
    execute: async (message, props) => {
        const { guild, args } = props
        const prefix = args[0]

        if (prefix.length > 2) return message.reply(`El prefijo del servidor no puede tener más de 2 caracteres.`)

        await guild.setPrefix(prefix)

        return message.reply('El prefijo del servidor ha sido actualizado a: `' + prefix + '`')
    }
})
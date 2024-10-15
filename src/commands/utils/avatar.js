const Command = require('../../class/Command')
const createEmbed = require('../../utils/createEmbed')

module.exports = new Command({
    name: 'avatar',
    description: 'Mira el avatar de un usuario',
    mention: true,
    execute: async (message, props) => {
        const mention = props.mention
        const embed = createEmbed({
            title: `Avatar de ${mention.globalName}`,
            image: mention.displayAvatarURL({ dynamic: true, size: 1024 }),
        })

        return message.reply(embed)
    }
})
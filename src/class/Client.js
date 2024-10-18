const { Client, Collection, GatewayIntentBits, Options } = require('discord.js')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER'],
    makeCache: Options.cacheWithLimits(Options.DefaultMakeCacheSettings),
})

client.commands = new Collection()

module.exports = client
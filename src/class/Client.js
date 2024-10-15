const { Client, Collection, GatewayIntentBits, Options } = require('discord.js')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    makeCache: Options.cacheWithLimits(Options.DefaultMakeCacheSettings),
})

client.commands = new Collection()

module.exports = client
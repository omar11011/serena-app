const axios = require('../services/axios')
const memcached = require('../services/memcached')
const megadb = require('megadb')
const database = new megadb.crearDB('guilds')
const createEmbed = require('../utils/createEmbed')

module.exports = class Guild {
    constructor(guildId) {
        this.guildId = guildId
    }

    async load(discordData) {
        let data = await database.obtener(this.guildId) || {}
        
        if (!data._id) {
            let guild = await axios.update('guild', {
                guildId: this.guildId,
                set: { discordData },
            })
            
            data._id = guild._id
            data.xp = guild.status.xp
            data.prefix = guild.config.prefix
            data.count = guild.count || 0
            data.channels = guild.channels

            await database.establecer(this.guildId, data)
        }

        this._id = data._id
        this.xp = data.xp
        this.prefix = data.prefix
        this.count = data.count || 0
        this.channels = data.channels || {}
    }

    async addXP(xp) {
        this.xp += xp

        if (this.xp >= 10) {
            let guild = await axios.update('guild', {
                guildId: this.guildId,
                inc: { 'status.xp': this.xp },
            })
            let levelUp = guild.status.xp - guild.status.level * 200 >= 0 ? true : false
    
            if (levelUp) {
                guild = await axios.update('guild', {
                    guildId: this.guildId,
                    inc: {
                        'status.level': 1,
                        'status.xp': -(guild.status.level * 200)
                    },
                })
            }

            this.xp = 0
        }

        await database.establecer(this.guildId, this)
    }

    async setPrefix(prefix) {
        this.prefix = prefix

        await axios.update('guild', {
            guildId: this.guildId,
            set: { 'config.prefix': prefix },
        })
        await database.establecer(this.guildId, this)
    }

    async addSpawn(channel) {
        if (!this.channels.spawn.includes(channel)) {
            this.channels.spawn.push(channel)

            await database.establecer(this.guildId, this)
            await axios.update('guild', {
                guildId: this.guildId,
                set: { 'channels.spawn': this.channels.spawn },
            })

            return true
        }
        return false
    }

    async dropSpawn(channel) {
        if (this.channels.spawn.includes(channel)) {
            this.channels.spawn = this.channels.spawn.filter(e => e !== channel)

            await database.establecer(this.guildId, this)
            await axios.update('guild', {
                guildId: this.guildId,
                set: { 'channels.spawn': this.channels.spawn },
            })

            return true
        }
        return false
    }

    async event(message, count) {
        this.count += count

        if (this.count > 3) {
            this.channels.spawn.forEach(async ch => {
                let channel = message.guild.channels.cache.get(ch)
                try {
                    const randomValue = Math.random()
                    if (randomValue < 0.95) await this.sendSpawn(channel)
                    else await this.sendBox(channel)
                }
                catch {
                    await this.dropSpawn(ch)
                }
            })
            this.count = 0
        }

        await database.establecer(this.guildId, this)
    }

    checkChannelPermissions(message) {
      let result = true
      let permissions = [
        'AddReactions',
        'ViewChannel',
        'SendMessages',
        'ManageMessages',
        'EmbedLinks',
        'AttachFiles',
        'UseExternalEmojis',
      ]
      let myPermissions = message.channel.permissionsFor(message.guild.members.me).toArray()

      for (let i = 0; i < permissions.length; i++) {
        if (!myPermissions.includes(permissions[i])) result = false
      }

      return result
    }

    async sendSpawn(channel) {
        let pokemon = await axios.get('pokemon-form/spawn')
        
        channel.send(createEmbed({
            author: 'Spawn Pokémon',
            description: 'Ha aparecido un Pokémon salvaje, usa el comando `catch` para capturarlo antes que alguien más lo haga.',
            image: pokemon.image,
        }))

        await memcached.createData({
            key: `spawn-${channel.id}`,
            data: {
                pokemon: pokemon.name,
                specie: pokemon.specie.name,
            },
            time: 60,
        })
    }
    
    async sendBox(channel) {
        const embed = {
            color: 'green',
            author: '🎉 Evento',
            description: 'Ha aparecido una **caja misteriosa**, reacciona al emoji para poder participar.',
            thumbnail: process.env.SITE_URL + '/upload/common/box.jpg',
        }
        
        channel.send(createEmbed(embed)).then(async msg => {
            await msg.react('🎉')
            const users = []
            const filter = (reaction, user) => reaction.emoji.name === '🎉' && !user.bot && !users.includes(user.id)
            const collector = msg.createReactionCollector({ filter, time: 15000 })
            
            collector.on('collect', async (reaction, user) => {
                users.push(user.id)
                let text = `Participantes: ${users.length}`
                embed.description = embed.description.split('.')[0] + `\n\n${text}`
                msg.edit(createEmbed(embed))
            })

            collector.on('end', async collected => {
                if (users.length < 1) return
                let userId = users[Math.floor(Math.random() * users.length)]
                let randomValue = Math.random()

                if (randomValue < 0.94) {
                    let money = Math.ceil(Math.random() * 30) + 20
                    await axios.update('user', {
                        userId,
                        inc: { 'balance.money': money },
                    })
                    return channel.send(`<@${userId}>, has ganado ${money} pokémonedas`)
                }
                else if (randomValue < 0.98) {
                    console.log('item')
                }
                else {
                    let gems = Math.ceil(Math.random() * 5)
                    await axios.update('user', {
                        userId,
                        inc: { 'balance.gems': gems },
                    })
                    return channel.send(`<@${userId}>, has ganado ${gems} gemas`)
                }

                embed.description = embed.description.split('.')[0] + `\n\nGanador: <@${userId}>`
                msg.edit(createEmbed(embed))
            })
        })
    }
}
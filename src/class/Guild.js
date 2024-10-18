const axios = require('../services/axios')
const memcached = require('../services/memcached')
const megadb = require('megadb')
const database = new megadb.crearDB('guilds')
const createEmbed = require('../utils/createEmbed')

module.exports = class Guild {
    constructor(guildId) {
        this.guildId = guildId
    }

    async get() {
        let newGuild = false
        let guild = await database.obtener(this.guildId)
        
        if (!guild) {
            guild = await axios.create('guild', this)
            newGuild = true
        }

        this.isVip = guild.isVip || false
        this.prefix = guild.prefix || '!'
        this.status = guild.status
        this.countMessages = guild.countMessages || 0
        this.spawnChannels = guild.spawnChannels || []

        if (newGuild) await database.establecer(this.guildId, this)

        return this
    }

    async set(message, props) {
        if (props.prefix) this.prefix = props.prefix

        if (props.status) {
            let { xp, level } = props.status
            if (level) this.status.level += level
            if (xp) {
                this.status.xp += xp
                let levelUp = this.status.xp - this.status.level * 200 >= 0 ? true : false
                if (levelUp) {
                    this.status.xp -= (this.status.level * 200)
                    this.status.level += 1
                }
                if (this.status.xp % 10 === 0) await axios.update('guild', {
                    guildId: this.guildId,
                    set: this,
                })
            }
        }

        if (props.spawnChannels) {
            if (Array.isArray(props.spawnChannels)) this.spawnChannels = props.spawnChannels
            else this.spawnChannels.push(props.spawnChannels)
        }

        if (props.countMessages) {
            this.countMessages += props.countMessages

            if (this.countMessages >= 20) {
                let corruptChannels = []
                this.spawnChannels.forEach(async ch => {
                    let channel = message.guild.channels.cache.get(ch)
                    try {
                        const randomValue = Math.random()
                        if (randomValue < 0.95) {
                            await this.sendSpawn(channel)
                        }
                        else await this.sendBox(channel)
                    }
                    catch {
                        corruptChannels.push(ch)
                    }
                })
                this.countMessages = 0
                if (corruptChannels.length > 0) {
                    let spawnChannels = this.spawnChannels.filter(ch => !corruptChannels.includes(ch))
                    await this.set(message, { spawnChannels })
                }
            }
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
        let { Data, Class } = require('../data/pokemon-form')

        let data = JSON.parse(JSON.stringify(Data)).filter(e => !e.isMega && !e.isGiga)

        let pokemon = data[Math.floor(Math.random() * data.length)]
        pokemon = await (new Class(pokemon)).data()

        let embed = {
            color: 'green',
            author: 'Spawn Pokémon',
            description: 'Ha aparecido un Pokémon salvaje, usa el comando `catch` para capturarlo antes que alguien más lo haga.',
            image: pokemon.image.default,
        }
        
        channel.send(createEmbed(embed))

        await memcached.createData({
            key: `spawn-${channel.id}`,
            data: {
                pokemon: pokemon.name,
                specie: pokemon.specie._name,
            },
            time: 30,
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
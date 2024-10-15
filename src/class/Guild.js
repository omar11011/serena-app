const axios = require('../services/axios')
const megadb = require('megadb')
const database = new megadb.crearDB('guilds')

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

        this.prefix = guild.prefix
        this.status = guild.status

        if (newGuild) await database.establecer(this.guildId, this)

        return this
    }

    async set(props) {
        if (props.prefix) this.prefix = props.prefix

        if (props.status) {
            let { xp, level } = props.status
            if (level) this.status.level += level
            if (xp) {
                this.status.xp += xp
                let levelUp = this.status.level * 200 - this.status.xp <= 0 ? true : false
                if (levelUp) {
                    this.status.level += 1
                    this.status.xp -= (this.status.level * 200)
                }
                if (this.status.xp % 10 === 0) await axios.update('guild', {
                    guildId: this.guildId,
                    set: this,
                })
            }
        }

        await database.establecer(this.guildId, this)
    }
}
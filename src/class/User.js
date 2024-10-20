const axios = require('../services/axios')
const staff = require('../json/staff.json')
const megadb = require('megadb')
const database = new megadb.crearDB('users')

module.exports = class User {
    constructor(props) {
        this.userId = props.id
        this.discordData = props
        this.features = {
            isVip: false,
            isAdmin: false,
            isProgrammer: false,
            isOwner: false,
        }
    }

    async get() {
        let newUser = false
        let user = await database.obtener(this.userId)
        
        if (!user || !user.id) {
            if (staff[this.userId]) {
                if (staff[this.userId] === 'owner') this.features.isOwner = true
                else if (staff[this.userId] === 'programmer') this.features.isAdmin = true
                else if (staff[this.userId] === 'admin') this.features.isAdmin = true
            }
            
            user = await axios.update('user', {
                userId: this.userId,
                set: this,
            })
            newUser = true
        }

        this.id = user._id || user.id
        this.features = user.features || {}
        this.status = user.status
        this.pokemon = user.pokemon || null

        delete this.discordData

        if (newUser) await database.establecer(this.userId, this)

        return this
    }

    async set(props) {
        if (props.status) {
            let { xp, level } = props.status
            if (level) this.status.level += level
            if (xp) {
                this.status.xp += xp
                let levelUp = this.status.xp - this.status.level * 100 >= 0 ? true : false
                if (levelUp) {
                    this.status.xp -= (this.status.level * 100)
                    this.status.level += 1
                }
                if (this.status.xp % 10 === 0) await axios.update('user', {
                    userId: this.userId,
                    set: this,
                })
            }
        }

        if (props.features) {
            this.features = {
                ...this.features,
                ...props.features,
            }
        }

        if(props.pokemon) this.pokemon = props.pokemon

        await database.establecer(this.userId, this)
    }
}
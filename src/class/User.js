const axios = require('../services/axios')
const staff = require('../json/staff.json')

const megadb = require('megadb')
const database = new megadb.crearDB('users')

module.exports = class User {
    constructor(userId) {
        this.userId = userId
    }

    async load(discordData) {
        let data = await database.obtener(this.userId) || {}
        
        if (!data._id) {
            const roles = {}
            const staffRoles = Object.keys(staff)

            for (let i = 0; i < staffRoles.length; i++) {
                if (staff[staffRoles[i]].includes(this.userId)) {
                    data.role = staffRoles[i]
                    roles[`is${staffRoles[i]}`] = true
                }
            }
            
            let user = await axios.update('user', {
                userId: this.userId,
                set: { discordData, roles },
            })
            
            data._id = user._id
            data.xp = user.status.xp
            
            await database.establecer(this.userId, data)
        }

        this._id = data._id
        this.xp = data.xp || 0
        this.role = data.role
        this.pokemon = data.pokemon
    }

    async addXP(xp) {
        this.xp += xp

        if (this.xp >= 10) {
            let user = await axios.update('user', {
                userId: this.userId,
                inc: { 'status.xp': this.xp },
            })
            let levelUp = user.status.xp - user.status.level * 100 >= 0 ? true : false
    
            if (levelUp) {
                user = await axios.update('user', {
                    userId: this.userId,
                    inc: {
                        'status.level': 1,
                        'status.xp': -(user.status.level * 100)
                    },
                })
            }

            this.xp = 0
        }

        await database.establecer(this.userId, this)
    }

    async setPokemon(id) {
        this.pokemon = id
        await database.establecer(this.userId, this)
    }
}
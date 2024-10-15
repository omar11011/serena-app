const axios = require('../services/axios')
const staff = require('../json/staff.json')
const megadb = require('megadb')
const database = new megadb.crearDB('users')

module.exports = class User {
    constructor(userId) {
        this.userId = userId
    }

    async get() {
        let newUser = false
        let user = await database.obtener(this.userId)
        
        if (!user) {
            if (Object.keys(staff).includes(this.userId)) this.role = staff[this.userId]

            user = await axios.create('user', this)
            newUser = true
        }

        this.role = user.role
        this.status = user.status

        if (newUser) await database.establecer(this.userId, this)

        return this
    }

    async set(props) {
        if (props.role) {
            const roles = ['trainer', 'admin', 'programmer', 'owner']
            if (roles.includes(props.role)) this.role = props.role
        }

        if (props.status) {
            let { xp, level } = props.status
            if (level) this.status.level += level
            if (xp) {
                this.status.xp += xp
                let levelUp = this.status.level * 100 - this.status.xp <= 0 ? true : false
                if (levelUp) {
                    this.status.level += 1
                    this.status.xp -= (this.status.level * 100)
                }
                if (this.status.xp % 10 === 0) await axios.update('user', {
                    userId: this.userId,
                    set: this,
                })
            }
        }

        await database.establecer(this.userId, this)
    }
}
const megadb = require('megadb')
const captchaDB = new megadb.crearDB('captcha')
const axios = require('../services/axios')
const createEmbed = require('../utils/createEmbed')

module.exports = class Command {
    constructor(props) {
        this.name = props.name
        this.enabled = props.enabled === undefined ? true : props.enabled
        this.onlyAdmin = props.onlyAdmin === undefined ? false : props.onlyAdmin
        this.alias = props.alias || []
        this.description = props.description
        this.cooldown = props.cooldown || 3
        this.args = props.args || []
        this.ignoreArgs =  props.ignoreArgs === undefined ? false : props.ignoreArgs
        this.ignoreCaptcha = props.ignoreCaptcha === undefined ? true : props.ignoreCaptcha
        this.mention = props.mention === undefined ? false : props.mention
        this.userPermissions = props.userPermissions || []
        this.botPermissions = props.botPermissions || []
        this.execute = props.execute || function() {
            console.log('No se ha definido una función para este comando')
        }
    }

    checkUserPermissions(message) {
      let result = null
      let myPermissions = message.member.permissions.toArray()

      for (let i = 0; i < this.userPermissions.length; i++) {
        if (!myPermissions.includes(this.userPermissions[i])) {
          result = 'Necesitas los siguientes permisos para utilizar este comando: `' + this.userPermissions.join(', ') +'`'
        }
      }

      return result
    }

    checkBotPermissions(message) {
      let result = null
      let myPermissions = message.guild.members.me.permissions.toArray()

      for (let i = 0; i < this.botPermissions.length; i++) {
        if (!myPermissions.includes(this.botPermissions[i])) {
          result = 'Necesito los siguientes permisos para utilizar este comando: `' + this.botPermissions.join(', ') +'`'
        }
      }

      return result
    }

    checkEnabled(role) {
      if (role !== 'Owner' && role !== 'Programmer') return 'Este comando se encuentra deshabilitado temporalmente.'
      return null
    }

    checkOnlyAdmin(role) {
      if (role === 'Trainer') return 'Este comando sólo está habilitado para mis administradores.'
      return null
    }

    checkArgs(args, prefix) {
      if (args.length < this.args.length && !this.ignoreArgs) {
        return 'El uso correcto de este comando es: `' + `${prefix}${this.name} <${this.args.join('> <')}` + '>`'
      }
      return null
    }

    checkMention(message, args) {
      let member = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.author
      return member
    }

    async checkSendCaptcha(user) {
      if (this.ignoreCaptcha) return
      let data = await captchaDB.obtener(user) || { uses: 0 }

      data.uses += 1

      if (data.uses >= 3) {
        let { file, url } = await axios.get('image/random?folder=captcha')
        data.captcha = file.split('.')[0]
        data.image = url
      }

      await captchaDB.establecer(user, data)
    }

    async solveCaptcha(message, user) {
      let data = await captchaDB.obtener(user)
      if (!data || !data.captcha) return true

      if (data.banned) {
        let elapsedTime = Date.now() - data.banned
        if (elapsedTime >= 3600000) {
          await captchaDB.eliminar(user)
          return true
        }
        else {
          message.react('⛔')
          return false
        }
      }

      const embed = createEmbed({
        color: 'red',
        title: 'CAPTCHA',
        description: `Resuelve este CAPTCHA para poder seguir usando más comandos. Sólo tienes 3 intentos y 15 segundos para contestar.`,
        image: data.image,
      })

      await message.reply(embed).then(msg => {
        let success = false
        let filter = e => e.author.id === user
        let collector = message.channel.createMessageCollector({ filter, time: 15000, max: 3 })
        collector.on('collect', async m => {
          if (m.content.toUpperCase() === data.captcha) {
            success = true
            m.react('✅')
            await captchaDB.eliminar(user)
            message.reply(`¡Felicidades! Respondiste correctamente la CAPTCHA, ya puedes seguir usando más comandos.`)
          }
          else m.react('❌')
        })
        collector.on('end', async collected => {
          if (!success) {
            data.banned = Date.now() + 3600000
            await captchaDB.establecer(user, data)
            message.reply(`¡Ups! Fallaste todos tus intentos de la CAPTCHA, no podrás usar comandos durante una hora.`)
          }
        })
      })
      return false
    }

    async checkCooldown(user) {
      let error = null
      let now = Date.now()
      let database = new megadb.crearDB(this.name, 'cooldowns')
      let data = await database.obtener(user)

      if (!data) await database.establecer(user, now)
      else {
        let cooldownTime = this.cooldown * 1000
        let elapsedTime = now - data

        if (elapsedTime > cooldownTime) await database.establecer(user, now)
        else {
          error = `Aún debes esperar`
          let timeRemaining = cooldownTime - elapsedTime
          let hours = Math.floor(timeRemaining / (60 * 60 * 1000))
          let minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / 60000)
          let seconds = Math.floor((timeRemaining % 60000) / 1000)

          if (hours > 0) error += ` ${hours} hora${hours > 1 ? 's' : ''}`
          if (minutes > 0) error += ` ${minutes} minuto${minutes > 1 ? 's' : ''}`
          if (seconds > 0) error += ` ${seconds} segundo${seconds > 1 ? 's' : ''}`
        }
      }

      return error
    }

    async check(message, props) {
      const { user, guild, args } = props
      
      let enabledError = this.checkEnabled(user.role)
      if (enabledError) return enabledError

      let onlyAdminError = this.checkOnlyAdmin(user.role)
      if (onlyAdminError) return onlyAdminError

      let userPermissionsError = this.checkUserPermissions(message)
      if (userPermissionsError) return userPermissionsError

      let botPermissionsError = this.checkBotPermissions(message)
      if (botPermissionsError) return botPermissionsError

      let argsError = this.checkArgs(args, guild.prefix)
      if (argsError) return argsError

      let cooldownError = await this.checkCooldown(user.userId)
      if (cooldownError) return cooldownError

      if (this.mention) props.mention = this.checkMention(message, args)

      return null
    }
}
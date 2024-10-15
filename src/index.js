require("dotenv").config()

const Client = require('./class/Client')
const Commands = require('./commands')
const Events = require('./events')
const Database = require('./db')

Database()

Events(Client)
Commands(Client)

Client.login(process.env.TOKEN)
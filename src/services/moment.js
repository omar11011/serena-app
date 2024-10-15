const moment = require('moment')
require('moment-timezone')

moment.tz.setDefault('America/Lima')

const getDateTime = () => moment().format('HH:mm A')

module.exports = {
    getDateTime,
}
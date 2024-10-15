const capitalizeWord = require('../../utils/capitalizeWords')
const Type = require('../pokemon-type')

module.exports = class {
    constructor(props) {
        this._name = props.name
        this._generation = props.generation || 1
        this._class = props.class || 'fisico'
        this._type = props.type || 'normal'
        this._power = props.power || 0
        this._precision = props.precision || 100
        this._priority = props.priority || 0
        this._hits = props.hits || 1
        this._effects = props.effects || []
        this._zMove = props.zMove || null
    }

    getClass() {
        const classes = ['fisico', 'especial', 'estado']
        if (!classes.includes(this._class)) this._class = classes[0]
        return capitalizeWord(this._class)
    }

    getEffects() {
        this._effects = this._effects.map(e => {
            if (!e.stat) e.stat = 'attack'
            if (!e.toUser) e.toUser = true
            if (!e.points) e.points = 1
            if (!e.probability) e.probability = 100
            if ((e.stat === 'accuracy' || e.stat === 'evasion') && Math.abs(e.points) < 10) e.points *= 10
            return e
        })
        return this._effects
    }

    getZMove() {
        if (this._zMove === null || this._zMove === undefined) return null
        if (!Array.isArray(this._zMove)) this._zMove = [ this._zMove ]
        this._zMove = this._zMove.map(e => {
            return {
                pokemon: e.pokemon ? forms.find(f => capitalizeWord(e.pokemon) === capitalizeWord(f.name)) : null,
                power: e.power ? parseInt(e.power) : 100,
                type: capitalizeWord(this._type),
                item: e.item ? capitalizeWord(e.item) : null,
            }
        })
        return this._zMove
    }

    data() {
        let type = Type.Data.find(t => capitalizeWord(t.name) === capitalizeWord(this._type))
        return {
            name: capitalizeWord(this._name),
            generation: parseInt(this._generation),
            class: this.getClass(),
            type: type ? new Type.Class(type) : null,
            power: parseInt(this._power),
            precision: parseInt(this._precision),
            priority: parseInt(this._priority),
            hits: parseInt(this._hits),
            effects: this.getEffects(),
            zMove: this.getZMove(),
        }
    }
}
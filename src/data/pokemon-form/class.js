const axios = require('../../services/axios')
const capitalizeWord = require('../../utils/capitalizeWords')

const Type = require('../pokemon-type')
const Region = require('../pokemon-region')
const Specie = require('../pokemon-specie')
const Movement = require('../pokemon-movement')

module.exports = class {
    constructor(props) {
        this._name = props.name
        this._specie = props.specie || props.name
        this._region = props.region || 'kanto'
        this._type = props.type || 'normal'
        this._preEvolution = props.preEvolution || null
        this._evolutions = props.evolutions || []
        this._stats = props.stats || {}
        this._movements = props.movements || {}
    }

    getTypes() {
        if (!Array.isArray(this._type)) this._type = this._type.trim().split(' ')
        this._type = this._type.map(e => e.toLowerCase())
        return this._type
    }

    getEvolutions() {
        if (!Array.isArray(this._evolutions)) this._evolutions = [ this._evolutions ]
        this._evolutions = this._evolutions.map(e => {
            if (!e.pokemon) return null
            return {
                pokemon: capitalizeWord(e.pokemon),
                type: e.type || 'nivel',
                level: parseInt(e.level) || 1,
                friendship: parseInt(e.friendship) || 0,
                item: e.item ? capitalizeWord(e.item) : null,
            }
        }).filter(Boolean)
        return this._evolutions
    }

    getStats() {
        let stats = ['hp', 'attack', 'defense', 'spattack', 'spdefense', 'speed']
        for (let i = 0; i < stats.length; i++) {
            if (!this._stats[stats[i]]) this._stats[stats[i]] = 30
        }
        return this._stats
    }

    getMoves() {
        const movements = []
        if (!this._movements.level) this._movements.level = []
        if (!this._movements.machine) this._movements.machine = []
        if (!this._movements.tutor) this._movements.tutor = []

        let types = ['nivel', 'mt', 'tutor']

        types.forEach(t => {
            this._movements[t].forEach(m => {
                if (typeof m !== 'object') m = { name: m }
                let move = Movement.Data.find(e => capitalizeWord(e.name) === capitalizeWord(m.name))
                if (move) {
                    if (!m.level) m.level = 1
                    m.name = capitalizeWord(m.name)
                    m.type = t
                    movements.push(m)
                }
            })
        })
        this._movements = movements
        return this._movements
    }

    async data() {
        let specie = Specie.Data.find(e => capitalizeWord(e.name) === capitalizeWord(this._specie))
        let region = Region.Data.find(e => capitalizeWord(e.name) === capitalizeWord(this._region))

        return {
            name: capitalizeWord(this._name),
            specie: specie ? new Specie.Class(specie) : null,
            region: region ? new Region.Class(region) : null,
            type: this.getTypes().map(e => {
                const type = Type.Data.find(t => capitalizeWord(e) === capitalizeWord(t.name))
                if (type) return new Type.Class(type)
                else return null
            }).filter(Boolean),
            preEvolution: this._preEvolution,
            evolutions: this.getEvolutions(),
            stats: this.getStats(),
            movements: this.getMoves(),
            image: {
                default: (await axios.get(`image?folder=pokemon-form&image=${this._name}`)).url,
                shiny: (await axios.get(`image?folder=pokemon-form&image=${this._name} shiny`)).url,
            },
        }
    }
}
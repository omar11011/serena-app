const axios = require('../../services/axios')
const capitalizeWord = require('../../utils/capitalizeWords')

const Type = require('../pokemon-type')
const Region = require('../pokemon-region')
const Specie = require('../pokemon-specie')
const Movement = require('../pokemon-movement')
const Nature = require('../pokemon-nature/class')

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
        this._isMega = props.isMega !== undefined ? props.isMega : false
        this._isGiga = props.isGiga !== undefined ? props.isGiga : false
        this._isLegendary = props.isLegendary !== undefined ? props.isLegendary : false
        this._isMythical = props.isMythical !== undefined ? props.isMythical : false
        this._isUltraBeast = props.isUltraBeast !== undefined ? props.isUltraBeast : false
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
            if (!this._stats[stats[i]]) this._stats[stats[i]] = '???'
        }
        return this._stats
    }

    setDinamaxMove() {
        if (this._name.includes('gigamax') || this._name.includes('dinamax')) {
            let moves = []
            if (!this._movements.gigamax) this._movements.gigamax = []
            moves.push('maxibarrera')
            if (this._type.includes('acero')) moves.push('maximetal')
            if (this._type.includes('agua')) moves.push('maxichorro')
            if (this._type.includes('bicho')) moves.push('maxiinsecto')
            if (this._type.includes('dragon')) moves.push('maxidraco')
            if (this._type.includes('electrico')) moves.push('maxitormenta')
            if (this._type.includes('fantasma')) moves.push('maxiespectro')
            if (this._type.includes('fuego')) moves.push('maxignicion')
            if (this._type.includes('hada')) moves.push('maxiestela')
            if (this._type.includes('hielo')) moves.push('maxihelada')
            if (this._type.includes('lucha')) moves.push('maxipuño')
            if (this._type.includes('normal')) moves.push('maxiataque')
            if (this._type.includes('planta')) moves.push('maxiflora')
            if (this._type.includes('psiquico')) moves.push('maxionda')
            if (this._type.includes('roca')) moves.push('maxilito')
            if (this._type.includes('siniestro')) moves.push('maxisombra')
            if (this._type.includes('tierra')) moves.push('maxitemblor')
            if (this._type.includes('veneno')) moves.push('maxiacido')
            if (this._type.includes('volador')) moves.push('maxiciclon')
            this._movements.gigamax = this._movements.gigamax.concat(moves)
        }
    }

    getMoves() {
        let movements = []

        this.setDinamaxMove()

        Object.keys(this._movements).forEach(t => {
            this._movements[t].forEach(m => {
                if (typeof m !== 'object') m = { name: m }
                let move = Movement.Data.find(e => capitalizeWord(e.name) === capitalizeWord(m.name))
                if (!move) return
                if (!m.level) m.level = 1
                m.name = capitalizeWord(m.name)
                m.type = t
                movements.push(m)
            })
        })
        this._movements = movements
        return this._movements
    }

    isSpawn(props) {
        let { name, limitedEdition } = props
        let spawn = true
        let pokemon = name.toLowerCase().split(' ')
        let excludedWords = [
            'mega', 'gigamax', 'dinamax', 'primal', 'desatado',
            '10%', '50%', 'completo',
        ]

        excludedWords.forEach(e => {
            if (pokemon.includes(e)) spawn = false
        })

        if (limitedEdition) spawn = false
        
        return spawn
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
            nature: new Nature(),
            preEvolution: this._preEvolution ? capitalizeWord(this._preEvolution) : null,
            evolutions: this.getEvolutions(),
            stats: this.getStats(),
            movements: this.getMoves(),
            image: {
                default: (await axios.get(`image?folder=pokemon-form&image=${this._name}`)).url,
                shiny: (await axios.get(`image?folder=pokemon-form&image=${this._name} shiny`)).url,
            },
            isMega: this._isMega,
            isGiga: this._isGiga,
            isLegendary: this._isLegendary,
            isMythical: this._isMythical,
            isUltraBeast: this._isUltraBeast
        }
    }
}
const axios = require('../../services/axios')
const capitalizeWord = require('../../utils/capitalizeWords')

const Growth = require('../pokemon-growth')
const Habitat = require('../pokemon-habitat')
const EggGroup = require('../pokemon-eggGroup')

module.exports = class {
    constructor(props) {
        this._pokedex = props.pokedex
        this._name = props.name
        this._height = props.height
        this._weight = props.weight
        this._category = props.category
        this._gender = {
            male: props.gender.male || 0,
            female: props.gender.female || 0,
        }
        this._eggGroup = props.eggGroup || 'desconocido'
        this._growth = props.growth || 'parabolico'
        this._captureRatio = props.captureRatio || 45
        this._friendship = props.friendship || 50
        this._habitat = props.habitat || 'pradera'
    }

    getEggGroups() {
        if (!Array.isArray(this._eggGroup)) this._eggGroup = this._eggGroup.trim().split(' ')
        this._eggGroup = this._eggGroup.map(e => e.toLowerCase())
        return this._eggGroup
    }

    async data() {
        let growth = Growth.Data.find(e => capitalizeWord(e.name) === capitalizeWord(this._growth))
        let habitat = Habitat.Data.find(e => capitalizeWord(e.name) === capitalizeWord(this._habitat))

        return {
            pokedex: this._pokedex ? parseInt(this._pokedex) : '???',
            name: this._name ? capitalizeWord(this._name) : null,
            height: this._height ? parseFloat(this._height) : '???',
            weight: this._weight ? parseFloat(this._weight) : '???',
            category: this._category ? capitalizeWord(this._category) : null,
            gender: {
                male: parseFloat(this._gender.male),
                female: parseFloat(this._gender.female),
            } || null,
            eggGroup: this._eggGroup.map(e => {
                const group = EggGroup.Data.find(g => capitalizeWord(g.name) === capitalizeWord(e))
                if (group) return new EggGroup.Class(group)
                else return false
            }).filter(Boolean),
            growth: growth ? new Growth.Class(growth) : null,
            captureRatio: parseInt(this._captureRatio),
            friendship: parseInt(this._friendship),
            habitat: habitat ? new Habitat.Class(habitat) : null,
            image: {
                default: (await axios.get(`image?folder=pokemon-specie&image=${this._name}`)).url
            },
        }
    }
}
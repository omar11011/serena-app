const capitalizeWord = require('../../utils/capitalizeWords')

module.exports = class {
    constructor(props) {
        this._name = props.name
        this._effectiveness = props.effectiveness
    }

    effectiveness(type) {
        let result = 1
        if (this._effectiveness.superEffective.includes(type)) result = 2
        else if (this._effectiveness.ineffective.includes(type)) result = 0.5
        else if (this._effectiveness.doesNotAffect.includes(type)) result = 0
        return result
    }

    data() {
        return {
            name: capitalizeWord(this._name),
        }
    }
}
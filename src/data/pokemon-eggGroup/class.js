const capitalizeWord = require('../../utils/capitalizeWords')

module.exports = class {
    constructor(props) {
        this._name = props.name
    }

    data() {
        return {
            name: capitalizeWord(this._name),
        }
    }
}
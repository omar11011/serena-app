const axios = require('../../services/axios')
const capitalizeWord = require('../../utils/capitalizeWords')

module.exports = class {
    constructor(props) {
        this._name = props.name
        this._description = props.description
    }

    async data() {
        return {
            name: capitalizeWord(this._name),
            description: this._description,
            image: (await axios.get(`image?folder=habitat&image=${this._name}`)).url,
        }
    }
}
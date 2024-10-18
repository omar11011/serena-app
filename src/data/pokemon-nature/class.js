const capitalizeWord = require('../../utils/capitalizeWords')

module.exports = class {
    constructor(props) {
        this._data = [
            "Fuerte",
            "Hurana",
            "Audaz",
            "Firme",
            "Picara",
            "Osada",
            "Docil",
            "Placida",
            "Agitada",
            "Floja",
            "Miedosa",
            "Activa",
            "Seria",
            "Alegre",
            "Ingenua",
            "Modesta",
            "Afable",
            "Mansa",
            "Timida",
            "Alocada",
            "Serena",
            "Amable",
            "Grosera",
            "Cauta",
            "Rara"
        ]          
    }

    random() {
        return this._data[Math.floor(Math.random() * this._data.length)]
    }

    effects(nature) {
        const effects = {
            "Fuerte": { attack: 0, defense: 0, spattack: 0, spdefense: 0, speed: 0 },
            "Huraña": { attack: 1, defense: -1, spattack: 0, spdefense: 0, speed: 0 },
            "Osada": { attack: -1, defense: 1, spattack: 0, spdefense: 0, speed: 0 },
            "Audaz": { attack: 1, defense: 0, spattack: 0, spdefense: 0, speed: -1 },
            "Firme": { attack: 1, defense: 0, spattack: -1, spdefense: 0, speed: 0 },
            "Modesta": { attack: -1, defense: 0, spattack: 1, spdefense: 0, speed: 0 },
            "Dócil": { attack: 0, defense: 0, spattack: 0, spdefense: 0, speed: 0 },
            "Afable": { attack: 0, defense: -1, spattack: 1, spdefense: 0, speed: 0 },
            "Activa": { attack: 0, defense: -1, spattack: 0, spdefense: 0, speed: 1 },
            "Serena": { attack: 0, defense: 0, spattack: 0, spdefense: 1, speed: -1 },
            "Miedosa": { attack: -1, defense: 0, spattack: 0, spdefense: 0, speed: 1 },
            "Floja": { attack: 0, defense: 1, spattack: 0, spdefense: -1, speed: 0 },
            "Agitada": { attack: 0, defense: 1, spattack: 0, spdefense: -1, speed: 0 },
            "Tímida": { attack: 0, defense: 0, spattack: 0, spdefense: 0, speed: 0 },
            "Cauta": { attack: 0, defense: 0, spattack: -1, spdefense: 1, speed: 0 },
            "Pícara": { attack: 1, defense: 0, spattack: 0, spdefense: -1, speed: 0 },
            "Alocada": { attack: 0, defense: 0, spattack: 1, spdefense: -1, speed: 0 },
            "Rara": { attack: 0, defense: 0, spattack: 0, spdefense: 0, speed: 0 },
            "Ingenua": { attack: 0, defense: 0, spattack: -1, spdefense: 0, speed: 1 },
            "Plácida": { attack: 0, defense: 1, spattack: 0, spdefense: 0, speed: -1 },
            "Mansa": { attack: 0, defense: 0, spattack: 1, spdefense: 0, speed: -1 },
            "Grosera": { attack: 0, defense: 0, spattack: 0, spdefense: 1, speed: -1 },
            "Seria": { attack: 0, defense: 0, spattack: 0, spdefense: 0, speed: 0 },
            "Alegre": { attack: 0, defense: 0, spattack: -1, spdefense: 0, speed: 1 }
        }
    
        return effects[nature] || null
    }
}
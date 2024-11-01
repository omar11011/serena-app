const Command = require('../../class/Command')
const axios = require('../../services/axios')
const createEmbed = require('../../utils/createEmbed')
const calculateXpNeeded = require('../../functions/xpNeeded')

module.exports = new Command({
    name: 'train',
    alias: ['entrenar'],
    description: 'Entrena a tu Pokémon para que gane experiencia.',
    cooldown: 30,
    execute: async (message, props) => {
        const embed = {}
        if (!props.user.pokemon) {
            embed.color = 'red'
            embed.description = `No tienes seleccionado ningún Pokémon.`
            return message.reply(createEmbed(embed))
        }

        const xp = Math.ceil(Math.random() * 15)
        const friendship = Math.random() > 0.8 ? 1 : 0
        const pokemon = await axios.update('pokemon-capture', {
            _id: props.user.pokemon,
            inc: {
                'status.xp': xp,
                'status.friendship': friendship,
            },
        })

        const currentPokemon = await axios.get(`pokemon-capture/${props.user.pokemon}`)
        const xpNeeded = calculateXpNeeded(currentPokemon)
        
        const levelUp = currentPokemon.status.xp >= xpNeeded
        if (levelUp) {
            await axios.update('pokemon-capture', {
                _id: currentPokemon._id,
                set: { 'status.xp': currentPokemon.status.xp - xpNeeded },
                inc: { 'status.level': 1 },
            })

            embed.description = `**${currentPokemon.traits.nickname || currentPokemon.pokemon.name}** ha alcanzado el nivel ${currentPokemon.status.level + 1}.`
            return message.reply(createEmbed(embed))
        }

        embed.description = `**${currentPokemon.traits.nickname || currentPokemon.pokemon.name}** ha ganado ${xp} puntos de experiencia.`
        return message.reply(createEmbed(embed))
    }
})
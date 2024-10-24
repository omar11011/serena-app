const Command = require('../../class/Command')
const axios = require('../../services/axios')
const Data = require('../../data')
const createEmbed = require('../../utils/createEmbed')

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

        const xp = Math.ceil(Math.random() * 7)
        const friendship = Math.random() > 0.8 ? 1 : 0
        const pokemon = await axios.update('pokemon', {
            _id: props.user.pokemon,
            inc: {
                'status.xp': xp,
                'status.friendship': friendship,
            },
        })
        const form = await (await Data.get('form', pokemon.pokemon)).data()
        const specie = await form.specie.data()
        const xpNeeded = specie.growth.xpNeeded(pokemon.status.level)
        
        const levelUp = pokemon.status.xp >= xpNeeded
        if (levelUp) {
            await axios.update('pokemon', {
                _id: pokemon._id,
                set: { 'status.xp': pokemon.status.xp - xpNeeded },
                inc: { 'status.level': 1 },
            })

            embed.description = `**${pokemon.traits.nickname || pokemon.pokemon}** ha alcanzado el nivel ${pokemon.status.level + 1}.`
            return message.reply(createEmbed(embed))
        }

        embed.description = `**${pokemon.traits.nickname || pokemon.pokemon}** ha ganado ${xp} puntos de experiencia.`
        return message.reply(createEmbed(embed))
    }
})
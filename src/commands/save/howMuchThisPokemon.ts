import {SlashCommandBuilder, SlashCommandStringOption} from "@discordjs/builders";
import {ChatInputCommandInteraction, Interaction} from "discord.js";
import logger from "../../middlewares/error"
import language from "../../lang/language";
import {getServerById} from "../../cache/ServerCache";
import {getUserById} from "../../cache/UserCache";
import allPokemon from "../../data/pokemon.json";

export default {
    "name": "howmuch",
    "command": new SlashCommandBuilder()
    .setName("howmuch")
    .setNameLocalizations({
            'fr': "combien"
    })
    .setDescription(language("commandHowExplication","eng"))
    .setDescriptionLocalizations({
            'fr': language("commandHowExplication","fr")
    })
    .addStringOption(
            new SlashCommandStringOption()
                    .setName(language("commandHowOptionNameStringNumber","eng"))
                    .setNameLocalizations({
                            'fr': language("commandHowOptionNameStringNumber","fr")
                    })
                    .setDescription(language("commandHowOptionDescStringNumber","eng"))
                    .setDescriptionLocalizations({
                            'fr': language("commandHowOptionDescStringNumber","fr")
                    })
                    .setRequired(false)
    )
    .addStringOption(
            new SlashCommandStringOption()
                    .setName(language("commandHowOptionNameStringPokemonName","eng"))
                    .setNameLocalizations({
                            'fr': language("commandHowOptionNameStringPokemonName","fr")
                    })
                    .setDescription(language("commandHowOptionDescStringPokemonName","eng"))
                    .setDescriptionLocalizations({
                            'fr': language("commandHowOptionDescStringPokemonName","fr")
                    })
                    .setRequired(false)
                ),
    "actif": true,
    async execute(interaction: ChatInputCommandInteraction){
        try{
            // TODO: a faire de 0
            if (!interaction.guildId) return;

            const server = await getServerById(interaction.guildId);
            const user = await getUserById(interaction.user.id);

            const pokemonNameInput = interaction.options.getString(language("commandHowOptionNameStringPokemonName", "eng"));
            let pokemonId = interaction.options.getString(language("commandHowOptionNameStringNumber", "eng"));

            if (pokemonNameInput) {
                const matchedPokemon = allPokemon.find(pokemon =>
                    pokemon.id !== 0 &&
                    (
                        pokemon.name.nameEng[0].toLowerCase() === pokemonNameInput.toLowerCase() ||
                        pokemon.name.nameFr[0].toLowerCase() === pokemonNameInput.toLowerCase()
                    )
                );

                if (matchedPokemon) {
                    pokemonId = matchedPokemon.id.toString();
                } else {
                    await interaction.reply(language("notExist", server.language));
                    return;
                }

            } else if (pokemonId) {
                const valid = allPokemon.some(pokemon =>
                    pokemon.id !== 0 && pokemon.id.toString() === pokemonId
                );

                if (!valid) {
                    await interaction.reply(language("notExist", server.language));
                    return;
                }

            } else {
                await interaction.reply(language("noArgument", server.language));
                return;
            }


        } catch (e) {
            logger.error(e)
        }
        
    }

}
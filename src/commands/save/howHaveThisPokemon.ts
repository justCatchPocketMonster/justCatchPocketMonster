import {SlashCommandBuilder, SlashCommandStringOption} from "@discordjs/builders";
import { Interaction } from "discord.js";
import logger from "../../middlewares/error"
import language from "../../lang/language";

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
    async execute(interaction: Interaction){
        try{
            // TODO: a faire de 0
        } catch (e) {
            logger.error(e)
        }
        
    }

}
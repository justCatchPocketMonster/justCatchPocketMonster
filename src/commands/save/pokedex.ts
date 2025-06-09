import {SlashCommandBuilder, SlashCommandStringOption} from "@discordjs/builders";
import { Interaction } from "discord.js";
import logger from "../../middlewares/error"
import language from "../../lang/language";

export default {
    "name": "pokedex",
    "command": new SlashCommandBuilder()
    .setName("pokedex")
    .setDescription(language("commandPokedexExplication","eng"))
    .setDescriptionLocalizations({
            'fr': language("commandPokedexExplication","fr")
    })
    .addStringOption(
            new SlashCommandStringOption()
                    .setName(language("pokedexNameOptionStringPage","eng"))
                    .setNameLocalizations({
                            'fr': language("pokedexNameOptionStringPage","fr")
                    })
                    .setDescription(language("pokedexDescOptionStringPage","eng"))
                    .setDescriptionLocalizations({
                            'fr': language("pokedexDescOptionStringPage","fr")
                    })
                    .setRequired(false)
    ),
    "actif": true,
    async execute(interaction: Interaction){
        try{
            
        } catch (e) {
            logger.error(e)
        }
        
    }

}
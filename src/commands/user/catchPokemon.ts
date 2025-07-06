import {SlashCommandBuilder, SlashCommandStringOption} from "@discordjs/builders";
import {ChatInputCommandInteraction} from "discord.js";
import logger from "../../middlewares/error"
import language from "../../lang/language";

export default {
    "name": "catch",
    "command": new SlashCommandBuilder()
    .setName("catch")
        .setDescription(language("commandCatchExplication","eng"))
        .setDescriptionLocalizations({
                'fr': language("commandCatchExplication","fr")
        })
        .addStringOption(
                new SlashCommandStringOption()
                        .setName(language("commandCatchOptionName","eng"))
                        .setNameLocalizations({
                                'fr': language("commandCatchOptionName","fr")
                        })
                        .setDescription(language("commandCatchOptionDesc","eng"))
                        .setDescriptionLocalizations({
                                'fr': language("commandCatchOptionDesc","fr")
                        })
                        .setRequired(true)
        )
    ,
    "actif": true,
    async execute(interaction: ChatInputCommandInteraction){
        try{
            // TODO: a faire de 0
        } catch (e) {
            logger.error(e)
        }
        
    }

}
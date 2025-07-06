import {SlashCommandBuilder} from "@discordjs/builders";
import {ChatInputCommandInteraction, Interaction} from "discord.js";
import logger from "../../middlewares/error"
import language from "../../lang/language";

export default {
    "name": "information",
    "command": new SlashCommandBuilder()
    .setName("information")
    .setDescription(language("commandInformationExplication","eng"))
    .setDescriptionLocalizations({
            'fr': language("commandInformationExplication","fr")
    }),
    "actif": true,
    async execute(interaction: ChatInputCommandInteraction){
        try{
            // TODO: a faire de 0
        } catch (e) {
            logger.error(e)
        }
        
    }

}
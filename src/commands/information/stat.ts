import {SlashCommandBuilder} from "@discordjs/builders";
import { Interaction } from "discord.js";
import logger from "../../middlewares/error"
import language from "../../lang/language";

export default {
    "name": "stat",
    "command": new SlashCommandBuilder()
    .setName("stat")
    .setDescription(language("commandStatExplication","eng"))
    .setDescriptionLocalizations({
            'fr': language("commandStatExplication","fr")
    }),
    "actif": true,
    async execute(interaction: Interaction){
        try{
            // TODO: a faire de 0
        } catch (e) {
            logger.error(e)
        }
        
    }

}
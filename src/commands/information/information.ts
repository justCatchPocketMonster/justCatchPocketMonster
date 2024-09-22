import {SlashCommandBuilder} from "@discordjs/builders";
import { Interaction } from "discord.js";
import logger from "../../middlewares/error"
// @ts-ignore
import bddText from "../../lang/language.json"

export default {
    "name": "information",
    "command": new SlashCommandBuilder()
    .setName("information")
    .setDescription(bddText.commandInformationExplication.eng[0])
    .setDescriptionLocalizations({
            'fr': bddText.commandInformationExplication.fr[0]
    }),
    "actif": true,
    async execute(interaction: Interaction){
        try{
            
        } catch (e) {
            logger.error(e)
        }
        
    }

}
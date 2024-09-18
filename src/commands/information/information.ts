import {SlashCommandBuilder} from "@discordjs/builders";
import { Interaction } from "discord.js";
import logger from "../../middlewares/error"
import bddText from "../../lang/language.json"

module.exports = {
    "name": "information",
    "command": new SlashCommandBuilder()
    .setName("information")
    .setDescription(bddText.commandInformationExplication.Eng[0])
    .setDescriptionLocalizations({
            'fr': bddText.commandInformationExplication.Fr[0]
    }),
    "actif": true,
    async execute(interaction: Interaction){
        try{
            
        } catch (e) {
            logger.error(e)
        }
        
    }

}
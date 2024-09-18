import {SlashCommandBuilder} from "@discordjs/builders";
import { Interaction } from "discord.js";
import logger from "../../middlewares/error"
import bddText from "../../lang/language.json"

module.exports = {
    "name": "stat",
    "command": new SlashCommandBuilder()
    .setName("stat")
    .setDescription(bddText.commandStatExplication.Eng[0])
    .setDescriptionLocalizations({
            'fr': bddText.commandStatExplication.Fr[0]
    }),
    "actif": true,
    async execute(interaction: Interaction){
        try{
            
        } catch (e) {
            logger.error(e)
        }
        
    }

}
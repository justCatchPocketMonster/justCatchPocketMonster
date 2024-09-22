import {SlashCommandBuilder} from "@discordjs/builders";
import { Interaction } from "discord.js";
import logger from "../../middlewares/error"
// @ts-ignore
import bddText from "../../lang/language.json"

export default {
    "name": "stat",
    "command": new SlashCommandBuilder()
    .setName("stat")
    .setDescription(bddText.commandStatExplication.eng[0])
    .setDescriptionLocalizations({
            'fr': bddText.commandStatExplication.fr[0]
    }),
    "actif": true,
    async execute(interaction: Interaction){
        try{
            
        } catch (e) {
            logger.error(e)
        }
        
    }

}
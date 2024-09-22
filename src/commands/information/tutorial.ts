import {SlashCommandBuilder} from "@discordjs/builders";
import { Interaction } from "discord.js";
import logger from "../../middlewares/error"
// @ts-ignore
import bddText from "../../lang/language.json"

export default {
    "name": "tutorial",
    "command": new SlashCommandBuilder()
    .setName("tutorial")
    .setNameLocalizations({
            'fr': "tutoriel"
    })
    .setDescription(bddText.commandHowIDoExplication.eng[0])
    .setDescriptionLocalizations({
            'fr': bddText.commandHowIDoExplication.fr[0]
    }),
    "actif": true,
    async execute(interaction: Interaction){
        try{
            
        } catch (e) {
            logger.error(e)
        }
        
    }

}
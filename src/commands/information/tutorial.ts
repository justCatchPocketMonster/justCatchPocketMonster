import {SlashCommandBuilder} from "@discordjs/builders";
import { Interaction } from "discord.js";
import logger from "../../middlewares/error"
import bddText from "../../lang/language.json"

module.exports = {
    "name": "tutorial",
    "command": new SlashCommandBuilder()
    .setName("tutorial")
    .setNameLocalizations({
            'fr': "tutoriel"
    })
    .setDescription(bddText.commandHowIDoExplication.Eng[0])
    .setDescriptionLocalizations({
            'fr': bddText.commandHowIDoExplication.Fr[0]
    }),
    "actif": true,
    async execute(interaction: Interaction){
        try{
            
        } catch (e) {
            logger.error(e)
        }
        
    }

}
import {SlashCommandBuilder} from "@discordjs/builders";
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
    async execute(){
        try{
            
        } catch (e) {
            logger.error(e)
        }
        
    }

}
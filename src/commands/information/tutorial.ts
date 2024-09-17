import {SlashCommandBuilder} from "@discordjs/builders";
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
    async execute(){
        try{
            
        } catch (e) {
            logger.error(e)
        }
        
    }

}
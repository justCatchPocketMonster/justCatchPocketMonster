import {SlashCommandBuilder, SlashCommandStringOption} from "@discordjs/builders";
import logger from "../../middlewares/error"
import bddText from "../../lang/language.json"

module.exports = {
    "name": "code",
    "command": new SlashCommandBuilder()
    .setName("code")
    .setDescription(bddText.commandCodeExplication.Eng[0])
    .setDescriptionLocalizations({
            'fr': bddText.commandCodeExplication.Fr[0]
    })
    .addStringOption(
            new SlashCommandStringOption()
                    .setName(bddText.codeNameOptionString.Eng[0])
                    .setNameLocalizations({
                            'fr': bddText.codeNameOptionString.Fr[0]
                    })
                    .setDescription(bddText.codeDescOptionString.Eng[0])
                    .setDescriptionLocalizations({
                            'fr': bddText.codeDescOptionString.Fr[0]
                    })
                    .setRequired(true)
    )
    ,
    "actif": true,
    async execute(){
        try{
            
        } catch (e) {
            logger.error(e)
        }
        
    }

}
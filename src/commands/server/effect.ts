import {SlashCommandBuilder} from "@discordjs/builders";
import logger from "../../middlewares/error"
import bddText from "../../lang/language.json"

module.exports = {
    "name": "currentminievent",
    "command": new SlashCommandBuilder()
    .setName("currentminievent")
        .setNameLocalizations({
                'fr': "actuelminievent"
        })
        .setDescription(bddText.commandEffectEvent.Eng[0])
        .setDescriptionLocalizations({
                'fr': bddText.commandEffectEvent.Fr[0]
        })
    ,
    "actif": true,
    async execute(){
        try{
            
        } catch (e) {
            logger.error(e)
        }
        
    }

}
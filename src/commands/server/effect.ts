import {SlashCommandBuilder} from "@discordjs/builders";
import { Interaction } from "discord.js";
import logger from "../../middlewares/error"
// @ts-ignore
import bddText from "../../lang/language.json"

export default {
    "name": "currentminievent",
    "command": new SlashCommandBuilder()
    .setName("currentminievent")
        .setNameLocalizations({
                'fr': "actuelminievent"
        })
        .setDescription(bddText.commandEffectEvent.eng[0])
        .setDescriptionLocalizations({
                'fr': bddText.commandEffectEvent.fr[0]
        })
    ,
    "actif": true,
    async execute(interaction: Interaction){
        try{
            
        } catch (e) {
            logger.error(e)
        }
        
    }

}
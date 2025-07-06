import {SlashCommandBuilder} from "@discordjs/builders";
import { Interaction } from "discord.js";
import logger from "../../middlewares/error"
import language from "../../lang/language";

export default {
    "name": "currentminievent",
    "command": new SlashCommandBuilder()
    .setName("currentminievent")
        .setNameLocalizations({
                'fr': "actuelminievent"
        })
        .setDescription(language("commandEffectEvent","eng"))
        .setDescriptionLocalizations({
                'fr': language("commandEffectEvent","fr")
        })
    ,
    "actif": true,
    async execute(interaction: Interaction){
        try{
            // TODO: a faire de 0
        } catch (e) {
            logger.error(e)
        }
        
    }

}
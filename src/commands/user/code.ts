import {SlashCommandBuilder, SlashCommandStringOption} from "@discordjs/builders";
import { Interaction } from "discord.js";
import logger from "../../middlewares/error"
// @ts-ignore
import bddText from "../../lang/language.json"

export default {
    "name": "code",
    "command": new SlashCommandBuilder()
    .setName("code")
    .setDescription(bddText.commandCodeExplication.eng[0])
    .setDescriptionLocalizations({
            'fr': bddText.commandCodeExplication.fr[0]
    })
    .addStringOption(
            new SlashCommandStringOption()
                    .setName(bddText.codeNameOptionString.eng[0])
                    .setNameLocalizations({
                            'fr': bddText.codeNameOptionString.fr[0]
                    })
                    .setDescription(bddText.codeDescOptionString.eng[0])
                    .setDescriptionLocalizations({
                            'fr': bddText.codeDescOptionString.fr[0]
                    })
                    .setRequired(true)
    )
    ,
    "actif": true,
    async execute(interaction: Interaction){
        try{
            
        } catch (e) {
            logger.error(e)
        }
        
    }

}
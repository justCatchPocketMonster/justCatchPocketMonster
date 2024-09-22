import {SlashCommandBuilder, SlashCommandStringOption} from "@discordjs/builders";
import { Interaction } from "discord.js";
import logger from "../../middlewares/error"
// @ts-ignore
import bddText from "../../lang/language.json"

export default {
    "name": "catch",
    "command": new SlashCommandBuilder()
    .setName("catch")
        .setDescription(bddText.commandCatchExplication.eng[0])
        .setDescriptionLocalizations({
                'fr': bddText.commandCatchExplication.fr[0]
        })
        .addStringOption(
                new SlashCommandStringOption()
                        .setName(bddText.commandCatchOptionName.eng[0])
                        .setNameLocalizations({
                                'fr': bddText.commandCatchOptionName.fr[0]
                        })
                        
                        .setDescription(bddText.commandCatchOptionDesc.eng[0])
                        .setDescriptionLocalizations({
                                'fr': bddText.commandCatchOptionDesc.fr[0]
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
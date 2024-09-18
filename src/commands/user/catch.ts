import {SlashCommandBuilder, SlashCommandStringOption} from "@discordjs/builders";
import { Interaction } from "discord.js";
import logger from "../../middlewares/error"
import bddText from "../../lang/language.json"

module.exports = {
    "name": "catch",
    "command": new SlashCommandBuilder()
    .setName("catch")
        .setDescription(bddText.commandCatchExplication.Eng[0])
        .setDescriptionLocalizations({
                'fr': bddText.commandCatchExplication.Fr[0]
        })
        .addStringOption(
                new SlashCommandStringOption()
                        .setName(bddText.commandCatchOptionName.Eng[0])
                        .setNameLocalizations({
                                'fr': bddText.commandCatchOptionName.Fr[0]
                        })
                        
                        .setDescription(bddText.commandCatchOptionDesc.Eng[0])
                        .setDescriptionLocalizations({
                                'fr': bddText.commandCatchOptionDesc.Fr[0]
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
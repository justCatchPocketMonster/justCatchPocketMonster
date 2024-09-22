import {SlashCommandBuilder, SlashCommandChannelOption} from "@discordjs/builders";
import { ChannelType, Interaction } from "discord.js";
import logger from "../../middlewares/error"
// @ts-ignore
import bddText from "../../lang/language.json"

export default {
    "name": "hint",
    "command": new SlashCommandBuilder()
    .setName("hint")
    .setNameLocalizations({
            'fr': "indice"
    })
    .setDescription(bddText.commandHintExplication.eng[0])
    .setDescriptionLocalizations({
            'fr': bddText.commandHintExplication.fr[0]
    })
    .addChannelOption(
            new SlashCommandChannelOption()
                    .setName("channel")
                    .setNameLocalizations({
                            'fr': "salon"
                    })
                    .setDescription(bddText.commandHintOptionDescChannel.eng[0])
                    .setDescriptionLocalizations({
                            'fr': bddText.commandHintOptionDescChannel.fr[0]
                    })
                    .addChannelTypes(ChannelType.GuildText)
                    .setRequired(false)
                    ),
    "actif": true,
    async execute(interaction: Interaction){
        try{
            
        } catch (e) {
            logger.error(e)
        }
        
    }

}
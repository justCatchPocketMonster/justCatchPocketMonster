import {SlashCommandBuilder, SlashCommandChannelOption} from "@discordjs/builders";
import { ChannelType } from "discord.js";
import logger from "../../middlewares/error"
import bddText from "../../lang/language.json"

module.exports = {
    "name": "hint",
    "command": new SlashCommandBuilder()
    .setName("hint")
    .setNameLocalizations({
            'fr': "indice"
    })
    .setDescription(bddText.commandHintExplication.Eng[0])
    .setDescriptionLocalizations({
            'fr': bddText.commandHintExplication.Fr[0]
    })
    .addChannelOption(
            new SlashCommandChannelOption()
                    .setName("channel")
                    .setNameLocalizations({
                            'fr': "salon"
                    })
                    .setDescription(bddText.commandHintOptionDescChannel.Eng[0])
                    .setDescriptionLocalizations({
                            'fr': bddText.commandHintOptionDescChannel.Fr[0]
                    })
                    .addChannelTypes(ChannelType.GuildText)
                    .setRequired(false)
                    ),
    "actif": true,
    async execute(){
        try{
            
        } catch (e) {
            logger.error(e)
        }
        
    }

}
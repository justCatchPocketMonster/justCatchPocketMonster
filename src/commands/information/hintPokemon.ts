import {SlashCommandBuilder, SlashCommandChannelOption} from "@discordjs/builders";
import { ChannelType, Interaction } from "discord.js";
import logger from "../../middlewares/error"
import language from "../../lang/language";

export default {
    "name": "hint",
    "command": new SlashCommandBuilder()
    .setName("hint")
    .setNameLocalizations({
            'fr': "indice"
    })
    .setDescription(language("commandHintExplication","eng"))
    .setDescriptionLocalizations({
            'fr': language("commandHintExplication","fr")
    })
    .addChannelOption(
            new SlashCommandChannelOption()
                    .setName("channel")
                    .setNameLocalizations({
                            'fr': "salon"
                    })
                    .setDescription(language("commandHintOptionDescChannel","eng"))
                    .setDescriptionLocalizations({
                            'fr': language("commandHintOptionDescChannel","fr")
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
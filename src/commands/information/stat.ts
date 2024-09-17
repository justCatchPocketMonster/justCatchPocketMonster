import {SlashCommandBuilder, SlashCommandChannelOption} from "@discordjs/builders";
import { ChannelType } from "discord.js";
import logger from "../../middlewares/error"
import bddText from "../../lang/language.json"

module.exports = {
    "name": "stat",
    "command": new SlashCommandBuilder()
    .setName("stat")
    .setDescription(bddText.commandStatExplication.Eng[0])
    .setDescriptionLocalizations({
            'fr': bddText.commandStatExplication.Fr[0]
    }),
    "actif": true,
    async execute(){
        try{
            
        } catch (e) {
            logger.error(e)
        }
        
    }

}
import {SlashCommandBuilder} from "@discordjs/builders";
import {PermissionFlagsBits } from "discord.js";
import logger from "../../middlewares/error"

module.exports = {
    "name": "update-rule",
    "command": new SlashCommandBuilder()
    .setName("update-rule")
    .setDescription("Permet de mettre à jour les règles")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    "actif": true,
    async execute(){
        try{
            
        } catch (e) {
            logger.error(e)
        }
        
    }

}
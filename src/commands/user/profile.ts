import {SlashCommandBuilder, SlashCommandUserOption} from "@discordjs/builders";

import logger from "../../middlewares/error"

module.exports = {
    "name": "profile",
    "command": new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Permet de voir un profile")
    .addUserOption(
            new SlashCommandUserOption()
                    .setName("utilisateur")
                    .setDescription("L'utilisateur dont vous voulez voir le profile")
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
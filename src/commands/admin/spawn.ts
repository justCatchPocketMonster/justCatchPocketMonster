import {SlashCommandBuilder, SlashCommandBooleanOption, SlashCommandChannelOption} from "@discordjs/builders";
import {PermissionFlagsBits, ChannelType, Interaction } from "discord.js";
import logger from "../../middlewares/error"
import bddText from "../../lang/language.json"

module.exports = {
    "name": "spawn",
    "command": new SlashCommandBuilder()
    .setName("spawn")
        .setDescription(bddText.commandSpawnExplication.Eng[0])
        .setDescriptionLocalizations({
                'fr': bddText.commandSpawnExplication.Fr[0]
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addBooleanOption(
                new SlashCommandBooleanOption()
                        .setName(bddText.spawnNameOptionBool.Eng[0])
                        .setNameLocalizations({
                                'fr': bddText.spawnNameOptionBool.Fr[0]
                        })
                        .setDescription(bddText.spawnDescOptionBool.Eng[0])
                        .setDescriptionLocalizations({
                                'fr': bddText.spawnDescOptionBool.Fr[0]
                        })
                        .setRequired(true)
        )
        .addChannelOption(
                new SlashCommandChannelOption()
                        .setName(bddText.spawnNameOptionChannel.Eng[0])
                        .setNameLocalizations({
                                'fr': bddText.spawnNameOptionChannel.Fr[0]
                        })
                        .setDescription(bddText.spawnDescOptionChannel.Eng[0])
                        .setDescriptionLocalizations({
                                'fr': bddText.spawnDescOptionChannel.Fr[0]
                        })
                        //.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
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
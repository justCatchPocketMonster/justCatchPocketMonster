import {SlashCommandBuilder, SlashCommandBooleanOption, SlashCommandChannelOption} from "@discordjs/builders";
import {PermissionFlagsBits, ChannelType, Interaction } from "discord.js";
import logger from "../../middlewares/error"
// @ts-ignore
import bddText from "../../lang/language.json"

export default {
    "name": "spawn",
    "command": new SlashCommandBuilder()
    .setName("spawn")
        .setDescription(bddText.commandSpawnExplication.eng[0])
        .setDescriptionLocalizations({
                'fr': bddText.commandSpawnExplication.fr[0]
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addBooleanOption(
                new SlashCommandBooleanOption()
                        .setName(bddText.spawnNameOptionBool.eng[0])
                        .setNameLocalizations({
                                'fr': bddText.spawnNameOptionBool.fr[0]
                        })
                        .setDescription(bddText.spawnDescOptionBool.eng[0])
                        .setDescriptionLocalizations({
                                'fr': bddText.spawnDescOptionBool.fr[0]
                        })
                        .setRequired(true)
        )
        .addChannelOption(
                new SlashCommandChannelOption()
                        .setName(bddText.spawnNameOptionChannel.eng[0])
                        .setNameLocalizations({
                                'fr': bddText.spawnNameOptionChannel.fr[0]
                        })
                        .setDescription(bddText.spawnDescOptionChannel.eng[0])
                        .setDescriptionLocalizations({
                                'fr': bddText.spawnDescOptionChannel.fr[0]
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
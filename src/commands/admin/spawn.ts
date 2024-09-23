import {SlashCommandBuilder, SlashCommandBooleanOption, SlashCommandChannelOption} from "@discordjs/builders";
import {PermissionFlagsBits, CategoryChannel,GuildTextBasedChannel,ChannelType,  ChatInputCommandInteraction } from "discord.js";
import logger from "../../middlewares/error"
// @ts-ignore
import bddText from "../../lang/language.json"
import {getServer, updateServer} from "../../cache/ServerCache";

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
    async execute(interaction:  ChatInputCommandInteraction){
        try{
            let server = await getServer(interaction.guildId);

            let channel : CategoryChannel | GuildTextBasedChannel
            if(interaction.options.getChannel(bddText.spawnNameOptionChannel.Eng[0]) != null){

                channel = interaction.options.getChannel(bddText.spawnNameOptionChannel.Eng[0]);

            }else {
                channel = interaction.channel;
            }

            if(server.channelAllowed.includes(channel.id)){
                if(interaction.options.getBoolean(bddText.spawnNameOptionBool.eng[0])){
                    interaction.reply({content: bddText.spawnPokemonAlreadyActivate[server.language][0], ephemeral: true});
                }
                else{
                    interaction.reply({content: bddText.spawnPokemonDesactivate[server.language][0], ephemeral: true});
                    server.channelAllowed = server.channelAllowed.filter(item => item !== channel.id)
                }
            } else {
                if(interaction.options.getBoolean(bddText.spawnNameOptionBool.eng[0])){
                    interaction.reply({content: bddText.spawnPokemonActivate[server.language][0], ephemeral: true});
                    server.channelAllowed.push(channel.id)
                }
                else{
                    interaction.reply({content: bddText.spawnPokemonAlreadyDesactivate[server.language][0], ephemeral: true});
                }
            }
            await updateServer(server.id, server);

        } catch (e) {
            logger.error(e)
        }
        
    }

}
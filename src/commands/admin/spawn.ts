import {SlashCommandBuilder, SlashCommandBooleanOption, SlashCommandChannelOption} from "@discordjs/builders";
import {PermissionFlagsBits, CategoryChannel,GuildTextBasedChannel,ChannelType,  ChatInputCommandInteraction } from "discord.js";
import logger from "../../middlewares/error"
import {getServer, updateServer} from "../../cache/ServerCache";
import language from "../../lang/language";

export default {
    "name": "spawn",
    "command": new SlashCommandBuilder()
    .setName("spawn")
        .setDescription(language("commandSpawnExplication","eng"))
        .setDescriptionLocalizations({
                'fr': language("commandSpawnExplication","fr")
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addBooleanOption(
                new SlashCommandBooleanOption()
                        .setName(language("spawnNameOptionBool","eng"))
                        .setNameLocalizations({
                                'fr': language("spawnNameOptionBool","fr")
                        })
                        .setDescription(language("spawnDescOptionBool","eng"))
                        .setDescriptionLocalizations({
                                'fr': language("spawnDescOptionBool","fr")
                        })
                        .setRequired(true)
        )
        .addChannelOption(
                new SlashCommandChannelOption()
                        .setName(language("spawnNameOptionChannel","eng"))
                        .setNameLocalizations({
                                'fr': language("spawnNameOptionChannel","fr")
                        })
                        .setDescription(language("spawnDescOptionChannel","eng"))
                        .setDescriptionLocalizations({
                                'fr': language("spawnDescOptionChannel","fr")
                        })
                        //.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
                        .addChannelTypes(ChannelType.GuildText)
                        
                        .setRequired(false)
                        
        ),
    "actif": true,
    async execute(interaction:  ChatInputCommandInteraction){
        try{
            let guildId = interaction.guildId;
            if (!guildId) { return; }
            let server = await getServer(guildId);

            let channel : CategoryChannel | GuildTextBasedChannel | any
            if(interaction.options.getChannel(language("spawnNameOptionChannel","eng")) != null){

                channel = interaction.options.getChannel(language("spawnNameOptionChannel","eng"));

            }else {
                channel = interaction.channel;
            }

            if(server.channelAllowed.includes(channel.id)){
                if(interaction.options.getBoolean(language("spawnNameOptionBool","eng"))){
                    interaction.reply({content: language("spawnPokemonAlreadyActivate",server.language), ephemeral: true});
                }
                else{
                    interaction.reply({content: language("spawnPokemonDesactivate",server.language), ephemeral: true});
                    server.channelAllowed = server.channelAllowed.filter(item => item !== channel.id)
                }
            } else {
                if(interaction.options.getBoolean(language("spawnNameOptionBool","eng"))){
                    interaction.reply({content: language("spawnPokemonActivate",server.language), ephemeral: true});
                    server.channelAllowed.push(channel.id)
                }
                else{
                    interaction.reply({content: language("spawnPokemonAlreadyDesactivate",server.language), ephemeral: true});
                }
            }
            await updateServer(server.id, server);

        } catch (e) {
            logger.error(e)
        }
        
    }

}
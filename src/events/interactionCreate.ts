import {Interaction, ChatInputCommandInteraction, Client, GuildChannelResolvable} from 'discord.js';
import langue from "../commands/admin/langue"
import spawn from "../commands/admin/spawn";
import hintPokemon from "../commands/information/hintPokemon";
import information from "../commands/information/information";
import stat from "../commands/information/stat";
import tutorial from "../commands/information/tutorial";
import howHaveThisPokemon from "../commands/save/howHaveThisPokemon";
import pokedex from "../commands/save/pokedex";
import effect from "../commands/server/effect";
import code from "../commands/user/code";
import catchPokemon from "../commands/user/catchPokemon";

import logger from "../middlewares/error"
import checkTimeForResetEventStat from "../features/event/checkTimeForResetEventStat";

export default async (client: Client,interaction: Interaction) => {
    try{
        if(!verification(client, interaction as ChatInputCommandInteraction)){
            return;
        }

    if(interaction instanceof ChatInputCommandInteraction && interaction.isCommand()){
        checkTimeForResetEventStat(interaction.guildId as string);
        switch (interaction.commandName) {
            case langue.name:
                await langue.execute(interaction)
                break;
            case spawn.name:
                await spawn.execute(interaction)
                break;
            case hintPokemon.name:
                await hintPokemon.execute(interaction)
                break;
            case information.name:
                await information.execute(interaction)
                break;
            case stat.name:
                await stat.execute(interaction)
                break;
            case tutorial.name:
                await tutorial.execute(interaction)
                break;
            case howHaveThisPokemon.name:
                await howHaveThisPokemon.execute(interaction)
                break;
            case pokedex.name:
                await pokedex.execute(interaction)
                break;
            case effect.name:
                await effect.execute(interaction)
                break;
            case code.name:
                await code.execute(interaction)
                break;
            case catchPokemon.name:
                await catchPokemon.execute(interaction)
                break;
        }


        interaction.reply({
            content: `.`,
        });
        setTimeout(() => {
            interaction.deleteReply();
        }, 1000)
    }
} catch (e) {
    logger.error(e);
}
    
}

function verification(client: Client , interaction: ChatInputCommandInteraction): boolean {
    const permissionRequiredSendMessage = "SendMessages";
    const permissionRequiredViewChannel = "ViewChannel";

    const server = interaction.guild;
    const botMember = client.user ? server?.members.cache.get(client.user.id) : undefined;

    let canSendMessage = false;
    let canViewChannel = false;
    if (botMember && interaction.channel) {
        if (interaction.channel?.isTextBased()) {
            canSendMessage = botMember.permissionsIn(interaction.channel as GuildChannelResolvable).has(permissionRequiredSendMessage);
            canViewChannel = botMember.permissionsIn(interaction.channel as GuildChannelResolvable).has(permissionRequiredViewChannel);
        }
    }
    return (canViewChannel && canSendMessage);
}
import { Interaction, ChatInputCommandInteraction } from 'discord.js';
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

export default async (interaction: Interaction) => {
    try{
        
    if(interaction instanceof ChatInputCommandInteraction){
        await interaction.reply({
            content: `Chargement ...`,
        });
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


        await interaction.deleteReply();
    }
} catch (e) {
    logger.error(e);
}
    
}
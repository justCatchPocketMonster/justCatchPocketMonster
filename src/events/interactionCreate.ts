import { Interaction, CommandInteraction } from 'discord.js';
import actualStream from "../commands/schedule/actualStream";
import schedule from "../commands/schedule/schedule";

import logger from "../middlewares/error"

export default async (interaction: Interaction) => {
    try{
        
    if(interaction instanceof CommandInteraction){
        interaction.reply({
            content: `Chargement ...`,
        });
    if(interaction.commandName == actualStream.name){
        await actualStream.execute(interaction);
    }
    if(interaction.commandName == schedule.name){
        await schedule.execute(interaction);
    }
    await interaction.deleteReply();
    }
} catch (e) {
    logger.error(e)
}
    
}
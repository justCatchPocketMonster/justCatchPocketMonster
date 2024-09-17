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

        await interaction.deleteReply();
    }
} catch (e) {
    logger.error(e)
}
    
}
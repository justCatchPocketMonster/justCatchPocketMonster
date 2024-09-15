import {Client, TextChannel} from 'discord.js';
import {readdirSync} from 'fs';
import updateMessagePlanning from '../features/planningTwitch';

import generatePlanningImage from '../utils/planningImage/planningImage';

export default (ClientDiscord: Client) => {
    try{

    console.log("Bot is ready")

    for (const folder of readdirSync('./src/commands')) {
        for (const file of readdirSync(`./src/commands/${folder}`)) {
            import(`../commands/${folder}/${file}`).then(async command => {
                if(ClientDiscord.application){
                    if (command.actif){
                        await ClientDiscord.application.commands.create(command.name, command.command);
                    }else {
                        if (ClientDiscord.application.commands.cache.find(c => c.name === command.name)){
                            await ClientDiscord.application.commands.delete(command.name);
                        }
                    }
                }
            });
        }
    }

    let guild = ClientDiscord.guilds.cache.get("848669435618656306");
    if (guild){
        const idChannelSchedule = process.env.SCHEDULE_CHANNEL_ID;
        if(!idChannelSchedule) throw new Error('SCHEDULE_CHANNEL_ID is not defined');
        let channel = guild.channels.cache.get(idChannelSchedule);
        if (channel){
            const textChannel = channel as TextChannel;
            updateMessagePlanning(textChannel);
            setInterval(() => {
                updateMessagePlanning(textChannel)
            }, 1000 * 60 * 10 )
        }
    }

    generatePlanningImage();
} catch (e) {
    console.error(e)
}

}
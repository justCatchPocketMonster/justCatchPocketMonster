import {Client, ActivityType} from 'discord.js';
import {readdirSync} from 'fs';

import logger from "../middlewares/error";
import randomStatus from "../features/other/randomStatus";

export default (ClientDiscord: Client) => {
    try{
    if(!ClientDiscord || !ClientDiscord.user) {
        return console.error("Bot is not ready")
    }
    randomStatus(ClientDiscord);
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

} catch (e) {
    logger.error(e)
}

}
import {Client, Message} from 'discord.js';
import logger from "../middlewares/error"
import spawn from "../features/spawn/spawn";

export default async (client: Client,message: Message<boolean>) => {
    try{
        if (message.author.bot) {
            return;
        }
        if (!message.guild) return;
        spawn(message.guild.id, message.channel.id).then((result) => {
            if (result) {
                const channel = client.channels.cache.get(result.channelId);
                if (channel && channel.isTextBased()) {
                    console.log(result)
                    channel.send({embeds: [result.embed], files: [result.image]});
                }
            }
        });
    } catch (e) {
        logger.error(e)
    }
    
}
import { Message } from 'discord.js';
import logger from "../middlewares/error"
import { RateLimiterMemory } from 'rate-limiter-flexible';
import {getUser} from "../cache/UserCache"

const lvlForLink = 5;

const rateLimiter = new RateLimiterMemory({
    points: 10,
    duration: 5,
  });
  const linkRegex = /https?:\/\/\S+/gi;

export default async (message: Message<boolean>) => {
    try {
        console.log("security check")
        const user = await getUser(message.author.id);
        try {
            await rateLimiter.consume(message.author.id);
        } catch {
            await message.reply("Doucement, tu envoies trop de messages. Le spam n'est pas très bien vu ici");
            await message.delete();
            return;
        }
        /*
        console.log(user)
        console.log(linkRegex.test(message.content))
        console.log(user.levelData.level < lvlForLink)
        console.log(linkRegex.test(message.content) && user.levelData.level < lvlForLink)
        console.log(user.levelData.level)
        */
        if (linkRegex.test(message.content) && user.levelData.level < lvlForLink) {
            console.log("lien")
            await message.channel.send("Les liens ne sont pas autorisés avant le niveau "+lvlForLink+"."); // Envoie un message d'avertissement
            await message.delete(); // Supprime le message contenant un lien
            return;
        }

    } catch (e) {
        logger.error(e)
    }
}
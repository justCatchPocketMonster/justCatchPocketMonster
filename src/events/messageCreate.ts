import { Message } from'discord.js';
import logger from "../middlewares/error"
import { handleXpGain } from '../features/xpSystem';
import securityCheck from '../features/securityCheck';

export default async (message: Message<boolean>) => {
    try{
        
        if(message.author.bot){
            return;
        }
        // TODO: truc a faire
        await securityCheck(message)
        await handleXpGain(message)
        

    } catch (e) {
        logger.error(e)
    }
    
}
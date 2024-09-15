import { getUser, updateUser } from '../cache/UserCache';
import { Message } from 'discord.js';
import User from '../models/User';

export const handleXpGain = async (message: Message<boolean>) => {
    let user = await getUser(message.author.id);
    if (!user) {
        user = new User();
    } else {
        user.levelData.exp += (Math.floor(Math.random() * 10)+1);
        if (user.levelData.exp >= getRequireSuperiorLvl(user.levelData.level)) {
            user.levelData.level += 1;
            user.levelData.exp = 0;
            message.channel.send(`Bravo ${message.author.username}, tu es passé niveau ${user.levelData.level + 1} !`); 
        }
    }
    updateUser(message.author.id, user);
};

function getRequireSuperiorLvl(lvl: number): number {
    //Le taux de l'evolution entre chaque niveau (jvais oublié donc je le note wollah)
    const facteur = 0.1;
    //exp necessaire pour niveau de base
    const expLvlDefault = 100;
    let expLvl = 0;

    for(let i = 0; i < lvl+1; i++){
        expLvl += expLvlDefault + expLvl * facteur;
    }

    return Math.round(expLvl);

}

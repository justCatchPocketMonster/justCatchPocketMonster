
import {Client, ActivityType} from 'discord.js';
import {version } from "../../defaultValue"
import {getStat} from "../../cache/StatCache";
import logger from "../../middlewares/error";
import {getCode} from "../code/code";


const randomStatus = async (Client : Client) => {
    try{
        if(Client == null || Client.user == null) return;

        const statGlobal = await getStat("all");

        let arrayStatus = [
            "Je suis en "+ version +" :D",
            "Je suis désolé les anglophones, je suis français.",
            statGlobal.pokemonSpawned+ " Pokémon sont apparus depuis le début.",
            statGlobal.pokemonCaught+" Pokémon ont été capturés.",
            "I'm on "+ version +" :D",
            "I'm sorry English speakers I'm French.",
            statGlobal.pokemonSpawned+ " pokemon have spawned from the start.",
            statGlobal.pokemonCaught+" pokemon have been catched.",
            "!code " + getCode()["shiny"][Math.floor(Math.random() * getCode()["shiny"].length)]
        ]
        let nbStatus = arrayStatus.length;
        let randomStatus = Math.floor(Math.random()* nbStatus);

        Client.user.setActivity(arrayStatus[randomStatus], {type: ActivityType.Watching});
        /*
        les types
        COMPETING - participe a une compétition
        LISTENING - écoute musique
        PLAYING - joue a un jeu
        STREAMING - bas c'est marqué
        WATCHING - regarde
        */

    } catch(e) {
        logger.error(e)
    }
}

export default randomStatus;
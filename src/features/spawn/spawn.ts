import {AttachmentBuilder, EmbedBuilder} from "discord.js";
import {getServer, updateServer} from "../../cache/ServerCache";
import ServerType from "../../types/ServerType";
import {valeurMaxChoiceEvent, valeurMaxEvent} from "../../defaultValue";
import EventType from "../../types/EventType";
import PokemonType from "../../types/PokemonType";
import selectPokemon from "../pokemon/selectPokemon";
import selectEvent from "../event/selectEvent";


const spawn  = async (idServer: string, idChannel: string) : Promise<{ embed: EmbedBuilder, image: AttachmentBuilder, channelId: string } | null> => {
    const server = await getServer(idServer);
    const channelId = choiceChannel(server, idChannel);
    if(!channelId || hasReachedSpawnLimit(server)) return null;

    choiceTypeOfSpawn(server);

    return null;
}

export default spawn;

function hasReachedSpawnLimit(server: ServerType): boolean {
    initMaxCount(server);
    return server.countMessage >= server.maxCountMessage;

}

function initMaxCount(server: ServerType): void {
    if (server.maxCountMessage && server.maxCountMessage > 0) return;
    do{
        server.maxCountMessage = Math.floor(Math.random() * server.maxMessageForRandom);
    } while(server.maxCountMessage < server.minMessageForRandom);
    updateServer(server.id, server);

}

function choiceChannel(server: ServerType, idChannel: string): string {
    if (server.channelAllowed.length === 0) return "";
    if(server.channelAllowed.includes(idChannel)) return idChannel;

    return server.channelAllowed[Math.floor(Math.random() * server.channelAllowed.length)];
}

// @ts-ignore
async function choiceTypeOfSpawn(server: ServerType) : EventType | PokemonType{
    const randomCategorySpawn = Math.floor(Math.random() * valeurMaxChoiceEvent);

    // TODO: Add the return type
    if(randomCategorySpawn <= valeurMaxEvent) return selectEvent();

    return selectPokemon(server);



}
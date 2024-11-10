import {AttachmentBuilder, ColorResolvable, EmbedBuilder} from "discord.js";
import {getServer, updateServer} from "../../cache/ServerCache";
import ServerType from "../../types/ServerType";
import {valeurMaxChoiceEgg, valeurMaxChoiceEvent, valeurMaxEgg, valeurMaxEvent} from "../../defaultValue";
import EventType from "../../types/EventType";
import PokemonType from "../../types/PokemonType";
import selectPokemon from "../pokemon/selectPokemon";
import selectEvent from "../event/selectEvent";
import pokemonType from "../../types/PokemonType";
import serverType from "../../types/ServerType";
import getText from "../../lang/language";
import {colorByType} from "../../utils/helperFunction";
const allPokemon: PokemonType[] = require('../../data/pokemon.json');


const spawn  = async (idServer: string, idChannel: string) : Promise<{ embed: EmbedBuilder, image: AttachmentBuilder, channelId: string } | null> => {
    const server = await getServer(idServer);
    const channelId = choiceChannel(server, idChannel);
    if(!channelId || hasReachedSpawnLimit(server)) return null;
// TODO: implement spawn when the countMessage is more or equal than maxCountMessage

    return {...choiceTypeOfSpawn(server, channelId), channelId};
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
async function choiceTypeOfSpawn(server: ServerType, idChannel: string) : { embed: EmbedBuilder, image: AttachmentBuilder } {
    const randomCategorySpawn = Math.floor(Math.random() * valeurMaxChoiceEvent);

    if(randomCategorySpawn <= valeurMaxEvent) {
        const event : EventType =  selectEvent();


    };
    const isEgg = valeurMaxChoiceEgg== Math.floor(Math.random() * server.eventSpawn.valeurMaxChoiceEgg)
    const pokemonChoice : pokemonType = selectPokemon(server, 0, isEgg);

    if(isEgg) {
        const eggObject = allPokemon[0]

        pokemonChoice.name = eggObject.name;
        pokemonChoice.imgName = eggObject.imgName;
    }

    pokemonChoice.idChannel = idChannel;
    addPokemonToServer(server, pokemonChoice);

    return generateEmbedPokemon(pokemonChoice, server);
}

function addPokemonToServer(server: ServerType, pokemon: PokemonType): boolean {
    server.pokemonPresent.push(pokemon);
    updateServer(server.id, server);

    return true;
}

function generateEmbedPokemon(pokemon: PokemonType, server : serverType): { embed: EmbedBuilder, image: AttachmentBuilder } {
    const basePath = server.eventSpawn.nightMode
        ? "./src/image/pokeHomeShadow/"
        : "./src/image/pokeHome/";

    const suffix = pokemon.isShiny ? "-shiny.png" : ".png";

    const adressImage: string = basePath + pokemon.imgName + suffix;
    const nameImage: string = pokemon.imgName + suffix;

    const color: ColorResolvable = colorByType(pokemon.arrayType[Math.floor(Math.random() * pokemon.arrayType.length)]) as ColorResolvable;

    let pokeEmbed = new EmbedBuilder()
        .setColor(color)
        .setTitle(getText("embedPokemonTitle", server.language))
        .setDescription(getText("embedPokemonDescription", server.language))
        .setImage("attachment://"+ nameImage)

    return {
        embed: pokeEmbed,
        image: new AttachmentBuilder(adressImage)
    };
}

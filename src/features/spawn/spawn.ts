import {AttachmentBuilder, ColorResolvable, EmbedBuilder} from "discord.js";
import {getServer, updateServer} from "../../cache/ServerCache";
import ServerType from "../../types/ServerType";
import serverType from "../../types/ServerType";
import {valeurMaxChoiceEvent, valeurMaxEvent} from "../../defaultValue";
import EventClass from "../../types/EventType";
import PokemonClass from "../../types/PokemonType";
import pokemonType from "../../types/PokemonType";
import selectPokemon from "../pokemon/selectPokemon";
import selectEvent from "../event/selectEvent";
import getText from "../../lang/language";
import {colorByType} from "../../utils/helperFunction";
import effectEvent from "../event/effectEvent";
import allPokemon from '../../data/pokemon.json';
import logger from "../../middlewares/error";

interface spawnData {
    embed: EmbedBuilder,
    image: AttachmentBuilder,
    channelId: string
}

const spawn  = async (idServer: string, idChannel: string) : Promise<spawnData | null | undefined> => {
    try {
        const server = await getServer(idServer);
        const channelId = choiceChannel(server, idChannel);
        console.log(server.countMessage+"/"+server.maxCountMessage)
        if (!channelId || !hasReachedSpawnLimit(server)) return null;
        console.log("ok")

        let spawnData : spawnData|null = {...(await choiceTypeOfSpawn(server, channelId)), channelId};

        if(
            spawnData.embed === null ||
            spawnData.image === null ||
            spawnData.channelId === null
        ) spawnData = null;

        return spawnData;
    } catch (e) {
        logger.error(e);
    }
}

export default spawn;

function hasReachedSpawnLimit(server: ServerType): boolean {
    server.countMessage = server.countMessage + 1;
    initMaxCount(server);
    updateServer(server.id, server);
    return server.countMessage == 0;

}

function initMaxCount(server: ServerType): void {
    if (server.maxCountMessage && server.maxCountMessage > 0 && server.countMessage< server.maxCountMessage) return;

    do{
        server.maxCountMessage = Math.floor(Math.random() * server.eventSpawn.messageSpawn.max);
    } while(server.maxCountMessage < server.eventSpawn.messageSpawn.min);
    server.countMessage = 0;
}

function choiceChannel(server: ServerType, idChannel: string): string {
    if (server.channelAllowed.length === 0) return "";
    if(server.channelAllowed.includes(idChannel)) return idChannel;

    return server.channelAllowed[Math.floor(Math.random() * server.channelAllowed.length)];
}

// @ts-ignore
async function choiceTypeOfSpawn(server: ServerType, idChannel: string) : { embed: EmbedBuilder, image: AttachmentBuilder } {
    try {

        const randomCategorySpawn = Math.floor(Math.random() * valeurMaxChoiceEvent);

        if (randomCategorySpawn <= valeurMaxEvent) {
            let event: EventClass | null = selectEvent();
            event = effectEvent(event, server);
            if (event === null) throw new Error("Event not found");

            return generateEmbedEvent(event, server);

        }
        const isEgg = 0 == Math.floor(Math.random() * server.eventSpawn.valeurMaxChoiceEgg)
        const pokemonChoice: pokemonType = selectPokemon(server, 0, isEgg);
        if (isEgg) {
            const eggObject = allPokemon[0]

            pokemonChoice.name = eggObject.name;
            pokemonChoice.imgName = eggObject.imgName;
        }
        pokemonChoice.idChannel = idChannel;
        addPokemonToServer(server, pokemonChoice);
        return generateEmbedPokemon(pokemonChoice, server);
    } catch (e) {
        logger.error(e);
    }
}

function addPokemonToServer(server: ServerType, pokemon: PokemonClass): boolean {
    if (!server.pokemonPresent) server.pokemonPresent = [];
    if(server.pokemonPresent.find(pokemonServer => pokemonServer.idChannel === pokemon.idChannel && pokemonServer.idServer === pokemon.idServer)){
        server.pokemonPresent.forEach((pokemonServer) => {
            if (pokemonServer.id !== pokemon.id) {
                Object.assign(pokemonServer, pokemon);
            }
        });
    } else {
        server.pokemonPresent.push(pokemon);
    }

    updateServer(server.id, server);

    return true;
}

// @ts-ignore
function generateEmbedPokemon(pokemon: PokemonClass, server : serverType): { embed: EmbedBuilder, image: AttachmentBuilder } {
    try {
        const basePath = server.eventSpawn.nightMode
            ? "./src/assets/pokeHomeShadow/"
            : "./src/assets/pokeHome/";

        const suffix = pokemon.isShiny ? "-shiny.png" : ".png";

        const adressImage: string = basePath + pokemon.imgName + suffix;
        const nameImage: string = pokemon.imgName + suffix;

        const color: ColorResolvable = colorByType(pokemon.arrayType[Math.floor(Math.random() * pokemon.arrayType.length)]) as ColorResolvable;

        let pokeEmbed = new EmbedBuilder()
            .setColor(color)
            .setTitle(getText("embedPokemonTitle", server.language))
            .setDescription(getText("embedPokemonDescription", server.language))
            .setImage("attachment://" + nameImage)

        return {
            embed: pokeEmbed,
            image: new AttachmentBuilder(adressImage)
        };
    } catch (e) {
        logger.error(e);
    }
}

function generateEmbedEvent(event: EventClass, server: serverType): { embed: EmbedBuilder, image: AttachmentBuilder } {
    const basePath = "./src/assets/eventImage/";

    const adressImage: string = basePath + event.image + ".png";
    const nameImage: string = event.image+".png";

    const color: ColorResolvable = colorByType(event.color) as ColorResolvable;


    let eventEmbed = new EmbedBuilder()
        .setColor(color)
        .setTitle(getText(event.name, server.language))
        .setDescription(getText(event.description, server.language))
        .addFields({
                // @ts-ignore
                name: getText("effect", server.language),
                value: event.effectDescription,
                inline: false
            })
        .setImage("attachment://"+ nameImage)

    return {
        embed: eventEmbed,
        image: new AttachmentBuilder(adressImage)
    };
}

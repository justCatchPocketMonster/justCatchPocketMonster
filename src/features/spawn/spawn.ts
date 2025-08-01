import { AttachmentBuilder, ColorResolvable, EmbedBuilder } from "discord.js";
import { ServerType } from "../../core/types/ServerType";
import {EventType} from "../../core/types/EventType";
import {selectEggPokemon, selectPokemon} from "../pokemon/selectPokemon";
import {selectEvent} from "../event/selectEvent";
import getText from "../../lang/language";
import { colorByType } from "../../utils/helperFunction";
import logger from "../../middlewares/logger";
import { getServerById, updateServer } from "../../cache/ServerCache";
import { valueMaxChoiceEvent } from "../../config/default/spawn";
import { PokemonType } from "../../core/types/PokemonType";
import { Pokemon } from "../../core/classes/Pokemon";
import { getStatById, updateStat } from "../../cache/StatCache";
import {nameStatGeneral, version} from "../../config/default/misc";
import {checkTimeForResetEventStat} from "../event/checkTimeForResetEventStat";

interface spawnData {
  embed: EmbedBuilder;
  image: AttachmentBuilder;
  channelId: string;
}

const spawnLocks = new Set<string>();

export const spawn = async (
  idServer: string,
  idChannel: string,
): Promise<spawnData | null | undefined> => {
    if (spawnLocks.has(idServer)) return null;
    spawnLocks.add(idServer);
  try {
    const server = await getServerById(idServer);
    const channelId = choiceChannel(server, idChannel);
    if (!channelId || !(await hasReachedSpawnLimit(server))) return null;



    let spawnData: spawnData | null = {
      ...(await choiceTypeOfSpawn(server, channelId)),
      channelId,
    };

      if (!spawnData?.embed || !spawnData?.image || !spawnData?.channelId)
      spawnData = null;
    return spawnData;
  } catch (e) {
    logger.error(e);
  } finally {
      spawnLocks.delete(idServer);
  }
};


async function hasReachedSpawnLimit(server: ServerType): Promise<boolean> {
    initMaxCount(server);
    server.countMessage++;

    const reached = server.countMessage >= server.maxCountMessage;

    await updateServer(server.discordId, server);
    return reached;
}


function initMaxCount(server: ServerType): void {
  if (
    server.maxCountMessage &&
    server.maxCountMessage > 0 &&
    server.countMessage < server.maxCountMessage
  )
    return;

  do {
    server.maxCountMessage = Math.floor(
      Math.random() * server.eventSpawn.messageSpawn.max,
    );
  } while (server.maxCountMessage < server.eventSpawn.messageSpawn.min);
  server.countMessage = 0;
}

function choiceChannel(server: ServerType, idChannel: string): string {
  if (server.channelAllowed.length === 0) return "";
  if (server.channelAllowed.includes(idChannel)) return idChannel;

  return server.channelAllowed[
    Math.floor(Math.random() * server.channelAllowed.length)
  ];
}

async function choiceTypeOfSpawn(
  server: ServerType,
  idChannel: string,
): Promise<{ embed: EmbedBuilder; image: AttachmentBuilder; }> {
    await checkTimeForResetEventStat(server)
    const randomCategorySpawn = Math.floor(Math.random() * valueMaxChoiceEvent);
    if (randomCategorySpawn <= 1 && server.eventSpawn.whatEvent === null) {
      await selectEvent(server);
        if(server.eventSpawn.whatEvent) {
            return generateEmbedEvent(server.eventSpawn.whatEvent, server);
        }
    }
    const isEgg =
      0 == Math.floor(Math.random() * server.eventSpawn.valueMaxChoiceEgg);
    let pokemonChoice: PokemonType
    if (isEgg) {
        pokemonChoice = selectEggPokemon(server, 0);
    } else {
        pokemonChoice = selectPokemon(server, 0);
    }
    server.pokemonPresent[idChannel] = pokemonChoice;
    const statVersion = await getStatById(version);
    const statAll = await getStatById(nameStatGeneral);

    statVersion.addSpawn(pokemonChoice as Pokemon);
    statAll.addSpawn(pokemonChoice as Pokemon);

    await updateServer(server.discordId, server);
    await updateStat(version, statVersion);
    await updateStat(nameStatGeneral, statAll);
    console.log(pokemonChoice);
    return generateEmbedPokemon(pokemonChoice, server);

}

function generateEmbedPokemon(
  pokemon: PokemonType,
  server: ServerType,
): { embed: EmbedBuilder; image: AttachmentBuilder } {
  const basePath = server.eventSpawn.nightMode
    ? "./src/assets/pokeHomeShadow/"
    : "./src/assets/pokeHome/";

  const suffix = pokemon.isShiny ? "-shiny.png" : ".png";

  const adressImage: string = basePath + pokemon.imgName + suffix;
  const nameImage: string = pokemon.imgName + suffix;

  const color: ColorResolvable = colorByType(
    pokemon.arrayType[Math.floor(Math.random() * pokemon.arrayType.length)],
  ) as ColorResolvable;

  let pokeEmbed = new EmbedBuilder()
    .setColor(color)
    .setTitle(getText("embedPokemonTitle", server.language))
    .setDescription(getText("embedPokemonDescription", server.language))
    .setImage("attachment://" + nameImage);

  return {
    embed: pokeEmbed,
    image: new AttachmentBuilder(adressImage),
  };
}

function generateEmbedEvent(
  event: EventType,
  server: ServerType,
): { embed: EmbedBuilder; image: AttachmentBuilder } {
  const basePath = "./src/assets/eventImage/";

  const adressImage: string = basePath + event.image + ".png";
  const nameImage: string = event.image + ".png";

  const color: ColorResolvable = event.color as ColorResolvable;

  let eventEmbed = new EmbedBuilder()
    .setColor(color)
    .setTitle(getText(event.name, server.language))
    .setDescription(getText(event.description, server.language))
    .addFields({
      name: getText("effect", server.language),
      value: event.effectDescription,
      inline: false,
    })
    .setImage("attachment://" + nameImage);

  return {
    embed: eventEmbed,
    image: new AttachmentBuilder(adressImage),
  };
}

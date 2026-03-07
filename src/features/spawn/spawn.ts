import { AttachmentBuilder, ColorResolvable, EmbedBuilder } from "discord.js";
import { ServerType } from "../../core/types/ServerType";
import { EventType } from "../../core/types/EventType";
import { selectEggPokemon, selectPokemon } from "../pokemon/selectPokemon";
import { selectEventStandard } from "../event/selectEventStandard";
import getText, { LanguageKey } from "../../lang/language";
import {
  capitalizeFirstLetter,
  colorByType,
  random,
} from "../../utils/helperFunction";
import logger from "../../middlewares/logger";
import { getServerById, updateServer } from "../../cache/ServerCache";
import { valueMaxChoiceEvent } from "../../config/default/spawn";
import { PokemonType } from "../../core/types/PokemonType";
import { Pokemon } from "../../core/classes/Pokemon";
import { getStatById, updateStat } from "../../cache/StatCache";
import { nameStatGeneral, version } from "../../config/default/misc";
import { getImageUrl } from "../../utils/imageUrl";
import { checkTimeForResetEventStat } from "../event/checkTimeForResetEventStat";
import { getActiveRaid, isChannelInRaid } from "../raid/raidManager";
import { selectRaidPokemon } from "../raid/selectRaidPokemon";
import { generateRaidEmbed } from "../raid/raidEmbed";

export interface SpawnData {
  embed: EmbedBuilder;
  image?: AttachmentBuilder;
  channelId: string;
  isRaid?: boolean;
  raidPokemon?: PokemonType;
}

const spawnLocks = new Set<string>();

export const spawn = async (
  idServer: string,
  idChannel: string,
): Promise<SpawnData | null | undefined> => {
  if (spawnLocks.has(idServer)) return null;
  spawnLocks.add(idServer);
  try {
    const server = await getServerById(idServer);
    const channelId = choiceChannel(server, idChannel);

    if (!channelId || !(await hasReachedSpawnLimit(server))) return null;
    let SpawnData: SpawnData | null = {
      ...(await choiceTypeOfSpawn(server, channelId)),
      channelId,
    };

    if (!SpawnData?.embed || !SpawnData?.channelId) SpawnData = null;
    return SpawnData;
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
    server.maxCountMessage = random(
      server.eventSpawn.messageSpawn.max,
      server.eventSpawn.messageSpawn.min,
    );
  } while (server.maxCountMessage < server.eventSpawn.messageSpawn.min);
  server.countMessage = 0;
}

function choiceChannel(server: ServerType, idChannel: string): string {
  if (server.channelAllowed.length === 0) return "";

  const available = server.channelAllowed.filter(
    (ch) => !isChannelInRaid(server.discordId, ch),
  );
  if (available.length === 0) return "";

  if (available.includes(idChannel)) return idChannel;

  return available[random(available.length)];
}

async function choiceTypeOfSpawn(
  server: ServerType,
  idChannel: string,
): Promise<{
  embed: EmbedBuilder;
  image?: AttachmentBuilder;
  isRaid?: boolean;
  raidPokemon?: PokemonType;
}> {
  await checkTimeForResetEventStat(server);

  const isRaidRoll =
    random(server.eventSpawn.valueMaxChoiceRaid) === 0 &&
    !getActiveRaid(server.discordId);
  if (isRaidRoll) {
    const raidPokemon = selectRaidPokemon(server);
    const endTimestamp = Math.floor((Date.now() + 2 * 60 * 1000) / 1000);

    server.pokemonPresent[idChannel] = raidPokemon;

    const statVersion = await getStatById(version);
    const statAll = await getStatById(nameStatGeneral);
    statVersion.addSpawn(raidPokemon as Pokemon);
    statAll.addSpawn(raidPokemon as Pokemon);
    await updateServer(server.discordId, server);
    await updateStat(version, statVersion);
    await updateStat(nameStatGeneral, statAll);
    const { embed } = await generateRaidEmbed(
      raidPokemon,
      server,
      [],
      endTimestamp,
    );
    return { embed, isRaid: true, raidPokemon };
  }

  const randomCategorySpawn = random(valueMaxChoiceEvent);
  if (randomCategorySpawn <= 1 && server.eventSpawn.whatEvent === null) {
    await selectEventStandard(server);
    if (server.eventSpawn.whatEvent) {
      return await generateEmbedEvent(server.eventSpawn.whatEvent, server);
    }
  }
  const isEgg = 0 == random(server.eventSpawn.valueMaxChoiceEgg);
  let pokemonChoice: PokemonType;
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
  return await generateEmbedPokemon(pokemonChoice, server);
}

export async function generateEmbedPokemon(
  pokemon: PokemonType,
  server: ServerType,
): Promise<{ embed: EmbedBuilder }> {
  const suffix = pokemon.isShiny ? "-shiny.png" : ".png";
  const imageName = pokemon.imgName + suffix;
  const subFolder = server.eventSpawn.nightMode ? "pokeHomeShadow" : "pokeHome";
  const imageUrl = await getImageUrl(subFolder, imageName);

  const color: ColorResolvable = colorByType(
    pokemon.arrayType[random(pokemon.arrayType.length)],
  );

  const pokeEmbed = new EmbedBuilder()
    .setColor(color)
    .setTitle(getText("embedPokemonTitle", server.settings.language))
    .setDescription(
      getText("embedPokemonDescription", server.settings.language),
    )
    .setImage(imageUrl);

  return { embed: pokeEmbed };
}

const sosRarityColor: Record<string, ColorResolvable> = {
  ordinary: 0x9e9e9e,
  legendary: 0xf1c40f,
  mythical: 0x9b59b6,
  ultraBeast: 0xe74c3c,
};

export async function generateEmbedSosPokemon(
  pokemon: PokemonType,
  server: ServerType,
): Promise<{ embed: EmbedBuilder }> {
  const suffix = pokemon.isShiny ? "-shiny.png" : ".png";
  const imageName = pokemon.imgName + suffix;
  const subFolder = server.eventSpawn.nightMode ? "pokeHomeShadow" : "pokeHome";
  const imageUrl = await getImageUrl(subFolder, imageName);

  const rarityKey = "sosEmbedTitle" + capitalizeFirstLetter(pokemon.rarity);
  const descKey = "sosEmbedDescription" + capitalizeFirstLetter(pokemon.rarity);
  const title = getText(rarityKey as LanguageKey, server.settings.language);
  const description = getText(descKey as LanguageKey, server.settings.language);
  const color: ColorResolvable =
    sosRarityColor[pokemon.rarity] ??
    colorByType(pokemon.arrayType[random(pokemon.arrayType.length)]);

  const chainLvl = pokemon.sosChainLvl ?? 1;
  const footerText =
    getText("sosEmbedFooter", server.settings.language) + " " + chainLvl;

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setImage(imageUrl)
    .setFooter({ text: footerText });

  return { embed };
}

async function generateEmbedEvent(
  event: EventType,
  server: ServerType,
): Promise<{ embed: EmbedBuilder }> {
  const imageName = event.image + ".png";
  const imageUrl = await getImageUrl("eventImage", imageName);

  const color: ColorResolvable = event.color as ColorResolvable;

  const eventEmbed = new EmbedBuilder()
    .setColor(color)
    .setTitle(getText(event.name, server.settings.language))
    .setDescription(getText(event.description, server.settings.language))
    .addFields({
      name: getText("effect", server.settings.language),
      value: event.effectDescription,
      inline: false,
    })
    .setImage(imageUrl);

  return { embed: eventEmbed };
}

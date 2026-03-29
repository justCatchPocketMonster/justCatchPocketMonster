import { UserType } from "../../core/types/UserType";
import { ServerType } from "../../core/types/ServerType";
import {
  BaseGuildTextChannel,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
} from "discord.js";
import { eventShinyAfterCatch } from "../event/eventShinyAfterCatch";
import language from "../../lang/language";
import { getStatById, updateStat } from "../../cache/StatCache";
import { nameStatGeneral, version } from "../../config/default/misc";
import { updateUser } from "../../cache/UserCache";
import { updateServer } from "../../cache/ServerCache";
import allPokemon from "../../data/json/pokemon.json";
import { newLogger } from "../../middlewares/logger";
import { Pokemon } from "../../core/classes/Pokemon";
import { Stat } from "../../core/classes/Stat";
import { selectSosPokemon } from "../pokemon/selectPokemon";
import { generateEmbedSosPokemon } from "../spawn/spawn";
import { random } from "../../utils/helperFunction";
import {
  isChannelInRaid,
  joinRaid,
  isRaidFull,
  resolveRaid,
  updateRaidEmbed,
} from "../raid/raidManager";
import {
  getSpawnMessageId,
  clearSpawnMessage,
  registerSpawnMessage,
} from "../spawn/spawnMessageRegistry";
import { pokemonDb } from "../../core/types/pokemonDb";

export async function catchPokemon(
  user: UserType,
  server: ServerType,
  idChannel: string,
  pokemonInput: string,
  interaction: ChatInputCommandInteraction,
) {
  const member = interaction.member as GuildMember;
  const memberDisplayName = member.nickname ?? member.displayName;
  const pokemon = server.getPokemonByIdChannel(idChannel);

  if (!pokemon) {
    await interaction.reply(
      language("noPokemonDisponible", server.settings.language),
    );
    return;
  }
  if (!pokemon.nameIsSame(pokemonInput)) {
    await interaction.reply(
      language("failCatchGoodPokemonPart1", server.settings.language) +
        " " +
        memberDisplayName +
        " " +
        language("failCatchGoodPokemonPart2", server.settings.language) +
        " " +
        pokemonInput +
        ".",
    );
    return;
  }

  if (interaction.guild && isChannelInRaid(interaction.guild.id, idChannel)) {
    await handleRaidCatch(interaction, server, memberDisplayName);
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  const serverId = interaction.guild!.id;
  const spawnMessageId = getSpawnMessageId(serverId, idChannel);
  clearSpawnMessage(serverId, idChannel);

  if (pokemon.isShiny === undefined) throw new Error("isShiny est undefined");
  pokemon.isShiny = eventShinyAfterCatch(interaction, pokemon.isShiny, server);

  const statVersion = await getStatById(version);
  const statAll = await getStatById(nameStatGeneral);

  statVersion.savePokemonCatch.addOneCatch(pokemon);
  statAll.savePokemonCatch.addOneCatch(pokemon);
  user.savePokemon.addOneCatch(pokemon);
  server.savePokemon.addOneCatch(pokemon);
  server.removePokemonByIdChannel(idChannel);

  if (pokemon.canSosBattle && random(2) === 1) {
    await handleSosBattle(
      server,
      pokemon,
      idChannel,
      serverId,
      interaction,
      statVersion,
      statAll,
    );
  }

  try {
    await updateUser(user.discordId, user);
    await updateServer(server.discordId, server);
    await updateStat(version, statVersion);
    await updateStat(nameStatGeneral, statAll);
  } catch (e) {
    newLogger(
      "error",
      e instanceof Error ? e.message : String(e),
      "Error updating caches after catching a Pokémon",
    );
  }

  const lang = server.settings.language;
  const pokemonDbData = allPokemon.find(
    (poke) =>
      poke.id.toString() === pokemon.id &&
      poke.form === pokemon.form &&
      poke.versionForm === pokemon.versionForm,
  );
  const pokemonName = resolvePokemonName(pokemonDbData, lang, pokemonInput);
  const formKey = `${pokemon.id}-${pokemon.form}-${pokemon.versionForm}`;
  const newTotal = user.savePokemon.data[formKey]?.normalCount ?? 0;

  await updateSpawnEmbed(spawnMessageId, interaction, idChannel, {
    lang,
    pokemonName,
    isShiny: pokemon.isShiny ?? false,
    memberDisplayName,
    newTotal,
  });
  const shinySuffix = pokemon.isShiny ? " \u2B50" : "";
  const congratsMsg =
    lang === "fr"
      ? `Félicitations ${memberDisplayName}, vous avez attrapé un ${pokemonName}${shinySuffix}.`
      : `Congratulations ${memberDisplayName}, you caught a ${pokemonName}${shinySuffix}!`;
  await interaction.editReply(congratsMsg);
}

interface SpawnEmbedUpdate {
  lang: string;
  pokemonName: string;
  isShiny: boolean;
  memberDisplayName: string;
  newTotal: number;
}

function resolvePokemonName(
  pokemonDbData: pokemonDb | undefined,
  lang: string,
  fallback: string,
): string {
  if (!pokemonDbData) return fallback;
  return lang === "fr"
    ? pokemonDbData.name.nameFr[0]
    : pokemonDbData.name.nameEng[0];
}

async function handleSosBattle(
  server: ServerType,
  pokemon: Pokemon,
  idChannel: string,
  serverId: string,
  interaction: ChatInputCommandInteraction,
  statVersion: Stat,
  statAll: Stat,
): Promise<void> {
  const nextChainLvl = (pokemon.sosChainLvl ?? 0) + 1;
  const sosPokemonType = selectSosPokemon(server, pokemon.id, nextChainLvl);
  const sosPokemon = Pokemon.from(sosPokemonType);
  server.pokemonPresent[idChannel] = sosPokemon;
  statVersion.addSpawn(sosPokemon);
  statAll.addSpawn(sosPokemon);
  try {
    await updateServer(server.discordId, server);
    await updateStat(version, statVersion);
    await updateStat(nameStatGeneral, statAll);
  } catch (e) {
    newLogger(
      "error",
      e instanceof Error ? e.message : String(e),
      "Error updating caches after SOS spawn",
    );
  }
  const { embed } = await generateEmbedSosPokemon(sosPokemonType, server);
  const channel = await interaction.client.channels.fetch(idChannel);
  if (
    !channel ||
    !channel.isTextBased() ||
    !(channel instanceof BaseGuildTextChannel)
  )
    return;
  const sosMessage = await channel.send({ embeds: [embed] });
  registerSpawnMessage(serverId, idChannel, sosMessage.id);
}

async function updateSpawnEmbed(
  spawnMessageId: string | undefined,
  interaction: ChatInputCommandInteraction,
  idChannel: string,
  { lang, pokemonName, isShiny, memberDisplayName, newTotal }: SpawnEmbedUpdate,
): Promise<void> {
  if (!spawnMessageId) return;
  try {
    const channel = await interaction.client.channels.fetch(idChannel);
    if (
      !channel ||
      !channel.isTextBased() ||
      !(channel instanceof BaseGuildTextChannel)
    )
      return;
    const spawnMessage = await channel.messages.fetch(spawnMessageId);
    const existingEmbed = spawnMessage.embeds[0];
    if (!existingEmbed) return;

    const nameForTitle = isShiny ? `${pokemonName} \u2B50` : pokemonName;
    const catchTitle =
      lang === "fr"
        ? `${nameForTitle} captur\u00E9 !`
        : `${nameForTitle} captured!`;
    const fieldName =
      lang === "fr"
        ? `Attrap\u00E9 par ${memberDisplayName} !`
        : `Caught by ${memberDisplayName}!`;
    const totalLabel =
      lang === "fr"
        ? `Vous en poss\u00E9dez maintenant : **${newTotal}**`
        : `You now own: **${newTotal}**`;

    const updatedEmbed = EmbedBuilder.from(existingEmbed)
      .setTitle(catchTitle)
      .setColor(0x57f287)
      .setFooter(null)
      .addFields({ name: fieldName, value: totalLabel, inline: false });
    await spawnMessage.edit({ embeds: [updatedEmbed] });
  } catch (e) {
    newLogger(
      "error",
      e instanceof Error ? e.message : String(e),
      "Error editing spawn message after catch",
    );
  }
}

async function handleRaidCatch(
  interaction: ChatInputCommandInteraction,
  server: ServerType,
  memberDisplayName: string,
): Promise<void> {
  const serverId = interaction.guild!.id;
  const { joined, raid } = joinRaid(serverId, interaction.user.id);

  if (!raid) {
    await interaction.reply(
      language("noPokemonDisponible", server.settings.language),
    );
    return;
  }

  if (!joined) {
    await interaction.reply(
      language("raidAlreadyJoined", server.settings.language),
    );
    return;
  }

  await interaction.reply(
    language("raidJoined", server.settings.language) +
      " " +
      memberDisplayName +
      ` (${raid.players.length}/4)`,
  );

  await updateRaidEmbed(interaction.client, serverId);

  if (isRaidFull(serverId)) {
    await resolveRaid(interaction.client, serverId);
  }
}

export function generateCatchMessage(
  pokemon: { name: { [key: string]: string[] }; isShiny?: boolean },
  memberDisplayName: string,
  user: UserType,
  server: ServerType,
): string {
  let message =
    language("congratYouCatchPart1", server.settings.language) +
    memberDisplayName +
    language("congratYouCatchPart2", server.settings.language) +
    (pokemon.name.nameFr[0] === pokemon.name.nameEng[0]
      ? pokemon.name.nameFr[0]
      : `${pokemon.name.nameFr[0]}/${pokemon.name.nameEng[0]}`);

  if (pokemon.isShiny) {
    message += ":star:. ";
  } else {
    message += ". ";
  }

  return message;
}

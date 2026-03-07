import { UserType } from "../../core/types/UserType";
import { ServerType } from "../../core/types/ServerType";
import { ChatInputCommandInteraction, GuildMember } from "discord.js";
import { eventShinyAfterCatch } from "../event/eventShinyAfterCatch";
import language from "../../lang/language";
import { getStatById, updateStat } from "../../cache/StatCache";
import { nameStatGeneral, version } from "../../config/default/misc";
import { updateUser } from "../../cache/UserCache";
import { updateServer } from "../../cache/ServerCache";
import allPokemon from "../../data/pokemon.json";
import { newLogger } from "../../middlewares/logger";
import { Pokemon } from "../../core/classes/Pokemon";
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

export async function catchPokemon(
  user: UserType,
  server: ServerType,
  idChannel: string,
  pokemonInput: string,
  interaction: ChatInputCommandInteraction,
) {
  const pokemon = server.getPokemonByIdChannel(idChannel);

  let memberDisplayName = "";
  const member = interaction.member as GuildMember;

  if (member.nickname != null) {
    memberDisplayName = member.nickname;
  } else {
    memberDisplayName = member.displayName;
  }

  if (!pokemon) {
    interaction.reply(
      language("noPokemonDisponible", server.settings.language),
    );
    return;
  }
  if (!pokemon.nameIsSame(pokemonInput)) {
    interaction.reply(
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

  const shinyAfterEvent = eventShinyAfterCatch(
    interaction,
    pokemon.isShiny ??
      (() => {
        throw new Error("isShiny est undefined");
      })(),
    server,
  );
  pokemon.isShiny = shinyAfterEvent;
  const statVersion = await getStatById(version);
  const statAll = await getStatById(nameStatGeneral);

  statVersion.savePokemonCatch.addOneCatch(pokemon);
  statAll.savePokemonCatch.addOneCatch(pokemon);
  user.savePokemon.addOneCatch(pokemon);
  server.savePokemon.addOneCatch(pokemon);

  server.removePokemonByIdChannel(idChannel);

  if (pokemon.canSosBattle && random(2) === 1) {
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
      newLogger("error", e as string, "Error updating caches after SOS spawn");
    }
    const { embed } = await generateEmbedSosPokemon(sosPokemonType, server);
    await interaction.followUp({
      embeds: [embed],
    });
  }

  try {
    await updateUser(user.discordId, user);
    await updateServer(server.discordId, server);
    await updateStat(version, statVersion);
    await updateStat(nameStatGeneral, statAll);
  } catch (e) {
    newLogger(
      "error",
      e as string,
      "Error updating caches after catching a Pokémon",
    );
  }

  const getPokemonData = allPokemon
    .filter(
      (poke) =>
        poke.id.toString() === pokemon.id &&
        poke.form === pokemon.form &&
        poke.versionForm === pokemon.versionForm,
    )
    .map((poke) => ({
      name: {
        nameFr: poke.name.nameFr,
        nameEng: poke.name.nameEng,
      },
      isShiny: pokemon.isShiny,
    }))[0];

  interaction.reply(
    generateCatchMessage(getPokemonData, memberDisplayName, user, server),
  );
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
    (pokemon.name.nameFr[0] !== pokemon.name.nameEng[0]
      ? `${pokemon.name.nameFr[0]}/${pokemon.name.nameEng[0]}`
      : pokemon.name.nameFr[0]);

  if (pokemon.isShiny) {
    message += ":star:. ";
  } else {
    message += ". ";
  }

  return message;
}

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
        "" +
        language("failCatchGoodPokemonPart2", server.settings.language) +
        " " +
        pokemonInput +
        ".",
    );
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

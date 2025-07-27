import { UserType } from "../../core/types/UserType";
import { ServerType } from "../../core/types/ServerType";
import { ChatInputCommandInteraction, GuildMember } from "discord.js";
import { eventShinyAfterCatch } from "../event/eventShinyAfterCatch";
import language from "../../lang/language";
import { getStatById, updateStat } from "../../cache/StatCache";
import {nameStatGeneral, version} from "../../config/default/misc";
import {updateUser} from "../../cache/UserCache";
import {updateServer} from "../../cache/ServerCache";

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
    interaction.reply(language("noPokemonDisponible", server.language));
    return;
  }
  if (!pokemon.nameIsSame(pokemonInput)) {
    interaction.reply(
      language("failCatchGoodPokemonPart1", server.language) +
        " " +
        memberDisplayName +
        "" +
        language("failCatchGoodPokemonPart2", server.language) +
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

  statVersion.addCatch(pokemon);
  statAll.addCatch(pokemon);


  user.savePokemon.addOneCatch(pokemon);
  server.savePokemon.addOneCatch(pokemon);

  server.removePokemonByIdChannel(idChannel);
  updateStat(version, statVersion);
  updateStat(nameStatGeneral, statAll);
  updateUser(user.discordId, user);
  updateServer(server.discordId, server);

  interaction.reply(generateCatchMessage(
      pokemon,
      memberDisplayName,
      server,
  ));
}

export function generateCatchMessage(
  pokemon: { name: { nameFr: string[]; nameEng: string[] }; isShiny?: boolean },
  memberDisplayName: string,
  server: ServerType,
): string {
  let message = language("congratYouCatchPart1", server.language) +
    memberDisplayName +
    language("congratYouCatchPart2", server.language) +
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
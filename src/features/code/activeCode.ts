import { UserType } from "../../core/types/UserType";
import { selectPokemon } from "../pokemon/selectPokemon";
import { Server } from "../../core/classes/Server";
import { updateUser } from "../../cache/UserCache";
import { updateServer } from "../../cache/ServerCache";
import { getStatById, updateStat } from "../../cache/StatCache";
import { generateCatchMessage } from "../catch/catch";
import { ChatInputCommandInteraction, GuildMember } from "discord.js";
import { ServerType } from "../../core/types/ServerType";
import { nameStatGeneral, version } from "../../config/default/misc";
import { newLogger } from "../../middlewares/logger";
import { Pokemon } from "../../core/classes/Pokemon";

export async function activeCode(
  interaction: ChatInputCommandInteraction,
  typeOfCode: string,
  user: UserType,
  server: ServerType,
): Promise<boolean> {
  switch (typeOfCode) {
    case "shiny":
      await activeCodeShiny(interaction, user, server);
      break;
  }
  await updateUser(user.discordId, user);
  return true;
}

async function activeCodeShiny(
  interaction: ChatInputCommandInteraction,
  user: UserType,
  server: ServerType,
): Promise<void> {
  const raw = selectPokemon(Server.createDefault("id"));
  raw.isShiny = true;
  const pokemon = Pokemon.from(raw);

  const member = interaction.member as GuildMember;
  const memberDisplayName = member.nickname ?? member.displayName;

  user.savePokemon.addOneCatch(pokemon);
  server.savePokemon.addOneCatch(pokemon);

  const statVersion = await getStatById(version);
  const statAll = await getStatById(nameStatGeneral);
  statVersion.addCatch(pokemon);
  statAll.addCatch(pokemon);

  try {
    await updateServer(server.discordId, server);
    await updateStat(version, statVersion);
    await updateStat(nameStatGeneral, statAll);
  } catch (e) {
    newLogger(
      "error",
      e instanceof Error ? e.message : String(e),
      "Error updating caches after code shiny reward",
    );
  }

  await interaction.reply(
    generateCatchMessage(pokemon, memberDisplayName, user, server),
  );
}

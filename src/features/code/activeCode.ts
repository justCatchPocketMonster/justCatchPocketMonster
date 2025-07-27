import {UserType} from "../../core/types/UserType";
import {selectPokemon} from "../pokemon/selectPokemon";
import {Server} from "../../core/classes/Server";
import {updateUser} from "../../cache/UserCache";
import {generateCatchMessage} from "../catch/catch";
import {ChatInputCommandInteraction, GuildMember} from "discord.js";
import {ServerType} from "../../core/types/ServerType";

export async function activeCode(interaction: ChatInputCommandInteraction, typeOfCode: string, user: UserType, server: ServerType): Promise<boolean> {
  switch (typeOfCode) {
    case "shiny":
      activeCodeShiny(interaction, user, server);
      break;
  }
  await updateUser(user.discordId, user);
  return true;
};


function activeCodeShiny(interaction: ChatInputCommandInteraction, user: UserType, server: ServerType): boolean {
  const pokemonChoiced = selectPokemon(Server.createDefault("id"))
  pokemonChoiced.isShiny = true;

  let memberDisplayName = "";
  const member = interaction.member as GuildMember;

  if (member.nickname != null) {
    memberDisplayName = member.nickname;
  } else {
    memberDisplayName = member.displayName;
  }

  user.savePokemon.addOneCatch(pokemonChoiced)
  interaction.reply(generateCatchMessage(
    pokemonChoiced,
    memberDisplayName,
    server
  ))

  return true;
}
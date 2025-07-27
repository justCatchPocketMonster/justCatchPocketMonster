import { ChatInputCommandInteraction } from "discord.js";
import language from "../../lang/language";
import { ServerType } from "../../core/types/ServerType";

export function eventShinyAfterCatch(
  interaction: ChatInputCommandInteraction,
  isShiny: boolean,
  server: ServerType,
) {
  let shinyEvent;
  let randomNumber;

  if (isShiny) {
    randomNumber = Math.floor(Math.random() * 10000);

    if (randomNumber == 1) {
      shinyEvent = !isShiny;
      interaction.reply(language("finallyHesNotShiny", server.language));
    } else {
      shinyEvent = isShiny;
    }
  } else {
    randomNumber = Math.floor(Math.random() * 4096);

    if (randomNumber == 1) {
      shinyEvent = !isShiny;
      interaction.reply(language("finallyHesShiny", server.language));
    } else {
      shinyEvent = isShiny;
    }
  }

  return shinyEvent;
}

import { ChatInputCommandInteraction } from "discord.js";
import language from "../../lang/language";
import { ServerType } from "../../core/types/ServerType";

export function eventShinyAfterCatch(
  interaction: ChatInputCommandInteraction,
  isShiny: boolean,
  server: ServerType,
) {
  let shinyEvent = isShiny;

  if (isShiny) {
    if (Math.random() < 1 / 10000) {
      shinyEvent = false;
      interaction.followUp(
        language("finallyHesNotShiny", server.settings.language),
      );
    }
  } else if (Math.random() < 1 / 4096) {
    shinyEvent = true;
    interaction.followUp(language("finallyHesShiny", server.settings.language));
  }

  return shinyEvent;
}

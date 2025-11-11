import { ServerType } from "../core/types/ServerType";
import { EmbedBuilder } from "discord.js";
import language from "../lang/language";

export function embedRequiredinformation(server: ServerType) {
  return new EmbedBuilder()
    .setColor("Red")
    .setTitle(language("mentionObligatoireTitle", server.settings.language))
    .setDescription(language("mentionObligatoireDesc", server.settings.language))
    .setFooter({ text: language("mentionObligatoireFooter", server.settings.language) })
    .addFields({
      name: language(
        "mentionObligatoireFieldNonAffiliationTitle",
        server.settings.language,
      ),
      value: language(
        "mentionObligatoireFieldNonAffiliationDesc",
        server.settings.language,
      ),
      inline: false,
    });
}

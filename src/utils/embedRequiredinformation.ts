import {ServerType} from "../core/types/ServerType";
import {EmbedBuilder} from "discord.js";
import language from "../lang/language";

export function embedRequiredinformation(server: ServerType) {
    return new EmbedBuilder()
      .setColor("Red")
      .setTitle(language("mentionObligatoireTitle", server.language))
      .setDescription(language("mentionObligatoireDesc", server.language))
      .setFooter({text: language("mentionObligatoireFooter", server.language)})
      .addFields({
          name: language(
              "mentionObligatoireFieldNonAffiliationTitle",
              server.language,
          ),
          value: language(
              "mentionObligatoireFieldNonAffiliationDesc",
              server.language,
          ),
          inline: false,
      });
}

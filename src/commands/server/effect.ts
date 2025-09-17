import { SlashCommandBuilder } from "@discordjs/builders";
import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  ColorResolvable,
  EmbedBuilder,
} from "discord.js";
import { newLogger } from "../../middlewares/logger";
import language from "../../lang/language";
import { getServerById } from "../../cache/ServerCache";
import { checkTimeForResetEventStat } from "../../features/event/checkTimeForResetEventStat";
import { effectEvent } from "../../features/event/effectEvent";

export default {
  name: "currentminievent",
  command: new SlashCommandBuilder()
    .setName("currentminievent")
    .setNameLocalizations({
      fr: "actuelminievent",
    })
    .setDescription(language("commandEffectEvent", "eng"))
    .setDescriptionLocalizations({
      fr: language("commandEffectEvent", "fr"),
    }),
  actif: true,
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      if (interaction.guildId === null) return;
      let server = await getServerById(interaction.guildId);
      await checkTimeForResetEventStat(server);

      effectEvent(interaction, server);
    } catch (e) {
      newLogger(
        "error",
        e as string,
        `Error in effect command for user ${interaction.user.id} in server ${interaction.guild?.id}`,
      );
      interaction.reply(language("errorCatch", "eng"));
    }
  },
};

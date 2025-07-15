import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, Interaction } from "discord.js";
import logger from "../../middlewares/error";
import language from "../../lang/language";
import createPaginationStat from "../../features/stat/stat";
import { getStatById } from "../../cache/StatCache";
import { version } from "../../config/default/misc";
import { getServerById } from "../../cache/ServerCache";

export default {
  name: "stat",
  command: new SlashCommandBuilder()
    .setName("stat")
    .setDescription(language("commandStatExplication", "eng"))
    .setDescriptionLocalizations({
      fr: language("commandStatExplication", "fr"),
    }),
  actif: true,
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      if (interaction.guildId === null) return;
      const statVersion = await getStatById(version);
      const statGeneral = await getStatById("general");
      const server = await getServerById(interaction.guildId);

      createPaginationStat(interaction, statVersion, statGeneral, server);
    } catch (e) {
      logger.error(e);
    }
  },
};

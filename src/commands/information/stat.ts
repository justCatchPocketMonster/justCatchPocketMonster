import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, Interaction } from "discord.js";
import logger, {newLogger} from "../../middlewares/logger";
import language from "../../lang/language";
import {createPaginationStat} from "../../features/stat/stat";
import { getStatById } from "../../cache/StatCache";
import {nameStatGeneral, version} from "../../config/default/misc";
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
      const statGeneral = await getStatById(nameStatGeneral);
      const server = await getServerById(interaction.guildId);

      createPaginationStat(interaction, statVersion, statGeneral, server);
    } catch (e) {
      newLogger(
          'error',
          e as string,
          `Error in stat command for user ${interaction.user.id} in server ${interaction.guild?.id}`,
      );
      interaction.reply(language("errorCatch", "eng"));
    }
  },
};

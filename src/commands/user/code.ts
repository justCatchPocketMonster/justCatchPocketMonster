import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import logger from "../../middlewares/error";

import { getUserById, updateUser } from "../../cache/UserCache";
import { codeType, activeCode } from "../../features/code/code";
import language from "../../lang/language";
import { getServerById } from "../../cache/ServerCache";

export default {
  name: "code",
  command: new SlashCommandBuilder()
    .setName("code")
    .setDescription(language("commandCodeExplication", "eng"))
    .setDescriptionLocalizations({
      fr: language("commandCodeExplication", "fr"),
    })
    .addStringOption(
      new SlashCommandStringOption()
        .setName(language("codeNameOptionString", "eng"))
        .setNameLocalizations({
          fr: language("codeNameOptionString", "fr"),
        })
        .setDescription(language("codeDescOptionString", "eng"))
        .setDescriptionLocalizations({
          fr: language("codeDescOptionString", "fr"),
        })
        .setRequired(true),
    ),
  actif: true,
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      // @ts-ignore
      let codeEntered = interaction.options
        .getString(language("codeNameOptionString", "eng"))
        .toLowerCase();
      if (interaction.guildId === null) return;
      let server = await getServerById(interaction.guildId);
      let typeCode = codeType(codeEntered);
      if (typeCode === null) {
        return interaction.reply({
          content: language("codeNotExist", server.language),
          ephemeral: true,
        });
      }

      let user = await getUserById(interaction.user.id);
      if (user.enteredCode.includes(codeEntered)) {
        return interaction.reply({
          content: language("codeAlreadyUsed", server.language),
          ephemeral: true,
        });
      }

      activeCode(typeCode);

      user.enteredCode.push(codeEntered);
      updateUser(user.id, user);
    } catch (e) {
      logger.error(e);
    }
  },
};

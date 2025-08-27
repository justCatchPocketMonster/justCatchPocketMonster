import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import { newLogger } from "../../middlewares/logger";

import { getUserById, updateUser } from "../../cache/UserCache";
import {
  codeType,
  activeCode,
  updateArrayCode,
} from "../../features/code/code";
import language from "../../lang/language";
import { getServerById } from "../../cache/ServerCache";
import { getStatById } from "../../cache/StatCache";
import { nameStatGeneral } from "../../config/default/misc";

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
      const stat = await getStatById(nameStatGeneral);

      updateArrayCode(stat);
      // @ts-ignore
      let codeEntered = interaction.options.getString(
        language("codeNameOptionString", "eng"),
      )!;
      if (interaction.guildId === null) return;
      let server = await getServerById(interaction.guildId);
      let typeCode = codeType(codeEntered);
      if (typeCode === null) {
        return interaction.reply({
          content: language("codeDontExist", server.language),
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

      await activeCode(interaction, typeCode, user, server);

      user.enteredCode.push(codeEntered);
      await updateUser(user.discordId, user);
    } catch (e) {
      newLogger(
        "error",
        e as string,
        `Error in code command for user ${interaction.user.id} in server ${interaction.guild?.id}`,
      );
      interaction.reply(language("errorCatch", "eng"));
    }
  },
};

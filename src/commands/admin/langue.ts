import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "@discordjs/builders";
import { PermissionFlagsBits, ChatInputCommandInteraction } from "discord.js";
import { newLogger } from "../../middlewares/logger";
import { getServerById, updateServer } from "../../cache/ServerCache";
import language from "../../lang/language";

export default {
  name: language("commandLangName", "eng"),
  command: new SlashCommandBuilder()
    .setName(language("commandLangName", "eng"))
    .setNameLocalizations({
      fr: language("commandLangName", "fr"),
    })
    .setDescription(language("commandLangExplication", "eng"))
    .setDescriptionLocalizations({
      fr: language("commandLangExplication", "fr"),
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(
      new SlashCommandStringOption()
        .setName(language("langNameOptionString", "eng"))
        .setNameLocalizations({
          fr: language("langNameOptionString", "fr"),
        })
        .setDescription(language("langDescOptionString", "eng"))
        .setDescriptionLocalizations({
          fr: language("langDescOptionString", "fr"),
        })
        .addChoices(
          { name: "English", value: "eng" },
          { name: "Français", value: "fr" },
        )
        .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  actif: true,
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      if (!interaction.guildId) {
        return;
      }
      let server = await getServerById(interaction.guildId);

      const langOption = interaction.options.getString(
        language("langNameOptionString", "eng"),
      );

      if (!langOption) {
        interaction.reply({
          content: language("langErrorNoOption", server.settings.language),
        });
        return;
      }

      server.settings.language = langOption.toLowerCase() ?? "eng";
      interaction.reply({
        content: language("langIsChanged", server.settings.language),
      });
      await updateServer(server.discordId, server);
    } catch (e) {
      newLogger(
        "error",
        e as string,
        `Error in langue command for user ${interaction.user.id} in server ${interaction.guild?.id}`,
      );
      interaction.reply(language("errorCatch", "eng"));
    }
  },
};

import { ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import language from "../../lang/language";
import { SlashCommandBuilder } from "@discordjs/builders";
import { newLogger } from "../../middlewares/logger";
import { getServerById } from "../../cache/ServerCache";
import { adminSettings } from "../../features/adminSettings/adminSettings";

export default {
  name: "adminsettings",
  command: new SlashCommandBuilder()
    .setName(language("commandAdminSettingsName", "eng"))
    .setNameLocalizations({
      fr: language("commandAdminSettingsName", "fr"),
    })
    .setDescription(language("commandAdminSettingsExplication", "eng"))
    .setDescriptionLocalizations({
      fr: language("commandAdminSettingsExplication", "fr"),
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  actif: true,
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      if (!interaction.guildId) {
        return;
      }
      let server = await getServerById(interaction.guildId);
      await adminSettings(interaction, server);
    } catch (e) {
      newLogger(
        "error",
        e as string,
        `Error in adminSettings command for user ${interaction.user.id} in server ${interaction.guild?.id}`,
      );
      interaction.reply(language("errorCatch", "eng"));
    }
  },
};

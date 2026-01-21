import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import { newLogger } from "../../middlewares/logger";
import language from "../../lang/language";
import { initiateTrade } from "../../features/trade/trade";
import { getUserById } from "../../cache/UserCache";
import { getServerById } from "../../cache/ServerCache";

export default {
  name: "trade",
  command: new SlashCommandBuilder()
    .setName("trade")
    .setDescription(language("commandTradeExplication", "eng"))
    .setDescriptionLocalizations({
      fr: language("commandTradeExplication", "fr"),
    })
    .addUserOption(
      new SlashCommandUserOption()
        .setName(language("commandTradeOptionUser", "eng"))
        .setNameLocalizations({
          fr: language("commandTradeOptionUser", "fr"),
        })
        .setDescription(language("commandTradeOptionUserDesc", "eng"))
        .setDescriptionLocalizations({
          fr: language("commandTradeOptionUserDesc", "fr"),
        })
        .setRequired(true),
    ),
  actif: true,
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      if (!interaction.guild) {
        await interaction.reply({
          content: language("tradeGuildRequired", "eng"),
          ephemeral: true,
        });
        return;
      }

      const targetUser = interaction.options.getUser(
        language("commandTradeOptionUser", "eng"),
        true,
      );

      // Check if trading with self
      if (targetUser.id === interaction.user.id) {
        await interaction.reply({
          content: language("tradeCannotTradeWithSelf", interaction.guild.preferredLocale || "eng"),
          ephemeral: true,
        });
        return;
      }

      // Check if target is a bot
      if (targetUser.bot) {
        await interaction.reply({
          content: language("tradeCannotTradeWithBot", interaction.guild.preferredLocale || "eng"),
          ephemeral: true,
        });
        return;
      }

      const initiator = await getUserById(interaction.user.id);
      const target = await getUserById(targetUser.id);
      const server = await getServerById(interaction.guild.id);

      if (!server) {
        await interaction.reply({
          content: language("tradeServerNotFound", interaction.guild.preferredLocale || "eng"),
          ephemeral: true,
        });
        return;
      }

      const result = await initiateTrade(
        interaction.client,
        initiator,
        target,
        targetUser,
        server,
      );

      if (result.success) {
        await interaction.reply({
          content: result.message || language("tradeRequestSentSuccess", server.settings.language),
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: result.message || language("tradeError", server.settings.language),
          ephemeral: true,
        });
      }
    } catch (e) {
      newLogger(
        "error",
        e as string,
        `Error in trade command for user ${interaction.user.id} in server ${interaction.guild?.id}`,
      );
      await interaction.reply({
        content: language("tradeError", "eng"),
        ephemeral: true,
      });
    }
  },
};

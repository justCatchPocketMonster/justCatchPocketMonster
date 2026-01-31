import {
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { TradeData, updateTrade, extractId } from "./tradeCache";
import { createTradeSummaryEmbed } from "./tradeUtils";
import type { ServerType } from "../../core/types/ServerType";
import language from "../../lang/language";
import { newLogger } from "../../middlewares/logger";

export async function sendConfirmationEmbeds(
  trade: TradeData,
  server: ServerType,
  client: Client,
): Promise<void> {
  try {
    const initiatorId = extractId(trade.initiatorId);
    const targetId = extractId(trade.targetId);
    const initiatorUser = await client.users.fetch(initiatorId);
    const targetUser = await client.users.fetch(targetId);

    if (!initiatorUser || !targetUser) return;

    const initiatorName = initiatorUser.username;
    const targetName = targetUser.username;
    const lang = server.settings.language;

    const initiatorEmbed = createTradeSummaryEmbed(
      trade,
      server,
      true,
      initiatorName,
      targetName,
    );
    const targetEmbed = createTradeSummaryEmbed(
      trade,
      server,
      false,
      initiatorName,
      targetName,
    );

    const confirmedText = language("tradeCompleted", lang);
    const waitingText = language("tradeWaitingOther", lang);
    const initiatorStatus = trade.initiatorConfirmed
      ? `✅ ${confirmedText}`
      : `⏳ ${waitingText}`;
    const targetStatus = trade.targetConfirmed
      ? `✅ ${confirmedText}`
      : `⏳ ${waitingText}`;
    const statusTitle = language("tradeSummaryTitle", lang);
    const statusValue = `${initiatorName}: ${initiatorStatus}\n${targetName}: ${targetStatus}`;

    initiatorEmbed.addFields({ name: statusTitle, value: statusValue });
    targetEmbed.addFields({ name: statusTitle, value: statusValue });

    const createButtons = (isConfirmed: boolean) => {
      const confirmButton = new ButtonBuilder()
        .setCustomId(`trade_confirm_${trade.tradeId}`)
        .setLabel(language("tradeConfirmButton", lang))
        .setStyle(ButtonStyle.Success)
        .setEmoji("✅")
        .setDisabled(isConfirmed);

      const cancelButton = new ButtonBuilder()
        .setCustomId(`trade_cancel_${trade.tradeId}`)
        .setLabel(language("tradeCancelButton", lang))
        .setStyle(ButtonStyle.Danger)
        .setEmoji("❌")
        .setDisabled(isConfirmed);

      return new ActionRowBuilder<ButtonBuilder>().addComponents(
        confirmButton,
        cancelButton,
      );
    };

    const initiatorRow = createButtons(trade.initiatorConfirmed || false);
    const targetRow = createButtons(trade.targetConfirmed || false);

    const hasExistingMessages =
      trade.initiatorConfirmationMessageId && trade.targetConfirmationMessageId;

    if (hasExistingMessages) {
      try {
        const initiatorDM = await initiatorUser.createDM();
        const initiatorMessage = await initiatorDM.messages.fetch(
          trade.initiatorConfirmationMessageId!,
        );
        await initiatorMessage.edit({
          embeds: [initiatorEmbed],
          components: [initiatorRow],
        });
      } catch (error) {
        newLogger(
          "error",
          error as string,
          "Failed to edit confirmation for initiator",
        );
      }

      try {
        const targetDM = await targetUser.createDM();
        const targetMessage = await targetDM.messages.fetch(
          trade.targetConfirmationMessageId!,
        );
        await targetMessage.edit({
          embeds: [targetEmbed],
          components: [targetRow],
        });
      } catch (error) {
        newLogger(
          "error",
          error as string,
          "Failed to edit confirmation for target",
        );
      }
    } else {
      let initiatorMessageId: string | undefined;
      let targetMessageId: string | undefined;

      try {
        const initiatorDM = await initiatorUser.createDM();
        const initiatorMessage = await initiatorDM.send({
          embeds: [initiatorEmbed],
          components: [initiatorRow],
        });
        initiatorMessageId = initiatorMessage.id;
      } catch (error) {
        newLogger(
          "error",
          error as string,
          "Failed to send confirmation to initiator",
        );
      }

      try {
        const targetDM = await targetUser.createDM();
        const targetMessage = await targetDM.send({
          embeds: [targetEmbed],
          components: [targetRow],
        });
        targetMessageId = targetMessage.id;
      } catch (error) {
        newLogger(
          "error",
          error as string,
          "Failed to send confirmation to target",
        );
      }

      if (initiatorMessageId && targetMessageId) {
        updateTrade(trade.tradeId, {
          initiatorConfirmationMessageId: initiatorMessageId,
          targetConfirmationMessageId: targetMessageId,
        });
      }
    }
  } catch (error) {
    newLogger("error", error as string, "Error sending confirmation embeds");
  }
}

import {
  Client,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { TradeData, updateTrade, extractId } from "./tradeCache";
import { createTradeSummaryEmbed } from "./tradeUtils";
import type { ServerType } from "../../core/types/ServerType";
import language from "../../lang/language";
import { newLogger } from "../../middlewares/logger";
import type { EmbedBuilder, User } from "discord.js";

async function editConfirmationForUser(
  user: User,
  messageId: string,
  embed: EmbedBuilder,
  row: ActionRowBuilder<ButtonBuilder>,
  logContext: string,
): Promise<void> {
  try {
    const dm = await user.createDM();
    const message = await dm.messages.fetch(messageId);
    await message.edit({ embeds: [embed], components: [row] });
  } catch (error) {
    newLogger(
      "error",
      error instanceof Error ? error.message : String(error),
      logContext,
    );
  }
}

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

    const initiatorRow = createButtons(trade.initiatorConfirmed ?? false);
    const targetRow = createButtons(trade.targetConfirmed ?? false);

    const hasExistingMessages =
      trade.initiatorConfirmationMessageId && trade.targetConfirmationMessageId;

    if (hasExistingMessages) {
      await editConfirmationForUser(
        initiatorUser,
        trade.initiatorConfirmationMessageId!,
        initiatorEmbed,
        initiatorRow,
        "Failed to edit confirmation for initiator",
      );
      await editConfirmationForUser(
        targetUser,
        trade.targetConfirmationMessageId!,
        targetEmbed,
        targetRow,
        "Failed to edit confirmation for target",
      );
    } else {
      const [initiatorMessageId, targetMessageId] = await Promise.all([
        sendConfirmationToUser(
          initiatorUser,
          initiatorEmbed,
          initiatorRow,
          "Failed to send confirmation to initiator",
        ),
        sendConfirmationToUser(
          targetUser,
          targetEmbed,
          targetRow,
          "Failed to send confirmation to target",
        ),
      ]);

      if (initiatorMessageId && targetMessageId) {
        updateTrade(trade.tradeId, {
          initiatorConfirmationMessageId: initiatorMessageId,
          targetConfirmationMessageId: targetMessageId,
        });
      }
    }
  } catch (error) {
    newLogger(
      "error",
      error instanceof Error ? error.message : String(error),
      "Error sending confirmation embeds",
    );
  }
}

async function sendConfirmationToUser(
  user: User,
  embed: EmbedBuilder,
  row: ActionRowBuilder<ButtonBuilder>,
  logContext: string,
): Promise<string | undefined> {
  try {
    const dm = await user.createDM();
    const message = await dm.send({
      embeds: [embed],
      components: [row],
    });
    return message.id;
  } catch (error) {
    newLogger(
      "error",
      error instanceof Error ? error.message : String(error),
      logContext,
    );
    return undefined;
  }
}

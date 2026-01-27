import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { TradeData } from "./tradeCache";
import { createTradeSummaryEmbed } from "./tradeUtils";
import { getUserById } from "../../cache/UserCache";
import language from "../../lang/language";
import { newLogger } from "../../middlewares/logger";

export async function sendConfirmationEmbeds(
  trade: TradeData,
  server: any,
  client: any,
): Promise<void> {
  try {
    const initiator = await getUserById(trade.initiatorId);
    const target = await getUserById(trade.targetId);
    const initiatorUser = await client.users.fetch(trade.initiatorId);
    const targetUser = await client.users.fetch(trade.targetId);

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

      return new ActionRowBuilder<ButtonBuilder>().addComponents(confirmButton, cancelButton);
    };

    try {
      const initiatorDM = await initiatorUser.createDM();
      await initiatorDM.send({
        embeds: [initiatorEmbed],
        components: [createButtons(trade.initiatorConfirmed || false)],
      });
    } catch (error) {
      newLogger("error", error as string, "Failed to send confirmation to initiator");
    }

    try {
      const targetDM = await targetUser.createDM();
      await targetDM.send({
        embeds: [targetEmbed],
        components: [createButtons(trade.targetConfirmed || false)],
      });
    } catch (error) {
      newLogger("error", error as string, "Failed to send confirmation to target");
    }
  } catch (error) {
    newLogger("error", error as string, "Error sending confirmation embeds");
  }
}

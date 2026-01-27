import { Client, User as DiscordUser } from "discord.js";
import { UserType } from "../../core/types/UserType";
import { ServerType } from "../../core/types/ServerType";
import {
  createTrade,
  getTrade,
  getTradeBlock,
  getUserActiveTrade,
  updateTrade,
  deleteTrade,
  TradeData,
} from "./tradeCache";
import { createEmbedAsk } from "./tradeUtils";
import {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder,
} from "discord.js";
import language from "../../lang/language";
import { newLogger } from "../../middlewares/logger";

const TRADE_TIMEOUT_MS = 300000;

export async function initiateTrade(
  client: Client,
  initiator: UserType,
  target: UserType,
  targetDiscordUser: DiscordUser,
  server: ServerType,
): Promise<{ success: boolean; message?: string }> {
  try {
    const initiatorActiveTrade = getUserActiveTrade(initiator.discordId);
    if (
      initiatorActiveTrade &&
      initiatorActiveTrade.status !== "completed" &&
      initiatorActiveTrade.status !== "cancelled"
    ) {
      return {
        success: false,
        message: language(
          "tradeInitiatorHasActiveTrade",
          server.settings.language,
        ),
      };
    }

    const targetActiveTrade = getUserActiveTrade(target.discordId);
    if (
      targetActiveTrade &&
      targetActiveTrade.status !== "completed" &&
      targetActiveTrade.status !== "cancelled"
    ) {
      return {
        success: false,
        message: language(
          "tradeTargetHasActiveTrade",
          server.settings.language,
        ),
      };
    }

    const block = getTradeBlock(target.discordId);
    if (block && block.expiresAt > Date.now()) {
      return {
        success: false,
        message: language("tradeTargetBlocked", server.settings.language),
      };
    }

    const tradeId = `trade_${initiator.discordId}_${target.discordId}_${Date.now()}`;
    const expiresAt = Date.now() + TRADE_TIMEOUT_MS;

    const tradeData: TradeData = {
      tradeId,
      initiatorId: initiator.discordId,
      targetId: target.discordId,
      serverId: server.discordId,
      status: "pending",
      createdAt: Date.now(),
      expiresAt,
    };

    createTrade(tradeData);

    try {
      const initiatorDiscordUser = await client.users.fetch(
        initiator.discordId,
      );
      const initiatorDM = await initiatorDiscordUser.createDM();
      const initiatorEmbed = createEmbedAsk(
        tradeData,
        server,
        true,
        initiatorDiscordUser.username,
        targetDiscordUser.username,
      );
      const initiatorMessage = await initiatorDM.send({
        embeds: [initiatorEmbed],
      });
      updateTrade(tradeId, { initiatorMessageId: initiatorMessage.id });
    } catch (error) {
      newLogger("error", error as string, `Failed to send DM to initiator`);
    }

    try {
      const targetDM = await targetDiscordUser.createDM();
      const initiatorName = (await client.users.fetch(initiator.discordId))
        .username;
      const targetEmbed = createEmbedAsk(
        tradeData,
        server,
        false,
        initiatorName,
        targetDiscordUser.username,
      );

      const acceptButton = new ButtonBuilder()
        .setCustomId(`trade_accept_${tradeId}`)
        .setLabel(language("tradeAcceptButton", server.settings.language))
        .setStyle(ButtonStyle.Success)
        .setEmoji("✅");

      const refuseButton = new ButtonBuilder()
        .setCustomId(`trade_refuse_${tradeId}`)
        .setLabel(language("tradeRefuseButton", server.settings.language))
        .setStyle(ButtonStyle.Danger)
        .setEmoji("❌");

      const refuseWeekButton = new ButtonBuilder()
        .setCustomId(`trade_refuse_week_${tradeId}`)
        .setLabel(language("tradeRefuseWeekButton", server.settings.language))
        .setStyle(ButtonStyle.Danger)
        .setEmoji("🚫");

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        acceptButton,
        refuseButton,
        refuseWeekButton,
      );

      const targetMessage = await targetDM.send({
        embeds: [targetEmbed],
        components: [row],
      });
      updateTrade(tradeId, { targetMessageId: targetMessage.id });

      const timeoutCollector = targetMessage.createMessageComponentCollector({
        time: TRADE_TIMEOUT_MS,
      });

      timeoutCollector.on("end", async (collected, reason) => {
        if (reason === "time") {
          const trade = getTrade(tradeId);
          if (trade && trade.status === "pending") {
            updateTrade(tradeId, { status: "cancelled" });

            const timeoutEmbed = new EmbedBuilder()
              .setTitle(language("tradeTimeoutTitle", server.settings.language))
              .setDescription(
                language("tradeTimeoutDesc", server.settings.language),
              )
              .setColor(0xe74c3c);

            try {
              await targetMessage.edit({
                embeds: [timeoutEmbed],
                components: [],
              });
              const initiatorUser = await client.users.fetch(
                initiator.discordId,
              );
              const initiatorDM = await initiatorUser.createDM();
              await initiatorDM.send({ embeds: [timeoutEmbed] });
            } catch (error) {
              // DM might be disabled
            }

            deleteTrade(tradeId);
          }
        }
      });

      return {
        success: true,
        message: language("tradeRequestSentSuccess", server.settings.language),
      };
    } catch (error) {
      newLogger("error", error as string, `Failed to send DM to target`);
      deleteTrade(tradeId);
      return {
        success: false,
        message: language("tradeFailedToSendDM", server.settings.language),
      };
    }
  } catch (error) {
    newLogger("error", error as string, "Error initiating trade");
    return {
      success: false,
      message: language("tradeError", server.settings.language),
    };
  }
}

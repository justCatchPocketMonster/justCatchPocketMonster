import { ButtonInteraction, EmbedBuilder } from "discord.js";
import {
  getTrade,
  updateTrade,
  deleteTrade,
  setTradeBlock,
  TradeData,
} from "./tradeCache";
import { executeTrade } from "./tradeValidation";
import { getEligiblePokemon } from "./tradeUtils";
import { getUserById } from "../../cache/UserCache";
import { getServerById } from "../../cache/ServerCache";
import language from "../../lang/language";
import { newLogger } from "../../middlewares/logger";
import { sendTradeMenuToUser } from "./tradeMenuHandler";
import { createTradeCompletedEmbed } from "./tradeEmbeds";
import { sendConfirmationEmbeds } from "./tradeConfirmation";

function extractDiscordId(value: string | { discordId: string } | unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "discordId" in value) {
    return String((value as { discordId: unknown }).discordId);
  }
  return String(value);
}

export async function handleTradeAccept(
  buttonInteraction: ButtonInteraction,
  tradeId: string,
): Promise<void> {
  try {
    await buttonInteraction.deferUpdate();
    const trade = getTrade(tradeId);
    if (!trade) {
      await buttonInteraction.followUp({
        content: language("tradeNotFound", "eng"),
        ephemeral: true,
      });
      return;
    }

    const initiatorId = extractDiscordId(trade.initiatorId);
    const targetId = extractDiscordId(trade.targetId);

    if (buttonInteraction.user.id !== targetId) {
      await buttonInteraction.followUp({
        content: language("tradeNotAuthorized", "eng"),
        ephemeral: true,
      });
      return;
    }

    if (trade.status !== "pending") {
      await buttonInteraction.followUp({
        content: language("tradeInvalidStatus", "eng"),
        ephemeral: true,
      });
      return;
    }

    updateTrade(tradeId, { status: "accepted" });

    const initiator = await getUserById(initiatorId);
    const target = await getUserById(targetId);
    const serverId = extractDiscordId(trade.serverId);

    if (!serverId) {
      await buttonInteraction.followUp({
        content: language("tradeError", "eng"),
        ephemeral: true,
      });
      return;
    }

    const server = await getServerById(serverId);
    if (!server) return;

    const initiatorEligible = getEligiblePokemon(initiator);
    const targetEligible = getEligiblePokemon(target);

    if (initiatorEligible.length === 0 || targetEligible.length === 0) {
      const client = buttonInteraction.client;
      const initiatorUser = await client.users.fetch(initiatorId);
      const targetUser = await client.users.fetch(targetId);
      const initiatorName = initiatorUser.username;
      const targetName = targetUser.username;

      let errorMessage: string;
      if (initiatorEligible.length === 0 && targetEligible.length === 0) {
        errorMessage = language("tradeNoValidPokemonBoth", server.settings.language)
          .replace("{initiator}", initiatorName)
          .replace("{target}", targetName);
      } else if (initiatorEligible.length === 0) {
        errorMessage = language("tradeNoValidPokemon", server.settings.language).replace(
          "{user}",
          initiatorName,
        );
      } else {
        errorMessage = language("tradeNoValidPokemon", server.settings.language).replace(
          "{user}",
          targetName,
        );
      }

      const errorEmbed = new EmbedBuilder()
        .setTitle(language("tradeImpossible", server.settings.language))
        .setDescription(errorMessage)
        .setColor(0xe74c3c);

      try {
        if (trade.initiatorMessageId) {
          const initiatorDM = await initiatorUser.createDM();
          const initiatorMessage = await initiatorDM.messages.fetch(trade.initiatorMessageId);
          await initiatorMessage.edit({ embeds: [errorEmbed], components: [] });
        }
      } catch (error) {
        newLogger("error", error as string, "Failed to update initiator message");
      }

      try {
        if (trade.targetMessageId) {
          const targetDM = await targetUser.createDM();
          const targetMessage = await targetDM.messages.fetch(trade.targetMessageId);
          await targetMessage.edit({ embeds: [errorEmbed], components: [] });
        }
      } catch (error) {
        newLogger("error", error as string, "Failed to update target message");
      }

      await buttonInteraction.editReply({ embeds: [errorEmbed], components: [] });
      updateTrade(tradeId, { status: "cancelled" });
      deleteTrade(tradeId);
      return;
    }

    await sendTradeMenuToUser(
      buttonInteraction.client,
      initiatorId,
      tradeId,
      initiator,
      server,
    );
    await sendTradeMenuToUser(
      buttonInteraction.client,
      targetId,
      tradeId,
      target,
      server,
    );

    const updatedEmbed = new EmbedBuilder()
      .setTitle(language("tradeAccepted", server.settings.language))
      .setDescription(language("tradeAcceptedDesc", server.settings.language))
      .setColor(0x2ecc71);

    await buttonInteraction.editReply({ embeds: [updatedEmbed], components: [] });
  } catch (error: any) {
    newLogger("error", error as string, "Error handling trade accept");
  }
}

export async function handleTradeRefuse(
  buttonInteraction: ButtonInteraction,
  tradeId: string,
): Promise<void> {
  try {
    await buttonInteraction.deferUpdate();
    const trade = getTrade(tradeId);
    if (!trade || buttonInteraction.user.id !== trade.targetId) return;

    updateTrade(tradeId, { status: "cancelled" });

    const serverId = extractDiscordId(trade.serverId);
    if (!serverId) return;
    const server = await getServerById(serverId);
    if (!server) return;

    const embed = new EmbedBuilder()
      .setTitle(language("tradeRefused", server.settings.language))
      .setDescription(language("tradeRefusedDesc", server.settings.language))
      .setColor(0xe74c3c);

    await buttonInteraction.editReply({ embeds: [embed], components: [] });

    try {
      const initiatorUser = await buttonInteraction.client.users.fetch(trade.initiatorId);
      const initiatorDM = await initiatorUser.createDM();
      await initiatorDM.send({ embeds: [embed] });
    } catch (error) {
      // DM might be disabled
    }

    deleteTrade(tradeId);
  } catch (error) {
    newLogger("error", error as string, "Error handling trade refuse");
  }
}

export async function handleTradeRefuseWeek(
  buttonInteraction: ButtonInteraction,
  tradeId: string,
): Promise<void> {
  try {
    await buttonInteraction.deferUpdate();
    const trade = getTrade(tradeId);
    if (!trade || buttonInteraction.user.id !== trade.targetId) return;

    setTradeBlock(trade.targetId, Date.now() + 604800000);
    updateTrade(tradeId, { status: "cancelled" });

    const serverId = extractDiscordId(trade.serverId);
    if (!serverId) return;
    const server = await getServerById(serverId);
    if (!server) return;

    const embed = new EmbedBuilder()
      .setTitle(language("tradeRefusedWeek", server.settings.language))
      .setDescription(language("tradeRefusedWeekDesc", server.settings.language))
      .setColor(0xe74c3c);

    await buttonInteraction.editReply({ embeds: [embed], components: [] });

    try {
      const initiatorUser = await buttonInteraction.client.users.fetch(trade.initiatorId);
      const initiatorDM = await initiatorUser.createDM();
      await initiatorDM.send({ embeds: [embed] });
    } catch (error) {
      // DM might be disabled
    }

    deleteTrade(tradeId);
  } catch (error) {
    newLogger("error", error as string, "Error handling trade refuse week");
  }
}

export async function handleTradeConfirm(
  buttonInteraction: ButtonInteraction,
  tradeId: string,
): Promise<void> {
  try {
    await buttonInteraction.deferUpdate();
    const trade = getTrade(tradeId);
    if (!trade) {
      await buttonInteraction.followUp({
        content: language("tradeNotFound", "eng"),
        ephemeral: true,
      });
      return;
    }

    if (
      buttonInteraction.user.id !== trade.initiatorId &&
      buttonInteraction.user.id !== trade.targetId
    ) {
      return;
    }

    if (trade.status !== "confirming" || !trade.initiatorChoice || !trade.targetChoice) {
      return;
    }

    const serverId = extractDiscordId(trade.serverId);
    if (!serverId) return;
    const server = await getServerById(serverId);
    if (!server) return;

    const isInitiator = buttonInteraction.user.id === trade.initiatorId;
    updateTrade(tradeId, {
      [isInitiator ? "initiatorConfirmed" : "targetConfirmed"]: true,
    });

    const updatedTrade = getTrade(tradeId);
    if (!updatedTrade) return;

    const bothConfirmed = updatedTrade.initiatorConfirmed && updatedTrade.targetConfirmed;

    if (bothConfirmed) {
      const success = await executeTrade(updatedTrade);

      if (success) {
        updateTrade(tradeId, { status: "completed" });

        const updatedInitiator = await getUserById(updatedTrade.initiatorId);
        const updatedTarget = await getUserById(updatedTrade.targetId);

        if (!updatedInitiator || !updatedTarget) {
          const errorEmbed = new EmbedBuilder()
            .setTitle(language("tradeFailed", server.settings.language))
            .setDescription(language("tradeFailedDesc", server.settings.language))
            .setColor(0xe74c3c);
          await buttonInteraction.editReply({ embeds: [errorEmbed], components: [] });
          return;
        }

        const initiatorUser = await buttonInteraction.client.users.fetch(
          updatedTrade.initiatorId,
        );
        const targetUser = await buttonInteraction.client.users.fetch(updatedTrade.targetId);
        const initiatorName = initiatorUser.username;
        const targetName = targetUser.username;

        const initiatorEmbed = createTradeCompletedEmbed(
          updatedTrade,
          server,
          true,
          initiatorName,
          targetName,
          updatedInitiator,
        );
        const targetEmbed = createTradeCompletedEmbed(
          updatedTrade,
          server,
          false,
          initiatorName,
          targetName,
          updatedTarget,
        );

        const userEmbed = isInitiator ? initiatorEmbed : targetEmbed;
        await buttonInteraction.editReply({ embeds: [userEmbed], components: [] });

        try {
          const otherUserId = isInitiator ? updatedTrade.targetId : updatedTrade.initiatorId;
          const otherEmbed = isInitiator ? targetEmbed : initiatorEmbed;
          const otherUser = await buttonInteraction.client.users.fetch(otherUserId);
          const otherDM = await otherUser.createDM();
          await otherDM.send({ embeds: [otherEmbed] });
        } catch (error) {
          // DM might be disabled
        }

        deleteTrade(tradeId);
      } else {
        const errorEmbed = new EmbedBuilder()
          .setTitle(language("tradeFailed", server.settings.language))
          .setDescription(language("tradeFailedDesc", server.settings.language))
          .setColor(0xe74c3c);

        await buttonInteraction.editReply({ embeds: [errorEmbed], components: [] });

        updateTrade(tradeId, {
          status: "accepted",
          initiatorChoice: undefined,
          targetChoice: undefined,
          initiatorConfirmed: false,
          targetConfirmed: false,
        });
      }
    } else {
      await sendConfirmationEmbeds(updatedTrade, server, buttonInteraction.client);
    }
  } catch (error) {
    newLogger("error", error as string, "Error handling trade confirm");
  }
}

export async function handleTradeCancel(
  buttonInteraction: ButtonInteraction,
  tradeId: string,
): Promise<void> {
  try {
    await buttonInteraction.deferUpdate();
    const trade = getTrade(tradeId);
    if (
      !trade ||
      (buttonInteraction.user.id !== trade.initiatorId &&
        buttonInteraction.user.id !== trade.targetId)
    ) {
      return;
    }

    updateTrade(tradeId, {
      status: "accepted",
      initiatorChoice: undefined,
      targetChoice: undefined,
    });

    const serverId = extractDiscordId(trade.serverId);
    if (!serverId) return;
    const server = await getServerById(serverId);
    if (!server) return;

    await buttonInteraction.followUp({
      content: language("tradeCancelledReturningToSelection", server.settings.language),
      ephemeral: true,
    });

    const initiator = await getUserById(trade.initiatorId);
    const target = await getUserById(trade.targetId);
    const client = buttonInteraction.client;

    await sendTradeMenuToUser(client, trade.initiatorId, tradeId, initiator, server);
    await sendTradeMenuToUser(client, trade.targetId, tradeId, target, server);
  } catch (error) {
    newLogger("error", error as string, "Error handling trade cancel");
  }
}

import {
  ButtonInteraction,
  Message,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuInteraction,
  ComponentType,
  StringSelectMenuBuilder,
} from "discord.js";
import {
  getTrade,
  updateTrade,
  deleteTrade,
  setTradeBlock,
  TradeData,
  PokemonChoice,
} from "./tradeCache";
import { createTradeSummaryEmbed } from "./tradeUtils";
import { executeTrade, getRarityCooldownMs } from "./tradeValidation";
import { getUserById } from "../../cache/UserCache";
import { getServerById } from "../../cache/ServerCache";
import language from "../../lang/language";
import { newLogger } from "../../middlewares/logger";
import { regenerateTradeMenu } from "./tradeMenu";
import allPokemon from "../../data/pokemon.json";
import { MenuOption } from "../../utils/menu/types";
import { buildAllMenus } from "../../utils/menu/menuBuilder";
import { findMenuOption } from "../../utils/menu/utils";
import { getEligiblePokemon } from "./tradeUtils";

export async function handleTradeAccept(
  buttonInteraction: ButtonInteraction,
  tradeId: string,
): Promise<void> {
  try {
    await buttonInteraction.deferUpdate();
    newLogger("debug", `handleTradeAccept: Getting trade with tradeId=${tradeId}, type=${typeof tradeId}`);
    const trade = getTrade(tradeId);
    if (!trade) {
      await buttonInteraction.followUp({
        content: language("tradeNotFound", "eng"),
        ephemeral: true,
      });
      return;
    }

    newLogger("debug", 
      `handleTradeAccept: Trade retrieved`,
      `tradeId=${trade.tradeId}`,
      `initiatorId=${JSON.stringify(trade.initiatorId)}, type=${typeof trade.initiatorId}`,
      `targetId=${JSON.stringify(trade.targetId)}, type=${typeof trade.targetId}`
    );

    const safeInitiatorId = typeof trade.initiatorId === "string" ? trade.initiatorId : String(trade.initiatorId && typeof trade.initiatorId === "object" && "discordId" in trade.initiatorId ? (trade.initiatorId as any).discordId : trade.initiatorId);
    const safeTargetId = typeof trade.targetId === "string" ? trade.targetId : String(trade.targetId && typeof trade.targetId === "object" && "discordId" in trade.targetId ? (trade.targetId as any).discordId : trade.targetId);

    newLogger("debug",
      `handleTradeAccept: IDs converted`,
      `safeInitiatorId=${safeInitiatorId}, type=${typeof safeInitiatorId}`,
      `safeTargetId=${safeTargetId}, type=${typeof safeTargetId}`
    );

    if (buttonInteraction.user.id !== safeTargetId) {
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

    newLogger("debug", `handleTradeAccept: Calling updateTrade with tradeId=${tradeId}, type=${typeof tradeId}`);
    updateTrade(tradeId, { status: "accepted" });
    
    newLogger("debug", `handleTradeAccept: Calling getUserById with safeInitiatorId=${safeInitiatorId}, type=${typeof safeInitiatorId}`);
    const initiator = await getUserById(safeInitiatorId);
    newLogger("debug", `handleTradeAccept: Calling getUserById with safeTargetId=${safeTargetId}, type=${typeof safeTargetId}`);
    const target = await getUserById(safeTargetId);
    
    if (!trade.serverId) {
      newLogger("error", "handleTradeAccept: trade.serverId is missing, trade may be from old version");
      await buttonInteraction.followUp({
        content: language("tradeError", "eng"),
        ephemeral: true,
      });
      return;
    }
    
    const safeServerId = typeof trade.serverId === "string" ? trade.serverId : String(trade.serverId && typeof trade.serverId === "object" && "discordId" in trade.serverId ? (trade.serverId as any).discordId : trade.serverId);
    newLogger("debug", `handleTradeAccept: Calling getServerById with serverId=${safeServerId}, type=${typeof safeServerId}, from trade.serverId=${JSON.stringify(trade.serverId)}, type=${typeof trade.serverId}`);
    if (!safeServerId) {
      newLogger("error", "handleTradeAccept: serverId is null or undefined from trade");
      return;
    }
    const server = await getServerById(safeServerId);

    if (!server) {
      return;
    }

    const client = buttonInteraction.client;

    const initiatorEligible = getEligiblePokemon(initiator);
    const targetEligible = getEligiblePokemon(target);

    if (initiatorEligible.length === 0 || targetEligible.length === 0) {
      const initiatorUser = await client.users.fetch(safeInitiatorId);
      const targetUser = await client.users.fetch(safeTargetId);
      const initiatorName = initiatorUser.username;
      const targetName = targetUser.username;
      
      let errorMessage: string;
      if (initiatorEligible.length === 0 && targetEligible.length === 0) {
        errorMessage = language("tradeNoValidPokemonBoth", server.settings.language)
          .replace("{initiator}", initiatorName)
          .replace("{target}", targetName);
      } else if (initiatorEligible.length === 0) {
        errorMessage = language("tradeNoValidPokemon", server.settings.language).replace("{user}", initiatorName);
      } else {
        errorMessage = language("tradeNoValidPokemon", server.settings.language).replace("{user}", targetName);
      }

      const errorEmbed = new EmbedBuilder()
        .setTitle(language("tradeImpossible", server.settings.language))
        .setDescription(errorMessage)
        .setColor(0xe74c3c);

      try {
        if (trade.initiatorMessageId) {
          const initiatorDM = await initiatorUser.createDM();
          const initiatorMessage = await initiatorDM.messages.fetch(trade.initiatorMessageId);
          await initiatorMessage.edit({
            embeds: [errorEmbed],
            components: [],
          });
        }
      } catch (error) {
        newLogger("error", error as string, "Failed to update initiator message");
      }

      try {
        if (trade.targetMessageId) {
          const targetDM = await targetUser.createDM();
          const targetMessage = await targetDM.messages.fetch(trade.targetMessageId);
          await targetMessage.edit({
            embeds: [errorEmbed],
            components: [],
          });
        }
      } catch (error) {
        newLogger("error", error as string, "Failed to update target message");
      }

      await buttonInteraction.editReply({
        embeds: [errorEmbed],
        components: [],
      });

      updateTrade(tradeId, { status: "cancelled" });
      deleteTrade(tradeId);
      return;
    }

    // Send menu to initiator
    await sendTradeMenuToUser(
      client,
      safeInitiatorId,
      tradeId,
      initiator,
      server,
      true,
    );

    // Send menu to target
    await sendTradeMenuToUser(
      client,
      safeTargetId,
      tradeId,
      target,
      server,
      false,
    );

    // Update the original message
    const updatedEmbed = new EmbedBuilder()
      .setTitle(language("tradeAccepted", server.settings.language))
      .setDescription(language("tradeAcceptedDesc", server.settings.language))
      .setColor(0x2ecc71);

    await buttonInteraction.editReply({
      embeds: [updatedEmbed],
      components: [],
    });
  } catch (error: any) {
    const stack = error?.stack || new Error().stack;
    newLogger("error", 
      "Error handling trade accept",
      `error=${error}`,
      `errorMessage=${error?.message || error}`,
      `tradeId=${tradeId}, type=${typeof tradeId}`,
      `stack=${stack}`
    );
  }
}

async function sendTradeMenuToUser(
  client: any,
  userId: string,
  tradeId: string,
  user: any,
  server: any,
  isInitiator: boolean,
): Promise<void> {
  try {
    const discordUser = await client.users.fetch(userId);
    const dm = await discordUser.createDM();

    const menuHandlers = regenerateTradeMenu(
      user,
      server,
      undefined, // No rarity restriction initially
      async (pokemonKey: string) => {
        await handlePokemonSelection(tradeId, userId, pokemonKey, server, client);
      },
    );

    const menuStructure = Array.from(menuHandlers.values())[0]?.getMenuStructure();
    if (!menuStructure || !menuStructure.children) {
      await dm.send(language("tradeNoPokemonAvailable", server.settings.language));
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(language("tradeSelectPokemonTitle", server.settings.language))
      .setDescription(language("tradeSelectPokemonDesc", server.settings.language))
      .setColor(0x3498db);

    const mainMenu = new StringSelectMenuBuilder()
      .setCustomId(`trade_menu_${tradeId}_${userId}_main`)
      .setPlaceholder(language("tradeSelectGeneration", server.settings.language))
      .addOptions(
        menuStructure.children.map((opt: MenuOption) => ({
          label: opt.label,
          value: opt.value,
          description: opt.description,
        })),
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      mainMenu,
    );

    const message = await dm.send({
      embeds: [embed],
      components: [row],
    });

    // Setup collector for menu interactions
    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter: (i) =>
        i.user.id === userId &&
        i.customId.startsWith(`trade_menu_${tradeId}_${userId}`),
      time: 600000, // 10 minutes
    });

    const selectionPath: Array<{ value: string; label: string }> = [];
    const menuOptions: MenuOption[] = menuStructure.children || [];

    collector.on("collect", async (selectInteraction: StringSelectMenuInteraction) => {
      try {
        await selectInteraction.deferUpdate();

        const selectedValue = selectInteraction.values[0];
        let currentOptions = menuOptions;
        let selectedOption: MenuOption | undefined;

        // Find the selected option
        for (const opt of currentOptions) {
          if (opt.value === selectedValue) {
            selectedOption = opt;
            break;
          }
        }

        if (!selectedOption) return;

        selectionPath.push({
          value: selectedOption.value,
          label: selectedOption.label,
        });

        // If it has children, show next level menu
        if (selectedOption.children && selectedOption.children.length > 0) {
          const nextMenu = new StringSelectMenuBuilder()
            .setCustomId(
              `trade_menu_${tradeId}_${userId}_${selectionPath.length}_${selectionPath.map((p) => p.value).join("_")}`,
            )
            .setPlaceholder(selectedOption.placeholder || selectedOption.label)
            .addOptions(
              selectedOption.children.map((child: MenuOption) => ({
                label: child.label,
                value: child.value,
                description: child.description,
              })),
            );

          const nextRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            nextMenu,
          );

          // Build all menus up to current level
          const allMenus = buildAllMenus(
            selectionPath.map((p) => ({ value: p.value, label: p.label })),
            menuOptions,
            {
              subElementPlaceholder: language("tradeSubElementPlaceholder", server.settings.language),
            },
          );
          allMenus.push(nextRow);

          await selectInteraction.editReply({
            embeds: [embed],
            components: allMenus,
          });
        } else {
          // Leaf node - Pokemon selected
          await handlePokemonSelection(tradeId, userId, selectedValue, server, client);
          await message.delete().catch(() => {});
          collector.stop();
        }
      } catch (error) {
        newLogger("error", error as string, "Error in menu collector");
      }
    });

    collector.on("end", async () => {
      try {
        await message.edit({ components: [] });
      } catch (error) {
        // Message might be deleted
      }
    });
  } catch (error) {
    newLogger("error", error as string, `Failed to send menu to user ${userId}`);
  }
}

async function handlePokemonSelection(
  tradeId: string,
  userId: string,
  pokemonKey: string,
  server: any,
  client?: any,
): Promise<void> {
  const trade = getTrade(tradeId);
  if (!trade) return;

  const pokemonData = allPokemon.find(
    (p) => `${p.id}-${p.form}-${p.versionForm}` === pokemonKey,
  );
  if (!pokemonData) return;

  const choice: PokemonChoice = {
    pokemonKey,
    pokemonId: pokemonData.id.toString(),
    rarity: pokemonData.rarity,
  };

  if (userId === trade.initiatorId) {
    updateTrade(tradeId, {
      initiatorChoice: choice,
      status: trade.targetChoice ? "confirming" : "selecting",
    });
  } else {
    updateTrade(tradeId, {
      targetChoice: choice,
      status: trade.initiatorChoice ? "confirming" : "selecting",
    });
  }

  // If both have selected, move to confirmation phase
  const updatedTrade = getTrade(tradeId);
  if (updatedTrade?.initiatorChoice && updatedTrade?.targetChoice) {
    // Check rarity match
    if (
      updatedTrade.initiatorChoice.rarity !== updatedTrade.targetChoice.rarity
    ) {
            // Rarity mismatch - notify users and reset
      if (client) {
        try {
          const initiatorUser = await client.users.fetch(trade.initiatorId);
          const targetUser = await client.users.fetch(trade.targetId);

          if (initiatorUser) {
            const dm = await initiatorUser.createDM();
            await dm.send(
              language("tradeRarityMismatch", server.settings.language),
            );
          }
          if (targetUser) {
            const dm = await targetUser.createDM();
            await dm.send(
              language("tradeRarityMismatch", server.settings.language),
            );
          }
        } catch (error) {
          // DM might be disabled
        }
      }

      // Reset choices
      updateTrade(tradeId, {
        status: "accepted",
        initiatorChoice: undefined,
        targetChoice: undefined,
      });

      // Re-send menus with rarity restriction
      const initiator = await getUserById(trade.initiatorId);
      const target = await getUserById(trade.targetId);

      // This would require re-implementing with rarity filter
      // For now, just reset and let them try again
      return;
    }

    if (client) {
      await sendConfirmationEmbeds(updatedTrade, server, client);
    }
  } else {
    // Notify user that selection is confirmed and waiting for other
    // This will be handled by the menu system
  }
}

async function sendConfirmationEmbeds(
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

    const confirmButton = new ButtonBuilder()
      .setCustomId(`trade_confirm_${trade.tradeId}`)
      .setLabel(language("tradeConfirmButton", server.settings.language))
      .setStyle(ButtonStyle.Success)
      .setEmoji("✅");

    const cancelButton = new ButtonBuilder()
      .setCustomId(`trade_cancel_${trade.tradeId}`)
      .setLabel(language("tradeCancelButton", server.settings.language))
      .setStyle(ButtonStyle.Danger)
      .setEmoji("❌");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      confirmButton,
      cancelButton,
    );

    try {
      const initiatorDM = await initiatorUser.createDM();
      await initiatorDM.send({
        embeds: [initiatorEmbed],
        components: [row],
      });
    } catch (error) {
      newLogger("error", error as string, "Failed to send confirmation to initiator");
    }

    try {
      const targetDM = await targetUser.createDM();
      await targetDM.send({
        embeds: [targetEmbed],
        components: [row],
      });
    } catch (error) {
      newLogger("error", error as string, "Failed to send confirmation to target");
    }
  } catch (error) {
    newLogger("error", error as string, "Error sending confirmation embeds");
  }
}

export async function handleTradeRefuse(
  buttonInteraction: ButtonInteraction,
  tradeId: string,
): Promise<void> {
  try {
    await buttonInteraction.deferUpdate();
    const trade = getTrade(tradeId);
    if (!trade) return;

    if (buttonInteraction.user.id !== trade.targetId) {
      return;
    }

    updateTrade(tradeId, { status: "cancelled" });

    const safeServerId = typeof trade.serverId === "string" ? trade.serverId : String(trade.serverId && typeof trade.serverId === "object" && "discordId" in trade.serverId ? (trade.serverId as any).discordId : trade.serverId);
    if (!safeServerId) return;
    const server = await getServerById(safeServerId);
    if (!server) return;

    const embed = new EmbedBuilder()
      .setTitle(language("tradeRefused", server.settings.language))
      .setDescription(language("tradeRefusedDesc", server.settings.language))
      .setColor(0xe74c3c);

    await buttonInteraction.editReply({
      embeds: [embed],
      components: [],
    });

    // Notify initiator
    try {
      const initiatorUser = await buttonInteraction.client.users.fetch(
        trade.initiatorId,
      );
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
    if (!trade) return;

    if (buttonInteraction.user.id !== trade.targetId) {
      return;
    }

    // Block for 1 week
    const expiresAt = Date.now() + 604800000; // 7 days
    setTradeBlock(trade.targetId, expiresAt);

    updateTrade(tradeId, { status: "cancelled" });

    const safeServerId = typeof trade.serverId === "string" ? trade.serverId : String(trade.serverId && typeof trade.serverId === "object" && "discordId" in trade.serverId ? (trade.serverId as any).discordId : trade.serverId);
    if (!safeServerId) return;
    const server = await getServerById(safeServerId);
    if (!server) return;

    const embed = new EmbedBuilder()
      .setTitle(language("tradeRefusedWeek", server.settings.language))
      .setDescription(language("tradeRefusedWeekDesc", server.settings.language))
      .setColor(0xe74c3c);

    await buttonInteraction.editReply({
      embeds: [embed],
      components: [],
    });

    // Notify initiator
    try {
      const initiatorUser = await buttonInteraction.client.users.fetch(
        trade.initiatorId,
      );
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

    if (trade.status !== "confirming") {
      return;
    }

    // Execute trade
    if (trade.initiatorChoice && trade.targetChoice) {
      const success = await executeTrade(trade);

      const safeServerId = typeof trade.serverId === "string" ? trade.serverId : String(trade.serverId && typeof trade.serverId === "object" && "discordId" in trade.serverId ? (trade.serverId as any).discordId : trade.serverId);
      if (!safeServerId) return;
      const server = await getServerById(safeServerId);
      if (!server) return;

      if (success) {
        updateTrade(tradeId, { status: "completed" });

        const successEmbed = new EmbedBuilder()
          .setTitle(language("tradeCompleted", server.settings.language))
          .setDescription(language("tradeCompletedDesc", server.settings.language))
          .setColor(0x2ecc71);

        await buttonInteraction.editReply({
          embeds: [successEmbed],
          components: [],
        });

        // Notify other user
        const otherUserId =
          buttonInteraction.user.id === trade.initiatorId
            ? trade.targetId
            : trade.initiatorId;
        try {
          const otherUser = await buttonInteraction.client.users.fetch(
            otherUserId,
          );
          const otherDM = await otherUser.createDM();
          await otherDM.send({ embeds: [successEmbed] });
        } catch (error) {
          // DM might be disabled
        }

        deleteTrade(tradeId);
      } else {
        const errorEmbed = new EmbedBuilder()
          .setTitle(language("tradeFailed", server.settings.language))
          .setDescription(language("tradeFailedDesc", server.settings.language))
          .setColor(0xe74c3c);

        await buttonInteraction.editReply({
          embeds: [errorEmbed],
          components: [],
        });

        // Return to selection phase
        updateTrade(tradeId, {
          status: "accepted",
          initiatorChoice: undefined,
          targetChoice: undefined,
        });
      }
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
    if (!trade) return;

    if (
      buttonInteraction.user.id !== trade.initiatorId &&
      buttonInteraction.user.id !== trade.targetId
    ) {
      return;
    }

    // Reset choices and return to selection phase
    updateTrade(tradeId, {
      status: "accepted",
      initiatorChoice: undefined,
      targetChoice: undefined,
    });

    const safeServerId = typeof trade.serverId === "string" ? trade.serverId : String(trade.serverId && typeof trade.serverId === "object" && "discordId" in trade.serverId ? (trade.serverId as any).discordId : trade.serverId);
    if (!safeServerId) return;
    const server = await getServerById(safeServerId);
    if (!server) return;

    await buttonInteraction.followUp({
      content: language("tradeCancelledReturningToSelection", server.settings.language),
      ephemeral: true,
    });

    // Re-send menus
    const initiator = await getUserById(trade.initiatorId);
    const target = await getUserById(trade.targetId);

    const client = buttonInteraction.client;

    await sendTradeMenuToUser(
      client,
      trade.initiatorId,
      tradeId,
      initiator,
      server,
      true,
    );
    await sendTradeMenuToUser(
      client,
      trade.targetId,
      tradeId,
      target,
      server,
      false,
    );
  } catch (error) {
    newLogger("error", error as string, "Error handling trade cancel");
  }
}

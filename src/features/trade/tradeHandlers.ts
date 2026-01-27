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
import { createTradeSummaryEmbed, calculateCooldownRemaining } from "./tradeUtils";
import { executeTrade } from "./tradeValidation";
import { formatTimestamp } from "../../utils/helperFunction";

function extractDiscordId(value: string | { discordId: string } | unknown): string {
  if (typeof value === "string") {
    return value;
  }
  if (value && typeof value === "object" && "discordId" in value) {
    const obj = value as { discordId: unknown };
    return String(obj.discordId);
  }
  return String(value);
}

function createTradeCompletedEmbed(
  trade: TradeData,
  server: any,
  isInitiator: boolean,
  initiatorName: string,
  targetName: string,
  user: any,
): EmbedBuilder {
  const lang = server.settings.language;
  const embed = new EmbedBuilder()
    .setTitle(language("tradeCompleted", lang))
    .setColor(0x2ecc71);

  if (!trade.initiatorChoice || !trade.targetChoice) {
    embed.setDescription(language("tradeCompletedDesc", lang));
    return embed;
  }

  const myChoice = isInitiator ? trade.initiatorChoice : trade.targetChoice;
  const receivedChoice = isInitiator ? trade.targetChoice : trade.initiatorChoice;

  const myPokemonData = allPokemon.find(
    (p) =>
      p.id.toString() === myChoice.pokemonId &&
      `${p.id}-${p.form}-${p.versionForm}` === myChoice.pokemonKey,
  );
  const receivedPokemonData = allPokemon.find(
    (p) =>
      p.id.toString() === receivedChoice.pokemonId &&
      `${p.id}-${p.form}-${p.versionForm}` === receivedChoice.pokemonKey,
  );

  if (!myPokemonData || !receivedPokemonData) {
    embed.setDescription(language("tradeCompletedDesc", lang));
    return embed;
  }

  const myPokemonName = myPokemonData.name[
    `name${lang.charAt(0).toUpperCase() + lang.slice(1)}` as "nameFr" | "nameEng"
  ][0];
  const receivedPokemonName = receivedPokemonData.name[
    `name${lang.charAt(0).toUpperCase() + lang.slice(1)}` as "nameFr" | "nameEng"
  ][0];

  const myPokemon = user.savePokemon.data[myChoice.pokemonKey];
  const receivedPokemon = user.savePokemon.data[receivedChoice.pokemonKey];
  
  const myCount = myPokemon ? myPokemon.normalCount : 0;
  const receivedCount = receivedPokemon ? receivedPokemon.normalCount : 0;

  return embed.setDescription(
    language("tradeCompletedDesc", lang)
  ).addFields(
    {
      name: language("tradeYouGive", lang),
      value: `${myPokemonName} (${myCount})`,
      inline: true,
    },
    {
      name: language("tradeYouReceive", lang),
      value: `${receivedPokemonName} (${receivedCount})`,
      inline: true,
    },
  );
}
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

    const safeInitiatorId = extractDiscordId(trade.initiatorId);
    const safeTargetId = extractDiscordId(trade.targetId);

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
    
    const safeServerId = extractDiscordId(trade.serverId);
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

    const cooldownFields: string[] = [];
    const rarities = ["legendary", "fabulous", "ultraBeast"];
    const rarityNames: Record<string, string> = {
      legendary: language("statCategoryLegendary", server.settings.language),
      fabulous: language("statCategoryFabulous", server.settings.language),
      ultraBeast: language("statCategoryUltraBeast", server.settings.language),
    };

    for (const rarity of rarities) {
      const remaining = calculateCooldownRemaining(userId, rarity);
      if (remaining !== null) {
        const expiresAt = Date.now() + remaining;
        cooldownFields.push(
          `${rarityNames[rarity]}: ${formatTimestamp(expiresAt)}`,
        );
      }
    }

    if (cooldownFields.length > 0) {
      embed.addFields({
        name: language("tradeCooldownsTitle", server.settings.language),
        value: cooldownFields.join("\n"),
      });
    }

    const mainMenu = new StringSelectMenuBuilder()
      .setCustomId(`tm_${tradeId}_${userId}_0`)
      .setPlaceholder(language("tradeSelectGeneration", server.settings.language))
      .addOptions(
        menuStructure.children.map((opt: MenuOption) => ({
          label: opt.label.length > 100 ? opt.label.substring(0, 97) + "..." : opt.label,
          value: opt.value.length > 100 ? opt.value.substring(0, 100) : opt.value,
          description: opt.description && opt.description.length > 100 
            ? opt.description.substring(0, 97) + "..." 
            : opt.description,
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
        i.customId.startsWith(`tm_${tradeId}_${userId}_`),
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

        // Navigate through selectionPath to find the correct level
        for (let i = 0; i < selectionPath.length; i++) {
          const pathValue = selectionPath[i].value;
          const foundOption = currentOptions.find((opt) => opt.value === pathValue);
          if (foundOption && foundOption.children) {
            currentOptions = foundOption.children;
          } else {
            break;
          }
        }

        // Find the selected option in the current level
        selectedOption = currentOptions.find((opt) => opt.value === selectedValue);

        if (!selectedOption) return;

        selectionPath.push({
          value: selectedOption.value,
          label: selectedOption.label,
        });

        // If it has children, show next level menu
        if (selectedOption.children && selectedOption.children.length > 0) {
          // Build menus manually with correct customId format (shortened to avoid 100 char limit)
          const allMenus: ActionRowBuilder<StringSelectMenuBuilder>[] = [];
          let currentLevelOptions = menuOptions;
          
          // Build menus for each level in the path
          for (let i = 0; i < selectionPath.length; i++) {
            const pathItem = selectionPath[i];
            // Use shorter format: trade_menu_{tradeId}_{userId}_{level}
            // Path is stored in selectionPath, no need to include in customId
            const menu = new StringSelectMenuBuilder()
              .setCustomId(
                `tm_${tradeId}_${userId}_${i}`,
              )
              .setPlaceholder(pathItem.label.length > 150 ? pathItem.label.substring(0, 147) + "..." : pathItem.label)
              .addOptions(
                currentLevelOptions.slice(0, 25).map((opt: MenuOption) => ({
                  label: opt.label.length > 100 ? opt.label.substring(0, 97) + "..." : opt.label,
                  value: opt.value.length > 100 ? opt.value.substring(0, 100) : opt.value,
                  description: opt.description && opt.description.length > 100 
                    ? opt.description.substring(0, 97) + "..." 
                    : opt.description,
                  default: opt.value === pathItem.value,
                })),
              );
            
            allMenus.push(
              new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu),
            );
            
            // Navigate to next level
            const foundOption = currentLevelOptions.find((opt) => opt.value === pathItem.value);
            if (foundOption?.children) {
              currentLevelOptions = foundOption.children;
            }
          }
          
          // Add next level menu
          const placeholderText = selectedOption.placeholder || selectedOption.label;
          const childrenOptions = selectedOption.children.slice(0, 25).map((child: MenuOption) => ({
            label: child.label.length > 100 ? child.label.substring(0, 97) + "..." : child.label,
            value: child.value.length > 100 ? child.value.substring(0, 100) : child.value,
            description: child.description && child.description.length > 100 
              ? child.description.substring(0, 97) + "..." 
              : child.description,
          }));
          
          if (childrenOptions.length === 0) {
            newLogger("warn", "No valid children options for menu", `tradeId=${tradeId}`, `userId=${userId}`);
            return;
          }
          
          const nextMenu = new StringSelectMenuBuilder()
            .setCustomId(
              `tm_${tradeId}_${userId}_${selectionPath.length}`,
            )
            .setPlaceholder(placeholderText.length > 150 ? placeholderText.substring(0, 147) + "..." : placeholderText)
            .addOptions(childrenOptions);
          
          allMenus.push(
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(nextMenu),
          );

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
    // Reset confirmations when entering confirmation phase
    updateTrade(tradeId, {
      initiatorConfirmed: false,
      targetConfirmed: false,
    });
    const tradeWithReset = getTrade(tradeId);
    if (!tradeWithReset) return;
    
    // Check rarity match
    if (
      tradeWithReset.initiatorChoice!.rarity !== tradeWithReset.targetChoice!.rarity
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
      await sendConfirmationEmbeds(tradeWithReset, server, client);
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

    // Add confirmation status to embeds
    const lang = server.settings.language;
    const confirmedText = language("tradeCompleted", lang);
    const waitingText = language("tradeWaitingOther", lang);
    const initiatorStatus = trade.initiatorConfirmed 
      ? `✅ ${confirmedText}` 
      : `⏳ ${waitingText}`;
    const targetStatus = trade.targetConfirmed 
      ? `✅ ${confirmedText}` 
      : `⏳ ${waitingText}`;

    const statusTitle = language("tradeSummaryTitle", lang);
    initiatorEmbed.addFields({
      name: statusTitle,
      value: `${initiatorName}: ${initiatorStatus}\n${targetName}: ${targetStatus}`,
    });

    targetEmbed.addFields({
      name: statusTitle,
      value: `${initiatorName}: ${initiatorStatus}\n${targetName}: ${targetStatus}`,
    });

    // Create buttons for initiator
    const initiatorConfirmButton = new ButtonBuilder()
      .setCustomId(`trade_confirm_${trade.tradeId}`)
      .setLabel(language("tradeConfirmButton", lang))
      .setStyle(ButtonStyle.Success)
      .setEmoji("✅")
      .setDisabled(trade.initiatorConfirmed || false);

    const initiatorCancelButton = new ButtonBuilder()
      .setCustomId(`trade_cancel_${trade.tradeId}`)
      .setLabel(language("tradeCancelButton", lang))
      .setStyle(ButtonStyle.Danger)
      .setEmoji("❌")
      .setDisabled(trade.initiatorConfirmed || false);

    const initiatorRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      initiatorConfirmButton,
      initiatorCancelButton,
    );

    // Create buttons for target
    const targetConfirmButton = new ButtonBuilder()
      .setCustomId(`trade_confirm_${trade.tradeId}`)
      .setLabel(language("tradeConfirmButton", lang))
      .setStyle(ButtonStyle.Success)
      .setEmoji("✅")
      .setDisabled(trade.targetConfirmed || false);

    const targetCancelButton = new ButtonBuilder()
      .setCustomId(`trade_cancel_${trade.tradeId}`)
      .setLabel(language("tradeCancelButton", lang))
      .setStyle(ButtonStyle.Danger)
      .setEmoji("❌")
      .setDisabled(trade.targetConfirmed || false);

    const targetRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      targetConfirmButton,
      targetCancelButton,
    );

    try {
      const initiatorDM = await initiatorUser.createDM();
      await initiatorDM.send({
        embeds: [initiatorEmbed],
        components: [initiatorRow],
      });
    } catch (error) {
      newLogger("error", error as string, "Failed to send confirmation to initiator");
    }

    try {
      const targetDM = await targetUser.createDM();
      await targetDM.send({
        embeds: [targetEmbed],
        components: [targetRow],
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

    const safeServerId = extractDiscordId(trade.serverId);
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

    const safeServerId = extractDiscordId(trade.serverId);
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

    if (!trade.initiatorChoice || !trade.targetChoice) {
      return;
    }

    const safeServerId = extractDiscordId(trade.serverId);
    if (!safeServerId) return;
    const server = await getServerById(safeServerId);
    if (!server) return;

    const isInitiator = buttonInteraction.user.id === trade.initiatorId;
    const updates: Partial<TradeData> = {};
    
    if (isInitiator) {
      updates.initiatorConfirmed = true;
    } else {
      updates.targetConfirmed = true;
    }

    updateTrade(tradeId, updates);
    const updatedTrade = getTrade(tradeId);
    if (!updatedTrade) return;

    const bothConfirmed = updatedTrade.initiatorConfirmed && updatedTrade.targetConfirmed;

    if (bothConfirmed) {
      // Both confirmed, execute trade
      const success = await executeTrade(updatedTrade);

      if (success) {
        updateTrade(tradeId, { status: "completed" });

        // Get updated user data to show final counts
        const updatedInitiator = await getUserById(updatedTrade.initiatorId);
        const updatedTarget = await getUserById(updatedTrade.targetId);
        
        if (!updatedInitiator || !updatedTarget) {
          const errorEmbed = new EmbedBuilder()
            .setTitle(language("tradeFailed", server.settings.language))
            .setDescription(language("tradeFailedDesc", server.settings.language))
            .setColor(0xe74c3c);
          await buttonInteraction.editReply({
            embeds: [errorEmbed],
            components: [],
          });
          return;
        }

        const initiatorUser = await buttonInteraction.client.users.fetch(updatedTrade.initiatorId);
        const targetUser = await buttonInteraction.client.users.fetch(updatedTrade.targetId);
        const initiatorName = initiatorUser.username;
        const targetName = targetUser.username;

        // Create personalized embeds for each user with counts
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
        await buttonInteraction.editReply({
          embeds: [userEmbed],
          components: [],
        });

        // Notify other user with their personalized embed
        const otherUserId = isInitiator ? updatedTrade.targetId : updatedTrade.initiatorId;
        const otherEmbed = isInitiator ? targetEmbed : initiatorEmbed;
        try {
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

        await buttonInteraction.editReply({
          embeds: [errorEmbed],
          components: [],
        });

        // Return to selection phase
        updateTrade(tradeId, {
          status: "accepted",
          initiatorChoice: undefined,
          targetChoice: undefined,
          initiatorConfirmed: false,
          targetConfirmed: false,
        });
      }
    } else {
      // Only one confirmed, update embeds to show confirmation status
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

    const safeServerId = extractDiscordId(trade.serverId);
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

import {
  Interaction,
  ChatInputCommandInteraction,
  Client,
  GuildChannelResolvable,
  ButtonInteraction,
} from "discord.js";
import langue from "../commands/admin/langue";
import spawn from "../commands/admin/spawn";
import hintPokemon from "../commands/information/hintPokemon";
import information from "../commands/information/information";
import stat from "../commands/information/stat";
import tutorial from "../commands/information/tutorial";
import howHaveThisPokemon from "../commands/save/howMuchThisPokemon";
import pokedex from "../commands/save/pokedex";
import effect from "../commands/server/effect";
import code from "../commands/user/code";
import catchPokemon from "../commands/user/catchPokemon";
import adminSettings from "../commands/admin/adminSettings";
import trade from "../commands/user/trade";
import {
  handleTradeAccept,
  handleTradeRefuse,
  handleTradeRefuseWeek,
  handleTradeConfirm,
  handleTradeCancel,
} from "../features/trade/tradeHandlers";
import { newLogger } from "../middlewares/logger";

export default async (client: Client, interaction: Interaction) => {
  try {
    // Handle button interactions for trades
    if (interaction instanceof ButtonInteraction) {
      if (interaction.customId.startsWith("trade_")) {
        const parts = interaction.customId.split("_");
        if (parts.length >= 3) {
          const action = parts[1];
          const tradeId = parts.slice(2).join("_");

          switch (action) {
            case "accept":
              await handleTradeAccept(interaction, tradeId);
              return;
            case "refuse":
              if (parts[2] === "week") {
                const weekTradeId = parts.slice(3).join("_");
                await handleTradeRefuseWeek(interaction, weekTradeId);
              } else {
                await handleTradeRefuse(interaction, tradeId);
              }
              return;
            case "confirm":
              await handleTradeConfirm(interaction, tradeId);
              return;
            case "cancel":
              await handleTradeCancel(interaction, tradeId);
              return;
          }
        }
      }
      // For other button interactions, let them pass through
      return;
    }

    if (!verification(client, interaction as ChatInputCommandInteraction)) {
      return;
    }

    if (
      interaction instanceof ChatInputCommandInteraction &&
      interaction.isCommand()
    ) {
      switch (interaction.commandName) {
        case langue.name:
          await langue.execute(interaction);
          break;
        case spawn.name:
          await spawn.execute(interaction);
          break;
        case hintPokemon.name:
          await hintPokemon.execute(interaction);
          break;
        case information.name:
          await information.execute(interaction);
          break;
        case stat.name:
          await stat.execute(interaction);
          break;
        case tutorial.name:
          await tutorial.execute(interaction);
          break;
        case howHaveThisPokemon.name:
          await howHaveThisPokemon.execute(interaction);
          break;
        case pokedex.name:
          await pokedex.execute(interaction);
          break;
        case effect.name:
          await effect.execute(interaction);
          break;
        case code.name:
          await code.execute(interaction);
          break;
        case catchPokemon.name:
          await catchPokemon.execute(interaction);
          break;
        case adminSettings.name:
          await adminSettings.execute(interaction);
          break;
        case trade.name:
          await trade.execute(interaction);
          break;
      }
    }
  } catch (e) {
    newLogger(
      "error",
      e as string,
      `Error in interactionCreate event for user ${interaction.user.id} in server ${interaction.guild?.id}`,
    );
  }
};

function verification(
  client: Client,
  interaction: ChatInputCommandInteraction,
): boolean {
  const permissionRequiredSendMessage = "SendMessages";
  const permissionRequiredViewChannel = "ViewChannel";

  const server = interaction.guild;
  const botMember = client.user
    ? server?.members.cache.get(client.user.id)
    : undefined;

  let canSendMessage = false;
  let canViewChannel = false;
  if (botMember && interaction.channel) {
    if (interaction.channel?.isTextBased()) {
      canSendMessage = botMember
        .permissionsIn(interaction.channel as GuildChannelResolvable)
        .has(permissionRequiredSendMessage);
      canViewChannel = botMember
        .permissionsIn(interaction.channel as GuildChannelResolvable)
        .has(permissionRequiredViewChannel);
    }
  }
  return canViewChannel && canSendMessage;
}

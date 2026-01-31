import { getTrade, updateTrade, extractId, PokemonChoice } from "./tradeCache";
import allPokemon from "../../data/pokemon.json";
import { getUserById } from "../../cache/UserCache";
import type { ServerType } from "../../core/types/ServerType";
import language from "../../lang/language";
import { newLogger } from "../../middlewares/logger";
import { sendConfirmationEmbeds } from "./tradeConfirmation";
import { sendTradeMenuToUser } from "./tradeMenuHandler";
import type { Client } from "discord.js";

export async function handlePokemonSelection(
  tradeId: string,
  userId: string,
  pokemonKey: string,
  server: ServerType,
  client?: Client,
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

  const updatedTrade = getTrade(tradeId);
  if (!updatedTrade?.initiatorChoice || !updatedTrade?.targetChoice) return;

  updateTrade(tradeId, {
    initiatorConfirmed: false,
    targetConfirmed: false,
  });

  const tradeWithReset = getTrade(tradeId);
  if (!tradeWithReset) return;

  if (
    tradeWithReset.initiatorChoice!.rarity !==
    tradeWithReset.targetChoice!.rarity
  ) {
    const initiatorId = extractId(trade.initiatorId);
    const targetId = extractId(trade.targetId);

    updateTrade(tradeId, {
      status: "selecting",
      initiatorChoice: undefined,
      targetChoice: undefined,
      initiatorConfirmationMessageId: undefined,
      targetConfirmationMessageId: undefined,
    });

    if (client) {
      try {
        const initiatorUser = await client.users.fetch(initiatorId);
        const targetUser = await client.users.fetch(targetId);
        const initiatorDM = await initiatorUser.createDM();
        const targetDM = await targetUser.createDM();
        await initiatorDM.send(
          language("tradeRarityMismatch", server.settings.language),
        );
        await targetDM.send(
          language("tradeRarityMismatch", server.settings.language),
        );
      } catch (error) {
        // DM might be disabled
      }

      try {
        const initiator = await getUserById(initiatorId);
        const target = await getUserById(targetId);
        if (initiator && target) {
          await sendTradeMenuToUser(
            client,
            initiatorId,
            tradeId,
            initiator,
            server,
          );
          await sendTradeMenuToUser(
            client,
            targetId,
            tradeId,
            target,
            server,
          );
        }
      } catch (error) {
        newLogger(
          "error",
          error as string,
          "Failed to re-send trade selection menu after rarity mismatch",
        );
      }
    }
    return;
  }

  if (client) {
    await sendConfirmationEmbeds(tradeWithReset, server, client);
  }
}

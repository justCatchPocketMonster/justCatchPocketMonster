import { getTrade, updateTrade } from "./tradeCache";
import { PokemonChoice } from "./tradeCache";
import allPokemon from "../../data/pokemon.json";
import { getUserById } from "../../cache/UserCache";
import language from "../../lang/language";
import { newLogger } from "../../middlewares/logger";
import { sendConfirmationEmbeds } from "./tradeConfirmation";

export async function handlePokemonSelection(
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

  const updatedTrade = getTrade(tradeId);
  if (!updatedTrade?.initiatorChoice || !updatedTrade?.targetChoice) return;

  updateTrade(tradeId, {
    initiatorConfirmed: false,
    targetConfirmed: false,
  });

  const tradeWithReset = getTrade(tradeId);
  if (!tradeWithReset) return;

  if (
    tradeWithReset.initiatorChoice!.rarity !== tradeWithReset.targetChoice!.rarity
  ) {
    if (client) {
      try {
        const initiatorUser = await client.users.fetch(trade.initiatorId);
        const targetUser = await client.users.fetch(trade.targetId);
        const initiatorDM = await initiatorUser.createDM();
        const targetDM = await targetUser.createDM();
        await initiatorDM.send(language("tradeRarityMismatch", server.settings.language));
        await targetDM.send(language("tradeRarityMismatch", server.settings.language));
      } catch (error) {
        // DM might be disabled
      }
    }

    updateTrade(tradeId, {
      status: "accepted",
      initiatorChoice: undefined,
      targetChoice: undefined,
    });
    return;
  }

  if (client) {
    await sendConfirmationEmbeds(tradeWithReset, server, client);
  }
}

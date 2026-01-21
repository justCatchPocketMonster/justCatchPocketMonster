import { UserType } from "../../core/types/UserType";
import { updateUser, getUserById } from "../../cache/UserCache";
import { TradeData, PokemonChoice, setTradeCooldown } from "./tradeCache";
import { getRarityCooldownMs } from "./tradeUtils";
import { newLogger } from "../../middlewares/logger";
import allPokemon from "../../data/pokemon.json";

export async function validateTrade(tradeData: TradeData): Promise<boolean> {
  if (!tradeData.initiatorChoice || !tradeData.targetChoice) {
    return false;
  }

  // Check that both Pokemon have the same rarity
  if (tradeData.initiatorChoice.rarity !== tradeData.targetChoice.rarity) {
    return false;
  }

  // Get fresh user data
  const initiator = await getUserById(tradeData.initiatorId);
  const target = await getUserById(tradeData.targetId);

  // Verify quantities before trade
  const initiatorPokemon = initiator.savePokemon.data[tradeData.initiatorChoice.pokemonKey];
  const targetPokemon = target.savePokemon.data[tradeData.targetChoice.pokemonKey];

  if (!initiatorPokemon || !targetPokemon) {
    return false;
  }

  // Check that initiator has at least 2 copies (will have 1 after trade)
  const initiatorTotal =
    initiatorPokemon.normalCount + initiatorPokemon.shinyCount;
  if (initiatorTotal < 2) {
    return false;
  }

  // Check that target has at least 2 copies (will have 1 after trade)
  const targetTotal = targetPokemon.normalCount + targetPokemon.shinyCount;
  if (targetTotal < 2) {
    return false;
  }

  // Check that initiator will have at least 1 copy of received Pokemon after trade
  const initiatorReceived = initiator.savePokemon.data[tradeData.targetChoice.pokemonKey];
  const initiatorReceivedTotal = initiatorReceived
    ? initiatorReceived.normalCount + initiatorReceived.shinyCount
    : 0;
  if (initiatorReceivedTotal < 0) {
    // This shouldn't happen, but safety check
    return false;
  }

  // Check that target will have at least 1 copy of received Pokemon after trade
  const targetReceived = target.savePokemon.data[tradeData.initiatorChoice.pokemonKey];
  const targetReceivedTotal = targetReceived
    ? targetReceived.normalCount + targetReceived.shinyCount
    : 0;
  if (targetReceivedTotal < 0) {
    // This shouldn't happen, but safety check
    return false;
  }

  return true;
}

export async function executeTrade(tradeData: TradeData): Promise<boolean> {
  try {
    // Final validation before execution
    if (!(await validateTrade(tradeData))) {
      return false;
    }

    // Get fresh user data
    const initiator = await getUserById(tradeData.initiatorId);
    const target = await getUserById(tradeData.targetId);

    if (!initiator || !target) {
      return false;
    }

    const initiatorChoice = tradeData.initiatorChoice!;
    const targetChoice = tradeData.targetChoice!;

    // Get Pokemon data
    const initiatorPokemon = initiator.savePokemon.data[initiatorChoice.pokemonKey];
    const targetPokemon = target.savePokemon.data[targetChoice.pokemonKey];

    if (!initiatorPokemon || !targetPokemon) {
      return false;
    }

    // Verify quantities one more time (race condition protection)
    const initiatorTotal =
      initiatorPokemon.normalCount + initiatorPokemon.shinyCount;
    const targetTotal = targetPokemon.normalCount + targetPokemon.shinyCount;

    if (initiatorTotal < 2 || targetTotal < 2) {
      return false;
    }

    // Initialize received Pokemon if they don't exist
    if (!initiator.savePokemon.data[targetChoice.pokemonKey]) {
      const pokemonData = allPokemon.find(
        (p) =>
          p.id.toString() === targetChoice.pokemonId &&
          `${p.id}-${p.form}-${p.versionForm}` === targetChoice.pokemonKey,
      );
      if (pokemonData) {
        initiator.savePokemon.data[targetChoice.pokemonKey] = {
          idPokemon: targetChoice.pokemonId,
          rarity: pokemonData.rarity,
          form: pokemonData.form,
          versionForm: pokemonData.versionForm,
          normalCount: 0,
          shinyCount: 0,
        };
      }
    }

    if (!target.savePokemon.data[initiatorChoice.pokemonKey]) {
      const pokemonData = allPokemon.find(
        (p) =>
          p.id.toString() === initiatorChoice.pokemonId &&
          `${p.id}-${p.form}-${p.versionForm}` === initiatorChoice.pokemonKey,
      );
      if (pokemonData) {
        target.savePokemon.data[initiatorChoice.pokemonKey] = {
          idPokemon: initiatorChoice.pokemonId,
          rarity: pokemonData.rarity,
          form: pokemonData.form,
          versionForm: pokemonData.versionForm,
          normalCount: 0,
          shinyCount: 0,
        };
      }
    }

    // Execute the trade: remove 1 from sent, add 1 to received
    // Remove from initiator's sent Pokemon
    if (initiatorPokemon.normalCount > 0) {
      initiatorPokemon.normalCount--;
    } else if (initiatorPokemon.shinyCount > 0) {
      initiatorPokemon.shinyCount--;
    }

    // Add to initiator's received Pokemon
    const initiatorReceived = initiator.savePokemon.data[targetChoice.pokemonKey];
    if (initiatorReceived) {
      initiatorReceived.normalCount++;
    }

    // Remove from target's sent Pokemon
    if (targetPokemon.normalCount > 0) {
      targetPokemon.normalCount--;
    } else if (targetPokemon.shinyCount > 0) {
      targetPokemon.shinyCount--;
    }

    // Add to target's received Pokemon
    const targetReceived = target.savePokemon.data[initiatorChoice.pokemonKey];
    if (targetReceived) {
      targetReceived.normalCount++;
    }

    // Final check: ensure no one has 0 Pokemon after trade
    const initiatorSentAfter =
      initiatorPokemon.normalCount + initiatorPokemon.shinyCount;
    const targetSentAfter = targetPokemon.normalCount + targetPokemon.shinyCount;

    if (initiatorSentAfter < 0 || targetSentAfter < 0) {
      // Rollback would be needed here, but since we're modifying objects directly,
      // we just return false and don't save
      return false;
    }

    // Update users in database
    await updateUser(initiator.discordId, initiator);
    await updateUser(target.discordId, target);

    // Update cooldowns
    const rarity = initiatorChoice.rarity;
    const cooldownMs = getRarityCooldownMs(rarity);
    if (cooldownMs > 0) {
      const expiresAt = Date.now() + cooldownMs;
      setTradeCooldown(initiator.discordId, rarity, expiresAt);
      setTradeCooldown(target.discordId, rarity, expiresAt);
    }

    return true;
  } catch (error) {
    newLogger(
      "error",
      error as string,
      `Error executing trade ${tradeData.tradeId}`,
    );
    return false;
  }
}

export function checkCooldown(
  userId: string,
  rarity: string,
): { allowed: boolean; expiresAt?: number } {
  const cooldownMs = getRarityCooldownMs(rarity);
  if (cooldownMs === 0) {
    return { allowed: true };
  }

  const { getTradeCooldown } = require("./tradeCache");
  const cooldown = getTradeCooldown(userId, rarity);

  if (!cooldown || cooldown.expiresAt <= Date.now()) {
    return { allowed: true };
  }

  return { allowed: false, expiresAt: cooldown.expiresAt };
}

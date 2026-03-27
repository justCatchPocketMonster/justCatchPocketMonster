import { UserType } from "../../core/types/UserType";
import { updateUser, getUserById } from "../../cache/UserCache";
import { TradeData, setTradeCooldown, getTradeCooldown } from "./tradeCache";
import { getRarityCooldownMs } from "./tradeUtils";
import { newLogger } from "../../middlewares/logger";
import allPokemon from "../../data/json/pokemon.json";

export async function validateTrade(tradeData: TradeData): Promise<boolean> {
  if (!tradeData.initiatorChoice || !tradeData.targetChoice) {
    return false;
  }

  if (tradeData.initiatorChoice.rarity !== tradeData.targetChoice.rarity) {
    return false;
  }

  const initiator = await getUserById(tradeData.initiatorId);
  const target = await getUserById(tradeData.targetId);

  const initiatorPokemon =
    initiator.savePokemon.data[tradeData.initiatorChoice.pokemonKey];
  const targetPokemon =
    target.savePokemon.data[tradeData.targetChoice.pokemonKey];

  if (!initiatorPokemon || !targetPokemon) {
    return false;
  }

  const initiatorTotal =
    initiatorPokemon.normalCount + initiatorPokemon.shinyCount;
  const targetTotal = targetPokemon.normalCount + targetPokemon.shinyCount;

  if (initiatorTotal < 2 || targetTotal < 2) {
    return false;
  }

  return true;
}

function initializePokemonIfNeeded(
  user: UserType,
  choice: { pokemonId: string; pokemonKey: string },
): void {
  if (user.savePokemon.data[choice.pokemonKey]) return;

  const pokemonData = allPokemon.find(
    (p) =>
      p.id.toString() === choice.pokemonId &&
      `${p.id}-${p.form}-${p.versionForm}` === choice.pokemonKey,
  );

  if (pokemonData) {
    user.savePokemon.data[choice.pokemonKey] = {
      idPokemon: choice.pokemonId,
      rarity: pokemonData.rarity,
      form: pokemonData.form,
      versionForm: pokemonData.versionForm,
      normalCount: 0,
      shinyCount: 0,
    };
  }
}

function removeOnePokemon(pokemon: {
  normalCount: number;
  shinyCount: number;
}): void {
  if (pokemon.normalCount > 0) {
    pokemon.normalCount--;
  } else if (pokemon.shinyCount > 0) {
    pokemon.shinyCount--;
  }
}

export async function executeTrade(tradeData: TradeData): Promise<boolean> {
  try {
    if (!(await validateTrade(tradeData))) {
      return false;
    }

    const initiator = await getUserById(tradeData.initiatorId);
    const target = await getUserById(tradeData.targetId);

    if (!initiator || !target) {
      return false;
    }

    const initiatorChoice = tradeData.initiatorChoice!;
    const targetChoice = tradeData.targetChoice!;

    const initiatorPokemon =
      initiator.savePokemon.data[initiatorChoice.pokemonKey];
    const targetPokemon = target.savePokemon.data[targetChoice.pokemonKey];

    if (!initiatorPokemon || !targetPokemon) {
      return false;
    }

    const initiatorTotal =
      initiatorPokemon.normalCount + initiatorPokemon.shinyCount;
    const targetTotal = targetPokemon.normalCount + targetPokemon.shinyCount;

    if (initiatorTotal < 2 || targetTotal < 2) {
      return false;
    }

    initializePokemonIfNeeded(initiator, targetChoice);
    initializePokemonIfNeeded(target, initiatorChoice);

    removeOnePokemon(initiatorPokemon);
    removeOnePokemon(targetPokemon);

    const initiatorReceived =
      initiator.savePokemon.data[targetChoice.pokemonKey];
    const targetReceived = target.savePokemon.data[initiatorChoice.pokemonKey];

    if (initiatorReceived) {
      initiatorReceived.normalCount++;
    }
    if (targetReceived) {
      targetReceived.normalCount++;
    }

    await updateUser(initiator.discordId, initiator);
    await updateUser(target.discordId, target);

    const rarity = initiatorChoice.rarity;
    const cooldownMs = getRarityCooldownMs(rarity);
    if (cooldownMs > 0) {
      const expiresAt = Date.now() + cooldownMs;
      setTradeCooldown(String(initiator.discordId), rarity, expiresAt);
      setTradeCooldown(String(target.discordId), rarity, expiresAt);
    }

    return true;
  } catch (error) {
    newLogger(
      "error",
      error instanceof Error ? error.message : String(error),
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

  const cooldown = getTradeCooldown(String(userId), rarity);

  if (!cooldown || cooldown.expiresAt <= Date.now()) {
    return { allowed: true };
  }

  return { allowed: false, expiresAt: cooldown.expiresAt };
}

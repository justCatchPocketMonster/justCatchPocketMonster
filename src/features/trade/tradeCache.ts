import NodeCache from "node-cache";
import { ttlCache } from "../../config/default/misc";
import { newLogger } from "../../middlewares/logger";

export interface PokemonChoice {
  pokemonKey: string;
  pokemonId: string;
  rarity: string;
}

export interface TradeData {
  tradeId: string;
  initiatorId: string;
  targetId: string;
  serverId: string;
  status:
    | "pending"
    | "accepted"
    | "selecting"
    | "confirming"
    | "completed"
    | "cancelled";
  initiatorChoice?: PokemonChoice;
  targetChoice?: PokemonChoice;
  initiatorConfirmed?: boolean;
  targetConfirmed?: boolean;
  initiatorMessageId?: string;
  targetMessageId?: string;
  initiatorConfirmationMessageId?: string;
  targetConfirmationMessageId?: string;
  createdAt: number;
  expiresAt: number;
}

export interface TradeCooldown {
  userId: string;
  rarity: string;
  expiresAt: number;
}

export interface TradeBlock {
  userId: string;
  expiresAt: number;
}

const tradeCache = new NodeCache({ stdTTL: ttlCache });
const cooldownCache = new NodeCache({ stdTTL: ttlCache });
const blockCache = new NodeCache({ stdTTL: 604800 });

export function extractId(
  value: string | { discordId: string } | unknown,
): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "discordId" in value) {
    return String((value as { discordId: unknown }).discordId);
  }
  return String(value);
}

export function createTrade(tradeData: TradeData): void {
  const cleanData: TradeData = {
    ...tradeData,
    tradeId: String(tradeData.tradeId),
    initiatorId: extractId(tradeData.initiatorId),
    targetId: extractId(tradeData.targetId),
  };

  const ttl = Math.max(
    0,
    Math.floor((cleanData.expiresAt - Date.now()) / 1000),
  );

  try {
    tradeCache.set(cleanData.tradeId, cleanData, ttl);
    tradeCache.set(
      `trade_user_${cleanData.initiatorId}`,
      cleanData.tradeId,
      ttl,
    );
    tradeCache.set(`trade_user_${cleanData.targetId}`, cleanData.tradeId, ttl);
  } catch (error: any) {
    newLogger("error", error as string, "Error creating trade");
    throw error;
  }
}

export function getTrade(tradeId: string): TradeData | undefined {
  try {
    const trade = tradeCache.get<TradeData>(String(tradeId));
    if (!trade) return undefined;

    if (
      typeof trade.initiatorId !== "string" ||
      typeof trade.targetId !== "string"
    ) {
      const fixedTrade: TradeData = {
        ...trade,
        initiatorId: extractId(trade.initiatorId),
        targetId: extractId(trade.targetId),
      };
      const ttl = Math.max(
        0,
        Math.floor((fixedTrade.expiresAt - Date.now()) / 1000),
      );
      tradeCache.set(String(tradeId), fixedTrade, ttl);
      return fixedTrade;
    }

    return trade;
  } catch (error: any) {
    newLogger("error", error as string, "Error getting trade");
    throw error;
  }
}

export function getTradeByUserId(userId: string): TradeData | undefined {
  try {
    const tradeId = tradeCache.get<string>(`trade_user_${String(userId)}`);
    return tradeId ? getTrade(String(tradeId)) : undefined;
  } catch (error: any) {
    newLogger("error", error as string, "Error getting trade by user");
    throw error;
  }
}

export function updateTrade(
  tradeId: string,
  updates: Partial<TradeData>,
): void {
  const existing = getTrade(tradeId);
  if (!existing) return;

  const updated: TradeData = {
    ...existing,
    ...updates,
    initiatorId: extractId(existing.initiatorId),
    targetId: extractId(existing.targetId),
  };

  const ttl = Math.max(0, Math.floor((updated.expiresAt - Date.now()) / 1000));

  try {
    const safeTradeId = String(tradeId);
    tradeCache.set(safeTradeId, updated, ttl);
    tradeCache.set(`trade_user_${updated.initiatorId}`, safeTradeId, ttl);
    tradeCache.set(`trade_user_${updated.targetId}`, safeTradeId, ttl);
  } catch (error: any) {
    newLogger("error", error as string, "Error updating trade");
    throw error;
  }
}

export function deleteTrade(tradeId: string): void {
  const trade = getTrade(String(tradeId));
  if (trade) {
    tradeCache.del(`trade_user_${String(trade.initiatorId)}`);
    tradeCache.del(`trade_user_${String(trade.targetId)}`);
  }
  tradeCache.del(String(tradeId));
}

export function getUserActiveTrade(userId: string): TradeData | undefined {
  return getTradeByUserId(userId);
}

export function setTradeCooldown(
  userId: string,
  rarity: string,
  expiresAt: number,
): void {
  try {
    const cooldown: TradeCooldown = {
      userId: String(userId),
      rarity: String(rarity),
      expiresAt,
    };
    const ttl = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    cooldownCache.set(
      `cooldown_${String(userId)}_${String(rarity)}`,
      cooldown,
      ttl,
    );
  } catch (error: any) {
    newLogger("error", error as string, "Error setting cooldown");
    throw error;
  }
}

export function getTradeCooldown(
  userId: string,
  rarity: string,
): TradeCooldown | undefined {
  return cooldownCache.get<TradeCooldown>(
    `cooldown_${String(userId)}_${String(rarity)}`,
  );
}

export function setTradeBlock(userId: string, expiresAt: number): void {
  try {
    const block: TradeBlock = {
      userId: String(userId),
      expiresAt,
    };
    const ttl = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    blockCache.set(`block_${String(userId)}`, block, ttl);
  } catch (error: any) {
    newLogger("error", error as string, "Error setting block");
    throw error;
  }
}

export function getTradeBlock(userId: string): TradeBlock | undefined {
  return blockCache.get<TradeBlock>(`block_${String(userId)}`);
}

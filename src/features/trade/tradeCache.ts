import NodeCache from "node-cache";
import { ttlCache } from "../../config/default/misc";

export interface PokemonChoice {
  pokemonKey: string; // format: "id-form-versionForm"
  pokemonId: string;
  rarity: string;
}

export interface TradeData {
  tradeId: string;
  initiatorId: string;
  targetId: string;
  status:
    | "pending"
    | "accepted"
    | "selecting"
    | "confirming"
    | "completed"
    | "cancelled";
  initiatorChoice?: PokemonChoice;
  targetChoice?: PokemonChoice;
  initiatorMessageId?: string;
  targetMessageId?: string;
  createdAt: number;
  expiresAt: number;
}

export interface TradeCooldown {
  userId: string;
  rarity: string;
  expiresAt: number; // timestamp
}

export interface TradeBlock {
  userId: string;
  expiresAt: number; // timestamp for 1 week block
}

const tradeCache = new NodeCache({ stdTTL: ttlCache });
const cooldownCache = new NodeCache({ stdTTL: ttlCache });
const blockCache = new NodeCache({ stdTTL: 604800000 }); // 7 days TTL

export function createTrade(tradeData: TradeData): void {
  tradeCache.set(tradeData.tradeId, tradeData, tradeData.expiresAt);
  // Also store by userId for quick lookup
  tradeCache.set(`trade_user_${tradeData.initiatorId}`, tradeData.tradeId);
  tradeCache.set(`trade_user_${tradeData.targetId}`, tradeData.tradeId);
}

export function getTrade(tradeId: string): TradeData | undefined {
  return tradeCache.get<TradeData>(tradeId);
}

export function getTradeByUserId(userId: string): TradeData | undefined {
  const tradeId = tradeCache.get<string>(`trade_user_${userId}`);
  if (!tradeId) return undefined;
  return getTrade(tradeId);
}

export function updateTrade(tradeId: string, updates: Partial<TradeData>): void {
  const existing = getTrade(tradeId);
  if (!existing) return;

  const updated: TradeData = { ...existing, ...updates };
  tradeCache.set(tradeId, updated, updated.expiresAt);
  tradeCache.set(`trade_user_${updated.initiatorId}`, tradeId);
  tradeCache.set(`trade_user_${updated.targetId}`, tradeId);
}

export function deleteTrade(tradeId: string): void {
  const trade = getTrade(tradeId);
  if (trade) {
    tradeCache.del(`trade_user_${trade.initiatorId}`);
    tradeCache.del(`trade_user_${trade.targetId}`);
  }
  tradeCache.del(tradeId);
}

export function getUserActiveTrade(userId: string): TradeData | undefined {
  return getTradeByUserId(userId);
}

export function setTradeCooldown(
  userId: string,
  rarity: string,
  expiresAt: number,
): void {
  const cooldown: TradeCooldown = {
    userId,
    rarity,
    expiresAt,
  };
  const ttl = Math.max(0, expiresAt - Date.now());
  cooldownCache.set(`cooldown_${userId}_${rarity}`, cooldown, ttl);
}

export function getTradeCooldown(
  userId: string,
  rarity: string,
): TradeCooldown | undefined {
  return cooldownCache.get<TradeCooldown>(`cooldown_${userId}_${rarity}`);
}

export function setTradeBlock(userId: string, expiresAt: number): void {
  const block: TradeBlock = {
    userId,
    expiresAt,
  };
  const ttl = Math.max(0, expiresAt - Date.now());
  blockCache.set(`block_${userId}`, block, ttl);
}

export function getTradeBlock(userId: string): TradeBlock | undefined {
  return blockCache.get<TradeBlock>(`block_${userId}`);
}

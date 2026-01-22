import NodeCache from "node-cache";
import { ttlCache } from "../../config/default/misc";
import { newLogger } from "../../middlewares/logger";

export interface PokemonChoice {
  pokemonKey: string; // format: "id-form-versionForm"
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
const blockCache = new NodeCache({ stdTTL: 604800 }); // 7 days TTL in seconds

export function createTrade(tradeData: TradeData): void {
  let initiatorId: string;
  let targetId: string;
  let tradeId: string;
  
  if (typeof tradeData.initiatorId === "string") {
    initiatorId = tradeData.initiatorId;
  } else if (tradeData.initiatorId && typeof tradeData.initiatorId === "object" && "discordId" in tradeData.initiatorId) {
    initiatorId = String((tradeData.initiatorId as any).discordId);
    newLogger("warn", "createTrade: initiatorId was an object, extracted discordId");
  } else {
    initiatorId = String(tradeData.initiatorId);
    if (typeof tradeData.initiatorId !== "string") {
      newLogger("warn", "createTrade: initiatorId was not a string", `type=${typeof tradeData.initiatorId}`);
    }
  }
  
  if (typeof tradeData.targetId === "string") {
    targetId = tradeData.targetId;
  } else if (tradeData.targetId && typeof tradeData.targetId === "object" && "discordId" in tradeData.targetId) {
    targetId = String((tradeData.targetId as any).discordId);
    newLogger("warn", "createTrade: targetId was an object, extracted discordId");
  } else {
    targetId = String(tradeData.targetId);
    if (typeof tradeData.targetId !== "string") {
      newLogger("warn", "createTrade: targetId was not a string", `type=${typeof tradeData.targetId}`);
    }
  }
  
  tradeId = String(tradeData.tradeId);
  
  const cleanTradeData: TradeData = {
    ...tradeData,
    tradeId,
    initiatorId,
    targetId,
  };
  
  const ttl = Math.max(0, Math.floor((tradeData.expiresAt - Date.now()) / 1000));
  
  try {
    newLogger("debug", `createTrade: Setting trade with key=${tradeId}, type=${typeof tradeId}`);
    tradeCache.set(tradeId, cleanTradeData, ttl);
    
    const initiatorKey = `trade_user_${initiatorId}`;
    newLogger("debug", `createTrade: Setting initiator key=${initiatorKey}, type=${typeof initiatorKey}, initiatorId type=${typeof initiatorId}`);
    tradeCache.set(initiatorKey, tradeId, ttl);
    
    const targetKey = `trade_user_${targetId}`;
    newLogger("debug", `createTrade: Setting target key=${targetKey}, type=${typeof targetKey}, targetId type=${typeof targetId}`);
    tradeCache.set(targetKey, tradeId, ttl);
  } catch (error: any) {
    const stack = error?.stack || new Error().stack;
    newLogger("error", 
      "Error in createTrade cache.set",
      `function=createTrade`,
      `error=${error}`,
      `errorMessage=${error?.message || error}`,
      `tradeId=${tradeId}, type=${typeof tradeId}`,
      `initiatorId=${initiatorId}, type=${typeof initiatorId}`,
      `targetId=${targetId}, type=${typeof targetId}`,
      `stack=${stack}`
    );
    throw error;
  }
}

export function getTrade(tradeId: string): TradeData | undefined {
  try {
    const safeTradeId = String(tradeId);
    newLogger("debug", `getTrade: Getting trade with key=${safeTradeId}, type=${typeof safeTradeId}`);
    const trade = tradeCache.get<TradeData>(safeTradeId);
    if (!trade) return undefined;
  
  if (typeof trade.initiatorId !== "string" || typeof trade.targetId !== "string") {
    newLogger("warn", "getTrade: Found trade with non-string IDs, fixing", `tradeId=${tradeId}`);
    const fixedTrade: TradeData = {
      ...trade,
      initiatorId: typeof trade.initiatorId === "string" 
        ? trade.initiatorId 
        : String(trade.initiatorId && typeof trade.initiatorId === "object" && "discordId" in trade.initiatorId 
          ? (trade.initiatorId as any).discordId 
          : trade.initiatorId),
      targetId: typeof trade.targetId === "string"
        ? trade.targetId
        : String(trade.targetId && typeof trade.targetId === "object" && "discordId" in trade.targetId
          ? (trade.targetId as any).discordId
          : trade.targetId),
    };
    const ttl = Math.max(0, Math.floor((fixedTrade.expiresAt - Date.now()) / 1000));
    try {
      newLogger("debug", `getTrade: Fixing and setting trade with key=${String(tradeId)}`);
      tradeCache.set(String(tradeId), fixedTrade, ttl);
    } catch (error: any) {
      const stack = error?.stack || new Error().stack;
      newLogger("error",
        "Error in getTrade cache.set (fixing trade)",
        `function=getTrade`,
        `error=${error}`,
        `errorMessage=${error?.message || error}`,
        `tradeId=${tradeId}, type=${typeof tradeId}`,
        `stack=${stack}`
      );
      throw error;
    }
    return fixedTrade;
  }
  
  return trade;
  } catch (error: any) {
    const stack = error?.stack || new Error().stack;
    newLogger("error",
      "Error in getTrade cache.get",
      `function=getTrade`,
      `error=${error}`,
      `errorMessage=${error?.message || error}`,
      `tradeId=${tradeId}, type=${typeof tradeId}`,
      `stack=${stack}`
    );
    throw error;
  }
}

export function getTradeByUserId(userId: string): TradeData | undefined {
  try {
    const userKey = `trade_user_${String(userId)}`;
    newLogger("debug", `getTradeByUserId: Getting trade with user key=${userKey}, type=${typeof userKey}, userId type=${typeof userId}`);
    const tradeId = tradeCache.get<string>(userKey);
    if (!tradeId) return undefined;
    return getTrade(String(tradeId));
  } catch (error: any) {
    const stack = error?.stack || new Error().stack;
    newLogger("error",
      "Error in getTradeByUserId cache.get",
      `function=getTradeByUserId`,
      `error=${error}`,
      `errorMessage=${error?.message || error}`,
      `userId=${userId}, type=${typeof userId}`,
      `stack=${stack}`
    );
    throw error;
  }
}

export function updateTrade(tradeId: string, updates: Partial<TradeData>): void {
  const existing = getTrade(tradeId);
  if (!existing) return;

  if (typeof existing.initiatorId !== "string" || typeof existing.targetId !== "string") {
    newLogger("error", 
      `Invalid ID types in existing trade: initiatorId=${typeof existing.initiatorId}, targetId=${typeof existing.targetId}`,
      `tradeId=${tradeId}`
    );
  }

  const updated: TradeData = { ...existing, ...updates };
  
  let initiatorId: string;
  let targetId: string;
  
  if (typeof updated.initiatorId === "string") {
    initiatorId = updated.initiatorId;
  } else if (updated.initiatorId && typeof updated.initiatorId === "object" && "discordId" in updated.initiatorId) {
    initiatorId = String((updated.initiatorId as any).discordId);
    newLogger("warn", "initiatorId was an object, extracted discordId", `tradeId=${tradeId}`);
  } else {
    initiatorId = String(updated.initiatorId);
    newLogger("warn", "initiatorId was not a string, converted", `tradeId=${tradeId}`, `type=${typeof updated.initiatorId}`);
  }
  
  if (typeof updated.targetId === "string") {
    targetId = updated.targetId;
  } else if (updated.targetId && typeof updated.targetId === "object" && "discordId" in updated.targetId) {
    targetId = String((updated.targetId as any).discordId);
    newLogger("warn", "targetId was an object, extracted discordId", `tradeId=${tradeId}`);
  } else {
    targetId = String(updated.targetId);
    newLogger("warn", "targetId was not a string, converted", `tradeId=${tradeId}`, `type=${typeof updated.targetId}`);
  }
  
  const safeTradeId = String(tradeId);
  
  if (typeof safeTradeId !== "string") {
    newLogger("error", "safeTradeId is not a string", `type=${typeof safeTradeId}`, `value=${safeTradeId}`);
    return;
  }
  
  const finalInitiatorId = String(initiatorId);
  const finalTargetId = String(targetId);
  
  if (typeof finalInitiatorId !== "string" || typeof finalTargetId !== "string") {
    newLogger("error", 
      `Failed to convert IDs to strings: initiatorId type=${typeof finalInitiatorId}, targetId type=${typeof finalTargetId}`,
      `tradeId=${tradeId}`
    );
    return;
  }
  
  if (typeof initiatorId !== "string" || typeof targetId !== "string") {
    newLogger("error",
      `IDs are not strings after conversion: initiatorId type=${typeof initiatorId}, targetId type=${typeof targetId}`,
      `tradeId=${tradeId}`
    );
    return;
  }
  
  const cleanUpdated: TradeData = {
    ...updated,
    initiatorId: finalInitiatorId,
    targetId: finalTargetId,
  };
  
  const ttl = Math.max(0, Math.floor((updated.expiresAt - Date.now()) / 1000));
  
  try {
    newLogger("debug", `updateTrade: Setting trade with key=${safeTradeId}, type=${typeof safeTradeId}`);
    tradeCache.set(safeTradeId, cleanUpdated, ttl);
    
    const initiatorKey = `trade_user_${finalInitiatorId}`;
    newLogger("debug", `updateTrade: Setting initiator key=${initiatorKey}, type=${typeof initiatorKey}, initiatorId type=${typeof finalInitiatorId}, value=${finalInitiatorId}`);
    tradeCache.set(initiatorKey, safeTradeId, ttl);
    
    const targetKey = `trade_user_${finalTargetId}`;
    newLogger("debug", `updateTrade: Setting target key=${targetKey}, type=${typeof targetKey}, targetId type=${typeof finalTargetId}, value=${finalTargetId}`);
    tradeCache.set(targetKey, safeTradeId, ttl);
  } catch (error: any) {
    const stack = error?.stack || new Error().stack;
    newLogger("error", 
      "Error in updateTrade cache.set",
      `function=updateTrade`,
      `error=${error}`,
      `errorMessage=${error?.message || error}`,
      `safeTradeId=${safeTradeId}, type=${typeof safeTradeId}`,
      `finalInitiatorId=${finalInitiatorId}, type=${typeof finalInitiatorId}`,
      `finalTargetId=${finalTargetId}, type=${typeof finalTargetId}`,
      `initiatorId=${initiatorId}, type=${typeof initiatorId}`,
      `targetId=${targetId}, type=${typeof targetId}`,
      `stack=${stack}`
    );
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
    const cooldownKey = `cooldown_${String(userId)}_${String(rarity)}`;
    newLogger("debug", `setTradeCooldown: Setting cooldown with key=${cooldownKey}, type=${typeof cooldownKey}, userId type=${typeof userId}, rarity type=${typeof rarity}`);
    cooldownCache.set(cooldownKey, cooldown, ttl);
  } catch (error: any) {
    const stack = error?.stack || new Error().stack;
    newLogger("error",
      "Error in setTradeCooldown cache.set",
      `function=setTradeCooldown`,
      `error=${error}`,
      `errorMessage=${error?.message || error}`,
      `userId=${userId}, type=${typeof userId}`,
      `rarity=${rarity}, type=${typeof rarity}`,
      `stack=${stack}`
    );
    throw error;
  }
}

export function getTradeCooldown(
  userId: string,
  rarity: string,
): TradeCooldown | undefined {
  return cooldownCache.get<TradeCooldown>(`cooldown_${String(userId)}_${String(rarity)}`);
}

export function setTradeBlock(userId: string, expiresAt: number): void {
  try {
    const block: TradeBlock = {
      userId: String(userId),
      expiresAt,
    };
    const ttl = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    const blockKey = `block_${String(userId)}`;
    newLogger("debug", `setTradeBlock: Setting block with key=${blockKey}, type=${typeof blockKey}, userId type=${typeof userId}`);
    blockCache.set(blockKey, block, ttl);
  } catch (error: any) {
    const stack = error?.stack || new Error().stack;
    newLogger("error",
      "Error in setTradeBlock cache.set",
      `function=setTradeBlock`,
      `error=${error}`,
      `errorMessage=${error?.message || error}`,
      `userId=${userId}, type=${typeof userId}`,
      `stack=${stack}`
    );
    throw error;
  }
}

export function getTradeBlock(userId: string): TradeBlock | undefined {
  return blockCache.get<TradeBlock>(`block_${String(userId)}`);
}

import {
  createTrade,
  getTrade,
  getTradeByUserId,
  updateTrade,
  deleteTrade,
  getUserActiveTrade,
  setTradeCooldown,
  getTradeCooldown,
  setTradeBlock,
  getTradeBlock,
  TradeData,
} from "../../../../src/features/trade/tradeCache";
import { resetTestEnv } from "../../../utils/resetTestEnv";

describe("TradeCache", () => {
  beforeAll(async () => {
    await resetTestEnv();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTrade", () => {
    it("should create a trade successfully", () => {
      const tradeData: TradeData = {
        tradeId: "test_trade_1",
        initiatorId: "user1",
        targetId: "user2",
        serverId: "server1",
        status: "pending",
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      };

      expect(() => createTrade(tradeData)).not.toThrow();
      const trade = getTrade("test_trade_1");
      expect(trade).toBeDefined();
      expect(trade?.tradeId).toBe("test_trade_1");
      expect(trade?.initiatorId).toBe("user1");
      expect(trade?.targetId).toBe("user2");
    });

    it("should handle trade with object IDs", () => {
      const tradeData: TradeData = {
        tradeId: "test_trade_2",
        initiatorId: { discordId: "user3" } as any,
        targetId: { discordId: "user4" } as any,
        serverId: "server1",
        status: "pending",
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      };

      createTrade(tradeData);
      const trade = getTrade("test_trade_2");
      expect(trade?.initiatorId).toBe("user3");
      expect(trade?.targetId).toBe("user4");
    });
  });

  describe("getTrade", () => {
    it("should return undefined for non-existent trade", () => {
      const trade = getTrade("non_existent");
      expect(trade).toBeUndefined();
    });

    it("should return trade data", () => {
      const tradeData: TradeData = {
        tradeId: "test_trade_3",
        initiatorId: "user5",
        targetId: "user6",
        serverId: "server1",
        status: "pending",
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      };

      createTrade(tradeData);
      const trade = getTrade("test_trade_3");
      expect(trade).toBeDefined();
      expect(trade?.tradeId).toBe("test_trade_3");
    });

    it("should fix trade with non-string IDs", () => {
      const tradeData: TradeData = {
        tradeId: "test_trade_4",
        initiatorId: { discordId: "user7" } as any,
        targetId: { discordId: "user8" } as any,
        serverId: "server1",
        status: "pending",
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      };

      createTrade(tradeData);
      const trade = getTrade("test_trade_4");
      expect(trade?.initiatorId).toBe("user7");
      expect(trade?.targetId).toBe("user8");
    });
  });

  describe("getTradeByUserId", () => {
    it("should return trade for user", () => {
      const tradeData: TradeData = {
        tradeId: "test_trade_5",
        initiatorId: "user9",
        targetId: "user10",
        serverId: "server1",
        status: "pending",
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      };

      createTrade(tradeData);
      const trade = getTradeByUserId("user9");
      expect(trade).toBeDefined();
      expect(trade?.tradeId).toBe("test_trade_5");
    });

    it("should return undefined for user with no trade", () => {
      const trade = getTradeByUserId("user_no_trade");
      expect(trade).toBeUndefined();
    });
  });

  describe("updateTrade", () => {
    it("should update trade successfully", () => {
      const tradeData: TradeData = {
        tradeId: "test_trade_6",
        initiatorId: "user11",
        targetId: "user12",
        serverId: "server1",
        status: "pending",
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      };

      createTrade(tradeData);
      updateTrade("test_trade_6", { status: "accepted" });
      const trade = getTrade("test_trade_6");
      expect(trade?.status).toBe("accepted");
    });

    it("should not update non-existent trade", () => {
      expect(() => updateTrade("non_existent", { status: "accepted" })).not.toThrow();
    });
  });

  describe("deleteTrade", () => {
    it("should delete trade successfully", () => {
      const tradeData: TradeData = {
        tradeId: "test_trade_7",
        initiatorId: "user13",
        targetId: "user14",
        serverId: "server1",
        status: "pending",
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      };

      createTrade(tradeData);
      deleteTrade("test_trade_7");
      const trade = getTrade("test_trade_7");
      expect(trade).toBeUndefined();
    });

    it("should handle deleting non-existent trade", () => {
      expect(() => deleteTrade("non_existent")).not.toThrow();
    });
  });

  describe("getUserActiveTrade", () => {
    it("should return active trade for user", () => {
      const tradeData: TradeData = {
        tradeId: "test_trade_8",
        initiatorId: "user15",
        targetId: "user16",
        serverId: "server1",
        status: "pending",
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      };

      createTrade(tradeData);
      const trade = getUserActiveTrade("user15");
      expect(trade).toBeDefined();
      expect(trade?.tradeId).toBe("test_trade_8");
    });
  });

  describe("setTradeCooldown and getTradeCooldown", () => {
    it("should set and get cooldown", () => {
      const expiresAt = Date.now() + 86400000;
      setTradeCooldown("user17", "legendary", expiresAt);
      const cooldown = getTradeCooldown("user17", "legendary");
      expect(cooldown).toBeDefined();
      expect(cooldown?.userId).toBe("user17");
      expect(cooldown?.rarity).toBe("legendary");
      expect(cooldown?.expiresAt).toBe(expiresAt);
    });

    it("should return undefined for non-existent cooldown", () => {
      const cooldown = getTradeCooldown("user18", "fabulous");
      expect(cooldown).toBeUndefined();
    });
  });

  describe("setTradeBlock and getTradeBlock", () => {
    it("should set and get block", () => {
      const expiresAt = Date.now() + 604800000;
      setTradeBlock("user19", expiresAt);
      const block = getTradeBlock("user19");
      expect(block).toBeDefined();
      expect(block?.userId).toBe("user19");
      expect(block?.expiresAt).toBe(expiresAt);
    });

    it("should return undefined for non-existent block", () => {
      const block = getTradeBlock("user20");
      expect(block).toBeUndefined();
    });
  });
});

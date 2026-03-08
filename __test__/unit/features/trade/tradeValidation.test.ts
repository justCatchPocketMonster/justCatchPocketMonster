import {
  validateTrade,
  executeTrade,
  checkCooldown,
} from "../../../../src/features/trade/tradeValidation";
import { TradeData } from "../../../../src/features/trade/tradeCache";
import { resetTestEnv } from "../../../utils/resetTestEnv";
import { getUserById } from "../../../../src/cache/UserCache";
import { updateUser } from "../../../../src/cache/UserCache";
import {
  setTradeCooldown,
  getTradeCooldown,
} from "../../../../src/features/trade/tradeCache";

jest.mock("../../../../src/cache/UserCache", () => {
  const actual = jest.requireActual("../../../../src/cache/UserCache");
  return {
    ...actual,
    getUserById: jest.fn(),
    updateUser: jest.fn(),
  };
});

jest.mock("../../../../src/features/trade/tradeCache", () => {
  const actual = jest.requireActual(
    "../../../../src/features/trade/tradeCache",
  );
  return {
    ...actual,
    setTradeCooldown: jest.fn(),
    getTradeCooldown: jest.fn(),
  };
});

describe("TradeValidation", () => {
  beforeAll(async () => {
    await resetTestEnv();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validateTrade", () => {
    it("should return false when choices are missing", async () => {
      const tradeData: TradeData = {
        tradeId: "test_trade",
        initiatorId: "user1",
        targetId: "user2",
        serverId: "server1",
        status: "selecting",
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      };

      const isValid = await validateTrade(tradeData);
      expect(isValid).toBe(false);
    });

    it("should return false when rarity mismatch", async () => {
      const tradeData: TradeData = {
        tradeId: "test_trade",
        initiatorId: "user3",
        targetId: "user4",
        serverId: "server1",
        status: "confirming",
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        initiatorChoice: {
          pokemonKey: "25-ordinary-1",
          pokemonId: "25",
          rarity: "ordinary",
        },
        targetChoice: {
          pokemonKey: "144-ordinary-1",
          pokemonId: "144",
          rarity: "legendary",
        },
      };

      const initiator = {
        discordId: "user3",
        savePokemon: {
          data: {
            "25-ordinary-1": {
              idPokemon: "25",
              rarity: "ordinary",
              form: "ordinary",
              versionForm: 1,
              normalCount: 3,
              shinyCount: 0,
            },
          },
        },
      };

      const target = {
        discordId: "user4",
        savePokemon: {
          data: {
            "144-ordinary-1": {
              idPokemon: "144",
              rarity: "legendary",
              form: "ordinary",
              versionForm: 1,
              normalCount: 2,
              shinyCount: 0,
            },
          },
        },
      };

      (getUserById as jest.Mock).mockImplementation(async (id: string) => {
        if (id === "user3") return initiator;
        if (id === "user4") return target;
        return null;
      });

      const isValid = await validateTrade(tradeData);
      expect(isValid).toBe(false);
    });

    it("should return false when pokemon not found", async () => {
      const tradeData: TradeData = {
        tradeId: "test_trade",
        initiatorId: "user5",
        targetId: "user6",
        serverId: "server1",
        status: "confirming",
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        initiatorChoice: {
          pokemonKey: "25-ordinary-1",
          pokemonId: "25",
          rarity: "ordinary",
        },
        targetChoice: {
          pokemonKey: "1-ordinary-1",
          pokemonId: "1",
          rarity: "ordinary",
        },
      };

      const initiator = {
        discordId: "user5",
        savePokemon: {
          data: {},
        },
      };

      const target = {
        discordId: "user6",
        savePokemon: {
          data: {},
        },
      };

      (getUserById as jest.Mock).mockImplementation(async (id: string) => {
        if (id === "user5") return initiator;
        if (id === "user6") return target;
        return null;
      });

      const isValid = await validateTrade(tradeData);
      expect(isValid).toBe(false);
    });

    it("should return false when count < 2", async () => {
      const tradeData: TradeData = {
        tradeId: "test_trade",
        initiatorId: "user7",
        targetId: "user8",
        serverId: "server1",
        status: "confirming",
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        initiatorChoice: {
          pokemonKey: "25-ordinary-1",
          pokemonId: "25",
          rarity: "ordinary",
        },
        targetChoice: {
          pokemonKey: "1-ordinary-1",
          pokemonId: "1",
          rarity: "ordinary",
        },
      };

      const initiator = {
        discordId: "user7",
        savePokemon: {
          data: {
            "25-ordinary-1": {
              idPokemon: "25",
              rarity: "ordinary",
              form: "ordinary",
              versionForm: 1,
              normalCount: 1,
              shinyCount: 0,
            },
          },
        },
      };

      const target = {
        discordId: "user8",
        savePokemon: {
          data: {
            "1-ordinary-1": {
              idPokemon: "1",
              rarity: "ordinary",
              form: "ordinary",
              versionForm: 1,
              normalCount: 1,
              shinyCount: 0,
            },
          },
        },
      };

      (getUserById as jest.Mock).mockImplementation(async (id: string) => {
        if (id === "user7") return initiator;
        if (id === "user8") return target;
        return null;
      });

      const isValid = await validateTrade(tradeData);
      expect(isValid).toBe(false);
    });

    it("should return true when valid", async () => {
      const tradeData: TradeData = {
        tradeId: "test_trade",
        initiatorId: "user9",
        targetId: "user10",
        serverId: "server1",
        status: "confirming",
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        initiatorChoice: {
          pokemonKey: "25-ordinary-1",
          pokemonId: "25",
          rarity: "ordinary",
        },
        targetChoice: {
          pokemonKey: "1-ordinary-1",
          pokemonId: "1",
          rarity: "ordinary",
        },
      };

      const initiator = {
        discordId: "user9",
        savePokemon: {
          data: {
            "25-ordinary-1": {
              idPokemon: "25",
              rarity: "ordinary",
              form: "ordinary",
              versionForm: 1,
              normalCount: 3,
              shinyCount: 0,
            },
          },
        },
      };

      const target = {
        discordId: "user10",
        savePokemon: {
          data: {
            "1-ordinary-1": {
              idPokemon: "1",
              rarity: "ordinary",
              form: "ordinary",
              versionForm: 1,
              normalCount: 2,
              shinyCount: 0,
            },
          },
        },
      };

      (getUserById as jest.Mock).mockImplementation(async (id: string) => {
        if (id === "user9") return initiator;
        if (id === "user10") return target;
        return null;
      });

      const isValid = await validateTrade(tradeData);
      expect(isValid).toBe(true);
    });
  });

  describe("executeTrade", () => {
    it("should decrement shinyCount when normalCount is 0 (shiny-only pokemon)", async () => {
      const tradeData: TradeData = {
        tradeId: "test_trade_shiny",
        initiatorId: "user_sh1",
        targetId: "user_sh2",
        serverId: "server1",
        status: "confirming",
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        initiatorChoice: {
          pokemonKey: "25-ordinary-1",
          pokemonId: "25",
          rarity: "ordinary",
        },
        targetChoice: {
          pokemonKey: "1-ordinary-1",
          pokemonId: "1",
          rarity: "ordinary",
        },
      };

      const initiatorData = {
        "25-ordinary-1": {
          idPokemon: "25",
          rarity: "ordinary",
          form: "ordinary",
          versionForm: 1,
          normalCount: 0,
          shinyCount: 3,
        },
      };
      const targetData = {
        "1-ordinary-1": {
          idPokemon: "1",
          rarity: "ordinary",
          form: "ordinary",
          versionForm: 1,
          normalCount: 3,
          shinyCount: 0,
        },
      };

      (getUserById as jest.Mock).mockImplementation(async (id: string) => {
        if (id === "user_sh1")
          return { discordId: "user_sh1", savePokemon: { data: initiatorData } };
        if (id === "user_sh2")
          return { discordId: "user_sh2", savePokemon: { data: targetData } };
        return null;
      });
      (updateUser as jest.Mock).mockResolvedValue(undefined);

      const result = await executeTrade(tradeData);
      expect(result).toBe(true);
      expect(initiatorData["25-ordinary-1"].shinyCount).toBe(2);
    });

    it("should handle null targetReceived when target pokemon key not in allPokemon", async () => {
      const tradeData: TradeData = {
        tradeId: "test_trade_nullreceived",
        initiatorId: "user_nr1",
        targetId: "user_nr2",
        serverId: "server1",
        status: "confirming",
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        initiatorChoice: {
          pokemonKey: "9999-ordinary-1",
          pokemonId: "9999",
          rarity: "ordinary",
        },
        targetChoice: {
          pokemonKey: "25-ordinary-1",
          pokemonId: "25",
          rarity: "ordinary",
        },
      };

      type PokemonEntry = {
        idPokemon: string;
        rarity: string;
        form: string;
        versionForm: number;
        normalCount: number;
        shinyCount: number;
      };
      const initiatorData: Record<string, PokemonEntry> = {
        "9999-ordinary-1": {
          idPokemon: "9999",
          rarity: "ordinary",
          form: "ordinary",
          versionForm: 1,
          normalCount: 3,
          shinyCount: 0,
        },
      };
      const targetData: Record<string, PokemonEntry> = {
        "25-ordinary-1": {
          idPokemon: "25",
          rarity: "ordinary",
          form: "ordinary",
          versionForm: 1,
          normalCount: 3,
          shinyCount: 0,
        },
      };

      (getUserById as jest.Mock).mockImplementation(async (id: string) => {
        if (id === "user_nr1")
          return { discordId: "user_nr1", savePokemon: { data: initiatorData } };
        if (id === "user_nr2")
          return { discordId: "user_nr2", savePokemon: { data: targetData } };
        return null;
      });
      (updateUser as jest.Mock).mockResolvedValue(undefined);

      const result = await executeTrade(tradeData);
      expect(result).toBe(true);
      // initiator receives Pikachu (25, exists in allPokemon) → normalCount++
      expect(initiatorData["25-ordinary-1"]).toBeDefined();
      // target would receive 9999 (not in allPokemon) → targetReceived is null → no increment
    });

    it("should return false and log error when getUserById throws during execution", async () => {
      const tradeData: TradeData = {
        tradeId: "test_trade_err",
        initiatorId: "user_e1",
        targetId: "user_e2",
        serverId: "server1",
        status: "confirming",
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        initiatorChoice: {
          pokemonKey: "25-ordinary-1",
          pokemonId: "25",
          rarity: "ordinary",
        },
        targetChoice: {
          pokemonKey: "1-ordinary-1",
          pokemonId: "1",
          rarity: "ordinary",
        },
      };

      const validUser = (discordId: string, pokemonKey: string) => ({
        discordId,
        savePokemon: {
          data: {
            [pokemonKey]: {
              idPokemon: pokemonKey.split("-")[0],
              rarity: "ordinary",
              form: "ordinary",
              versionForm: 1,
              normalCount: 3,
              shinyCount: 0,
            },
          },
        },
      });

      let callCount = 0;
      (getUserById as jest.Mock).mockImplementation(async (id: string) => {
        callCount++;
        if (callCount <= 2) {
          if (id === "user_e1") return validUser("user_e1", "25-ordinary-1");
          if (id === "user_e2") return validUser("user_e2", "1-ordinary-1");
        }
        throw new Error("DB error during execution");
      });

      const result = await executeTrade(tradeData);
      expect(result).toBe(false);
    });

    it("should return false when validation fails", async () => {
      const tradeData: TradeData = {
        tradeId: "test_trade",
        initiatorId: "user11",
        targetId: "user12",
        serverId: "server1",
        status: "confirming",
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      };

      const result = await executeTrade(tradeData);
      expect(result).toBe(false);
    });

    it("should execute trade successfully", async () => {
      const tradeData: TradeData = {
        tradeId: "test_trade",
        initiatorId: "user13",
        targetId: "user14",
        serverId: "server1",
        status: "confirming",
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        initiatorChoice: {
          pokemonKey: "25-ordinary-1",
          pokemonId: "25",
          rarity: "ordinary",
        },
        targetChoice: {
          pokemonKey: "1-ordinary-1",
          pokemonId: "1",
          rarity: "ordinary",
        },
      };

      const initiator = {
        discordId: "user13",
        savePokemon: {
          data: {
            "25-ordinary-1": {
              idPokemon: "25",
              rarity: "ordinary",
              form: "ordinary",
              versionForm: 1,
              normalCount: 3,
              shinyCount: 0,
            },
          },
        },
      };

      const target = {
        discordId: "user14",
        savePokemon: {
          data: {
            "1-ordinary-1": {
              idPokemon: "1",
              rarity: "ordinary",
              form: "ordinary",
              versionForm: 1,
              normalCount: 2,
              shinyCount: 0,
            },
          },
        },
      };

      (getUserById as jest.Mock).mockImplementation(async (id: string) => {
        if (id === "user13") return { ...initiator };
        if (id === "user14") return { ...target };
        return null;
      });

      (updateUser as jest.Mock).mockResolvedValue(undefined);
      (setTradeCooldown as jest.Mock).mockImplementation(() => {});

      const result = await executeTrade(tradeData);
      expect(result).toBe(true);
      expect(updateUser).toHaveBeenCalledTimes(2);
    });
  });

  describe("checkCooldown", () => {
    it("should return allowed true for no cooldown rarity", () => {
      const result = checkCooldown("user15", "ordinary");
      expect(result.allowed).toBe(true);
      expect(result.expiresAt).toBeUndefined();
    });

    it("should return allowed true when cooldown expired", () => {
      (getTradeCooldown as jest.Mock).mockReturnValue({
        userId: "user16",
        rarity: "legendary",
        expiresAt: Date.now() - 1000,
      });

      const result = checkCooldown("user16", "legendary");
      expect(result.allowed).toBe(true);
    });

    it("should return allowed false when cooldown active", () => {
      const expiresAt = Date.now() + 86400000;
      (getTradeCooldown as jest.Mock).mockReturnValue({
        userId: "user17",
        rarity: "legendary",
        expiresAt,
      });

      const result = checkCooldown("user17", "legendary");
      expect(result.allowed).toBe(false);
      expect(result.expiresAt).toBe(expiresAt);
    });
  });
});

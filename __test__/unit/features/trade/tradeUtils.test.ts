import {
  calculateCooldownRemaining,
  isPokemonEligible,
  getEligiblePokemon,
  createEmbedAsk,
  createTradeSummaryEmbed,
  getRarityCooldownMs,
} from "../../../../src/features/trade/tradeUtils";
import { SaveOnePokemon } from "../../../../src/core/classes/SaveOnePokemon";
import { UserType } from "../../../../src/core/types/UserType";
import { ServerType } from "../../../../src/core/types/ServerType";
import { TradeData } from "../../../../src/features/trade/tradeCache";
import { setTradeCooldown } from "../../../../src/features/trade/tradeCache";
import { resetTestEnv } from "../../../utils/resetTestEnv";
import { getUserById } from "../../../../src/cache/UserCache";

jest.mock("../../../../src/cache/UserCache", () => {
  const actual = jest.requireActual("../../../../src/cache/UserCache");
  return {
    ...actual,
    getUserById: jest.fn(),
  };
});

describe("TradeUtils", () => {
  beforeAll(async () => {
    await resetTestEnv();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("calculateCooldownRemaining", () => {
    it("should return null when no cooldown exists", () => {
      const remaining = calculateCooldownRemaining("user1", "legendary");
      expect(remaining).toBeNull();
    });

    it("should return null when cooldown expired", () => {
      setTradeCooldown("user2", "legendary", Date.now() - 1000);
      const remaining = calculateCooldownRemaining("user2", "legendary");
      expect(remaining).toBeNull();
    });

    it("should return remaining time when cooldown active", () => {
      const expiresAt = Date.now() + 86400000;
      setTradeCooldown("user3", "legendary", expiresAt);
      const remaining = calculateCooldownRemaining("user3", "legendary");
      expect(remaining).toBeGreaterThan(0);
      expect(remaining).toBeLessThanOrEqual(86400000);
    });
  });

  describe("isPokemonEligible", () => {
    it("should return false when total count < 2", () => {
      const pokemon: SaveOnePokemon = {
        idPokemon: "25",
        rarity: "ordinary",
        form: "ordinary",
        versionForm: 1,
        normalCount: 1,
        shinyCount: 0,
      };

      expect(isPokemonEligible(pokemon)).toBe(false);
    });

    it("should return true when total count >= 2", () => {
      const pokemon: SaveOnePokemon = {
        idPokemon: "25",
        rarity: "ordinary",
        form: "ordinary",
        versionForm: 1,
        normalCount: 2,
        shinyCount: 0,
      };

      expect(isPokemonEligible(pokemon)).toBe(true);
    });

    it("should return false when rarity mismatch", () => {
      const pokemon: SaveOnePokemon = {
        idPokemon: "25",
        rarity: "ordinary",
        form: "ordinary",
        versionForm: 1,
        normalCount: 5,
        shinyCount: 0,
      };

      expect(isPokemonEligible(pokemon, "legendary")).toBe(false);
    });

    it("should return true when rarity matches", () => {
      const pokemon: SaveOnePokemon = {
        idPokemon: "144",
        rarity: "legendary",
        form: "ordinary",
        versionForm: 1,
        normalCount: 3,
        shinyCount: 0,
      };

      expect(isPokemonEligible(pokemon, "legendary")).toBe(true);
    });
  });

  describe("getEligiblePokemon", () => {
    it("should return empty array when user has no eligible pokemon", async () => {
      const user: UserType = {
        discordId: "user4",
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
      } as any;

      const eligible = getEligiblePokemon(user);
      expect(eligible).toEqual([]);
    });

    it("should return eligible pokemon", async () => {
      const user: UserType = {
        discordId: "user5",
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
      } as any;

      const eligible = getEligiblePokemon(user);
      expect(eligible.length).toBeGreaterThan(0);
      expect(eligible[0].key).toBe("25-ordinary-1");
    });

    it("should filter by required rarity", async () => {
      const user: UserType = {
        discordId: "user6",
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
      } as any;

      const eligible = getEligiblePokemon(user, "legendary");
      expect(eligible.length).toBe(1);
      expect(eligible[0].key).toBe("144-ordinary-1");
    });
  });

  describe("createEmbedAsk", () => {
    it("should create embed for initiator", () => {
      const tradeData: TradeData = {
        tradeId: "test_trade",
        initiatorId: "user7",
        targetId: "user8",
        serverId: "server1",
        status: "pending",
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      };

      const server: ServerType = {
        discordId: "server1",
        settings: { language: "eng" },
      } as any;

      const embed = createEmbedAsk(
        tradeData,
        server,
        true,
        "Initiator",
        "Target",
      );
      expect(embed).toBeDefined();
      expect(embed.data.title).toBeDefined();
    });

    it("should create embed for target", () => {
      const tradeData: TradeData = {
        tradeId: "test_trade",
        initiatorId: "user9",
        targetId: "user10",
        serverId: "server1",
        status: "pending",
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      };

      const server: ServerType = {
        discordId: "server1",
        settings: { language: "eng" },
      } as any;

      const embed = createEmbedAsk(
        tradeData,
        server,
        false,
        "Initiator",
        "Target",
      );
      expect(embed).toBeDefined();
      expect(embed.data.title).toBeDefined();
    });
  });

  describe("createTradeSummaryEmbed", () => {
    it("should create summary embed with choices", () => {
      const tradeData: TradeData = {
        tradeId: "test_trade",
        initiatorId: "user11",
        targetId: "user12",
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

      const server: ServerType = {
        discordId: "server1",
        settings: { language: "eng" },
      } as any;

      const embed = createTradeSummaryEmbed(
        tradeData,
        server,
        true,
        "Initiator",
        "Target",
      );
      expect(embed).toBeDefined();
      expect(embed.data.description).toBeDefined();
    });

    it("should handle missing choices", () => {
      const tradeData: TradeData = {
        tradeId: "test_trade",
        initiatorId: "user13",
        targetId: "user14",
        serverId: "server1",
        status: "selecting",
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      };

      const server: ServerType = {
        discordId: "server1",
        settings: { language: "eng" },
      } as any;

      const embed = createTradeSummaryEmbed(
        tradeData,
        server,
        true,
        "Initiator",
        "Target",
      );
      expect(embed).toBeDefined();
    });
  });

  describe("getRarityCooldownMs", () => {
    it("should return cooldown for legendary", () => {
      expect(getRarityCooldownMs("legendary")).toBe(86400000);
    });

    it("should return cooldown for mythical", () => {
      expect(getRarityCooldownMs("mythical")).toBe(604800000);
    });

    it("should return cooldown for ultraBeast", () => {
      expect(getRarityCooldownMs("ultraBeast")).toBe(86400000);
    });

    it("should return 0 for unknown rarity", () => {
      expect(getRarityCooldownMs("unknown")).toBe(0);
    });
  });
});

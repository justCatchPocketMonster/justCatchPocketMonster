import { handlePokemonSelection } from "../../../../src/features/trade/tradeSelection";
import {
  TradeData,
  createTrade,
  getTrade,
} from "../../../../src/features/trade/tradeCache";
import { resetTestEnv } from "../../../utils/resetTestEnv";
import { getUserById } from "../../../../src/cache/UserCache";

jest.mock("../../../../src/cache/UserCache", () => {
  const actual = jest.requireActual("../../../../src/cache/UserCache");
  return {
    ...actual,
    getUserById: jest.fn(),
  };
});

jest.mock("../../../../src/features/trade/tradeConfirmation", () => ({
  sendConfirmationEmbeds: jest.fn(),
}));

describe("TradeSelection", () => {
  beforeAll(async () => {
    await resetTestEnv();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return early when trade not found", async () => {
    const server = {
      discordId: "server1",
      settings: { language: "eng" },
    };

    await handlePokemonSelection(
      "non_existent",
      "user1",
      "25-ordinary-1",
      server,
    );
    const trade = getTrade("non_existent");
    expect(trade).toBeUndefined();
  });

  it("should return early when pokemon data not found", async () => {
    const tradeData: TradeData = {
      tradeId: "test_trade_1",
      initiatorId: "user2",
      targetId: "user3",
      serverId: "server1",
      status: "accepted",
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    createTrade(tradeData);

    const server = {
      discordId: "server1",
      settings: { language: "eng" },
    };

    await handlePokemonSelection(
      "test_trade_1",
      "user2",
      "invalid-key",
      server,
    );
    const trade = getTrade("test_trade_1");
    expect(trade?.initiatorChoice).toBeUndefined();
  });

  it("should update initiator choice", async () => {
    const tradeData: TradeData = {
      tradeId: "test_trade_2",
      initiatorId: "user4",
      targetId: "user5",
      serverId: "server1",
      status: "accepted",
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    createTrade(tradeData);

    const server = {
      discordId: "server1",
      settings: { language: "eng" },
    };

    await handlePokemonSelection(
      "test_trade_2",
      "user4",
      "25-ordinary-1",
      server,
    );
    const trade = getTrade("test_trade_2");
    expect(trade?.initiatorChoice).toBeDefined();
    expect(trade?.initiatorChoice?.pokemonKey).toBe("25-ordinary-1");
    expect(trade?.status).toBe("selecting");
  });

  it("should update target choice", async () => {
    const tradeData: TradeData = {
      tradeId: "test_trade_3",
      initiatorId: "user6",
      targetId: "user7",
      serverId: "server1",
      status: "accepted",
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    createTrade(tradeData);

    const server = {
      discordId: "server1",
      settings: { language: "eng" },
    };

    await handlePokemonSelection(
      "test_trade_3",
      "user7",
      "1-ordinary-1",
      server,
    );
    const trade = getTrade("test_trade_3");
    expect(trade?.targetChoice).toBeDefined();
    expect(trade?.targetChoice?.pokemonKey).toBe("1-ordinary-1");
    expect(trade?.status).toBe("selecting");
  });

  it("should set status to confirming when both choices exist", async () => {
    const tradeData: TradeData = {
      tradeId: "test_trade_4",
      initiatorId: "user8",
      targetId: "user9",
      serverId: "server1",
      status: "accepted",
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
      initiatorChoice: {
        pokemonKey: "25-ordinary-1",
        pokemonId: "25",
        rarity: "ordinary",
      },
    };

    createTrade(tradeData);

    const server = {
      discordId: "server1",
      settings: { language: "eng" },
    };

    await handlePokemonSelection(
      "test_trade_4",
      "user9",
      "1-ordinary-1",
      server,
    );
    const trade = getTrade("test_trade_4");
    expect(trade?.status).toBe("confirming");
  });

  it("should reset confirmations when both choices exist", async () => {
    const tradeData: TradeData = {
      tradeId: "test_trade_5",
      initiatorId: "user10",
      targetId: "user11",
      serverId: "server1",
      status: "confirming",
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
      initiatorChoice: {
        pokemonKey: "25-ordinary-1",
        pokemonId: "25",
        rarity: "ordinary",
      },
      initiatorConfirmed: true,
      targetConfirmed: true,
    };

    createTrade(tradeData);

    const server = {
      discordId: "server1",
      settings: { language: "eng" },
    };

    await handlePokemonSelection(
      "test_trade_5",
      "user11",
      "1-ordinary-1",
      server,
    );
    const trade = getTrade("test_trade_5");
    expect(trade?.initiatorConfirmed).toBe(false);
    expect(trade?.targetConfirmed).toBe(false);
  });

  it("should handle rarity mismatch", async () => {
    const tradeData: TradeData = {
      tradeId: "test_trade_6",
      initiatorId: "user12",
      targetId: "user13",
      serverId: "server1",
      status: "accepted",
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
      initiatorChoice: {
        pokemonKey: "25-ordinary-1",
        pokemonId: "25",
        rarity: "ordinary",
      },
    };

    createTrade(tradeData);

    const mockClient = {
      users: {
        fetch: jest.fn().mockResolvedValue({
          createDM: jest.fn().mockResolvedValue({
            send: jest.fn().mockResolvedValue({}),
          }),
        }),
      },
    };

    const server = {
      discordId: "server1",
      settings: { language: "eng" },
    };

    await handlePokemonSelection(
      "test_trade_6",
      "user13",
      "144-ordinary-1",
      server,
      mockClient,
    );
    const trade = getTrade("test_trade_6");
    expect(trade?.status).toBe("accepted");
    expect(trade?.initiatorChoice).toBeUndefined();
    expect(trade?.targetChoice).toBeUndefined();
  });
});

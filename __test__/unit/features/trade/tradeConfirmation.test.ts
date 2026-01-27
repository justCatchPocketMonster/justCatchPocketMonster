import { sendConfirmationEmbeds } from "../../../../src/features/trade/tradeConfirmation";
import { TradeData } from "../../../../src/features/trade/tradeCache";
import { getUserById } from "../../../../src/cache/UserCache";
import { resetTestEnv } from "../../../utils/resetTestEnv";

jest.mock("../../../../src/cache/UserCache", () => {
  const actual = jest.requireActual("../../../../src/cache/UserCache");
  return {
    ...actual,
    getUserById: jest.fn(),
  };
});

jest.mock("../../../../src/features/trade/tradeUtils", () => ({
  createTradeSummaryEmbed: jest.fn().mockReturnValue({
    addFields: jest.fn().mockReturnThis(),
  }),
}));

describe("TradeConfirmation", () => {
  beforeAll(async () => {
    await resetTestEnv();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send confirmation embeds", async () => {
    const tradeData: TradeData = {
      tradeId: "test_trade",
      initiatorId: "user1",
      targetId: "user2",
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
      discordId: "user1",
      savePokemon: { data: {} },
    };

    const target = {
      discordId: "user2",
      savePokemon: { data: {} },
    };

    (getUserById as jest.Mock).mockImplementation(async (id: string) => {
      if (id === "user1") return initiator;
      if (id === "user2") return target;
      return null;
    });

    const mockClient = {
      users: {
        fetch: jest.fn().mockResolvedValue({
          username: "TestUser",
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

    await sendConfirmationEmbeds(tradeData, server, mockClient);

    expect(mockClient.users.fetch).toHaveBeenCalledTimes(2);
    expect(getUserById).toHaveBeenCalledTimes(2);
  });

  it("should handle missing users", async () => {
    const tradeData: TradeData = {
      tradeId: "test_trade_2",
      initiatorId: "user3",
      targetId: "user4",
      serverId: "server1",
      status: "confirming",
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    const mockClient = {
      users: {
        fetch: jest.fn().mockResolvedValue(null),
      },
    };

    const server = {
      discordId: "server1",
      settings: { language: "eng" },
    };

    await sendConfirmationEmbeds(tradeData, server, mockClient);
    expect(mockClient.users.fetch).toHaveBeenCalled();
  });
});

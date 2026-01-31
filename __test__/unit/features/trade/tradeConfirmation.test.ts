import { sendConfirmationEmbeds } from "../../../../src/features/trade/tradeConfirmation";
import {
  TradeData,
  updateTrade,
} from "../../../../src/features/trade/tradeCache";
import { resetTestEnv } from "../../../utils/resetTestEnv";

jest.mock("../../../../src/features/trade/tradeCache", () => {
  const actual = jest.requireActual(
    "../../../../src/features/trade/tradeCache",
  );
  return {
    ...actual,
    updateTrade: jest.fn(),
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

    const mockSend = jest.fn().mockResolvedValue({ id: "msg_123" });
    const mockClient = {
      users: {
        fetch: jest.fn().mockResolvedValue({
          username: "TestUser",
          createDM: jest.fn().mockResolvedValue({
            send: mockSend,
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
    expect(mockSend).toHaveBeenCalledTimes(2);
    expect(updateTrade).toHaveBeenCalledWith("test_trade", {
      initiatorConfirmationMessageId: "msg_123",
      targetConfirmationMessageId: "msg_123",
    });
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

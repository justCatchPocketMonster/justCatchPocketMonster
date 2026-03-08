import { sendConfirmationEmbeds } from "../../../../src/features/trade/tradeConfirmation";
import {
  TradeData,
  updateTrade,
} from "../../../../src/features/trade/tradeCache";
import type { ServerType } from "../../../../src/core/types/ServerType";
import type { Client } from "discord.js";
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
    } as ServerType;

    await sendConfirmationEmbeds(
      tradeData,
      server,
      mockClient as unknown as Client,
    );

    expect(mockClient.users.fetch).toHaveBeenCalledTimes(2);
    expect(mockSend).toHaveBeenCalledTimes(2);
    expect(updateTrade).toHaveBeenCalledWith("test_trade", {
      initiatorConfirmationMessageId: "msg_123",
      targetConfirmationMessageId: "msg_123",
    });
  });

  it("should edit existing confirmation messages when both exist", async () => {
    const tradeData: TradeData = {
      tradeId: "test_trade_edit",
      initiatorId: "user1",
      targetId: "user2",
      serverId: "server1",
      status: "confirming",
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
      initiatorConfirmationMessageId: "msg_init",
      targetConfirmationMessageId: "msg_targ",
    };

    const mockEdit = jest.fn().mockResolvedValue(undefined);
    const mockClient = {
      users: {
        fetch: jest.fn().mockResolvedValue({
          username: "TestUser",
          createDM: jest.fn().mockResolvedValue({
            messages: {
              fetch: jest.fn().mockResolvedValue({ edit: mockEdit }),
            },
          }),
        }),
      },
    };

    const server = {
      discordId: "server1",
      settings: { language: "eng" },
    } as ServerType;

    await sendConfirmationEmbeds(
      tradeData,
      server,
      mockClient as unknown as Client,
    );

    expect(mockEdit).toHaveBeenCalledTimes(2);
    expect(updateTrade).not.toHaveBeenCalled();
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
    } as ServerType;

    await sendConfirmationEmbeds(
      tradeData,
      server,
      mockClient as unknown as Client,
    );
    expect(mockClient.users.fetch).toHaveBeenCalled();
  });
});

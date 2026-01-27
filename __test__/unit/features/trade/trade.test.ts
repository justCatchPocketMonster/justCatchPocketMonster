import { initiateTrade } from "../../../../src/features/trade/trade";
import { Client, User as DiscordUser } from "discord.js";
import { UserType } from "../../../../src/core/types/UserType";
import { ServerType } from "../../../../src/core/types/ServerType";
import {
  createTrade,
  getTrade,
  getUserActiveTrade,
  getTradeBlock,
  deleteTrade,
  TradeData,
} from "../../../../src/features/trade/tradeCache";
import { resetTestEnv } from "../../../utils/resetTestEnv";

jest.mock("../../../../src/middlewares/logger", () => ({
  newLogger: jest.fn(),
}));

jest.mock("../../../../src/features/trade/tradeUtils", () => ({
  createEmbedAsk: jest.fn().mockReturnValue({
    setTitle: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    addFields: jest.fn().mockReturnThis(),
    setColor: jest.fn().mockReturnThis(),
  }),
}));

describe("Trade", () => {
  beforeAll(async () => {
    await resetTestEnv();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should reject when initiator has active trade", async () => {
    const tradeData: TradeData = {
      tradeId: "existing_trade",
      initiatorId: "user1",
      targetId: "user2",
      serverId: "server1",
      status: "pending",
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    createTrade(tradeData);

    const initiator: UserType = {
      discordId: "user1",
    } as any;

    const target: UserType = {
      discordId: "user2",
    } as any;

    const targetDiscordUser = {
      id: "user2",
      username: "Target",
      bot: false,
    } as unknown as DiscordUser;

    const server: ServerType = {
      discordId: "server1",
      settings: { language: "eng" },
    } as any;

    const mockClient = {} as Client;

    const result = await initiateTrade(
      mockClient,
      initiator,
      target,
      targetDiscordUser,
      server,
    );

    expect(result.success).toBe(false);
    expect(result.message).toBeDefined();
  });

  it("should reject when target has active trade", async () => {
    const tradeData: TradeData = {
      tradeId: "existing_trade_2",
      initiatorId: "user3",
      targetId: "user4",
      serverId: "server1",
      status: "pending",
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    createTrade(tradeData);

    const initiator: UserType = {
      discordId: "user5",
    } as any;

    const target: UserType = {
      discordId: "user4",
    } as any;

    const targetDiscordUser = {
      id: "user4",
      username: "Target",
      bot: false,
    } as unknown as DiscordUser;

    const server: ServerType = {
      discordId: "server1",
      settings: { language: "eng" },
    } as any;

    const mockClient = {} as Client;

    const result = await initiateTrade(
      mockClient,
      initiator,
      target,
      targetDiscordUser,
      server,
    );

    expect(result.success).toBe(false);
    expect(result.message).toBeDefined();
  });

  it("should reject when target is blocked", async () => {
    const {
      setTradeBlock,
    } = require("../../../../src/features/trade/tradeCache");
    setTradeBlock("user6", Date.now() + 3600000);

    const initiator: UserType = {
      discordId: "user7",
    } as any;

    const target: UserType = {
      discordId: "user6",
    } as any;

    const targetDiscordUser = {
      id: "user6",
      username: "Target",
      bot: false,
    } as unknown as DiscordUser;

    const server: ServerType = {
      discordId: "server1",
      settings: { language: "eng" },
    } as any;

    const mockClient = {} as Client;

    const result = await initiateTrade(
      mockClient,
      initiator,
      target,
      targetDiscordUser,
      server,
    );

    expect(result.success).toBe(false);
    expect(result.message).toBeDefined();
  });

  it("should initiate trade successfully", async () => {
    const initiator: UserType = {
      discordId: "user8",
    } as any;

    const target: UserType = {
      discordId: "user9",
    } as any;

    const targetDiscordUser = {
      id: "user9",
      username: "Target",
      bot: false,
      createDM: jest.fn().mockResolvedValue({
        send: jest.fn().mockResolvedValue({
          id: "message_id",
          createMessageComponentCollector: jest.fn().mockReturnValue({
            on: jest.fn().mockReturnThis(),
          }),
        }),
      }),
    } as unknown as DiscordUser;

    const initiatorDiscordUser = {
      id: "user8",
      username: "Initiator",
      createDM: jest.fn().mockResolvedValue({
        send: jest.fn().mockResolvedValue({
          id: "initiator_message_id",
        }),
      }),
    };

    const server: ServerType = {
      discordId: "server1",
      settings: { language: "eng" },
    } as any;

    const mockClient = {
      users: {
        fetch: jest.fn().mockResolvedValue(initiatorDiscordUser),
      },
    } as unknown as Client;

    const result = await initiateTrade(
      mockClient,
      initiator,
      target,
      targetDiscordUser,
      server,
    );

    expect(result.success).toBe(true);
    expect(result.message).toBeDefined();
  });

  it("should handle DM send failure", async () => {
    const initiator: UserType = {
      discordId: "user10",
    } as any;

    const target: UserType = {
      discordId: "user11",
    } as any;

    const targetDiscordUser = {
      id: "user11",
      username: "Target",
      bot: false,
      createDM: jest.fn().mockRejectedValue(new Error("DM disabled")),
    } as unknown as DiscordUser;

    const server: ServerType = {
      discordId: "server1",
      settings: { language: "eng" },
    } as any;

    const mockClient = {} as Client;

    const result = await initiateTrade(
      mockClient,
      initiator,
      target,
      targetDiscordUser,
      server,
    );

    expect(result.success).toBe(false);
  });

  it("should handle initiator DM send failure", async () => {
    const initiator: UserType = {
      discordId: "user12",
    } as any;

    const target: UserType = {
      discordId: "user13",
    } as any;

    const targetDiscordUser = {
      id: "user13",
      username: "Target",
      bot: false,
      createDM: jest.fn().mockResolvedValue({
        send: jest.fn().mockResolvedValue({
          id: "target_message_id",
          createMessageComponentCollector: jest.fn().mockReturnValue({
            on: jest.fn().mockReturnThis(),
          }),
        }),
      }),
    } as unknown as DiscordUser;

    const initiatorDiscordUser = {
      id: "user12",
      username: "Initiator",
      createDM: jest.fn().mockRejectedValue(new Error("DM disabled")),
    };

    const server: ServerType = {
      discordId: "server1",
      settings: { language: "eng" },
    } as any;

    const mockClient = {
      users: {
        fetch: jest.fn().mockResolvedValue(initiatorDiscordUser),
      },
    } as unknown as Client;

    const result = await initiateTrade(
      mockClient,
      initiator,
      target,
      targetDiscordUser,
      server,
    );

    expect(result.success).toBe(true);
  });

  it("should handle general error", async () => {
    const initiator: UserType = {
      discordId: "user14",
    } as any;

    const target: UserType = {
      discordId: "user15",
    } as any;

    const targetDiscordUser = {
      id: "user15",
      username: "Target",
      bot: false,
    } as unknown as DiscordUser;

    const server: ServerType = {
      discordId: "server1",
      settings: { language: "eng" },
    } as any;

    const mockClient = {
      users: {
        fetch: jest.fn().mockRejectedValue(new Error("Network error")),
      },
    } as unknown as Client;

    const result = await initiateTrade(
      mockClient,
      initiator,
      target,
      targetDiscordUser,
      server,
    );

    expect(result.success).toBe(false);
  });

  it("should handle timeout collector", async () => {
    const initiator: UserType = {
      discordId: "user16",
    } as any;

    const target: UserType = {
      discordId: "user17",
    } as any;

    let timeoutCallback: any;
    const targetMessage = {
      id: "target_message_id",
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn((event: string, callback: any) => {
          if (event === "end") {
            timeoutCallback = callback;
          }
          return {
            on: jest.fn().mockReturnThis(),
          };
        }),
      }),
      edit: jest.fn().mockResolvedValue({}),
    };

    const targetDiscordUser = {
      id: "user17",
      username: "Target",
      bot: false,
      createDM: jest.fn().mockResolvedValue({
        send: jest.fn().mockResolvedValue(targetMessage),
      }),
    } as unknown as DiscordUser;

    const initiatorDiscordUser = {
      id: "user16",
      username: "Initiator",
      createDM: jest.fn().mockResolvedValue({
        send: jest.fn().mockResolvedValue({
          id: "initiator_message_id",
        }),
      }),
    };

    const server: ServerType = {
      discordId: "server1",
      settings: { language: "eng" },
    } as any;

    const mockClient = {
      users: {
        fetch: jest.fn().mockResolvedValue(initiatorDiscordUser),
      },
    } as unknown as Client;

    const result = await initiateTrade(
      mockClient,
      initiator,
      target,
      targetDiscordUser,
      server,
    );

    expect(result.success).toBe(true);

    if (timeoutCallback) {
      const {
        getTrade,
        getUserActiveTrade,
      } = require("../../../../src/features/trade/tradeCache");
      const activeTrade = getUserActiveTrade("user16");
      if (activeTrade) {
        await timeoutCallback([], "time");
        expect(targetMessage.edit).toHaveBeenCalled();
      }
    }
  });

  it("should handle timeout collector when trade status is not pending", async () => {
    const initiator: UserType = {
      discordId: "user18",
    } as any;

    const target: UserType = {
      discordId: "user19",
    } as any;

    const targetDiscordUser = {
      id: "user19",
      username: "Target",
      bot: false,
      createDM: jest.fn().mockResolvedValue({
        send: jest.fn().mockResolvedValue({
          id: "target_message_id",
          createMessageComponentCollector: jest.fn().mockReturnValue({
            on: jest.fn((event: string, callback: any) => {
              if (event === "end") {
                setTimeout(() => {
                  const {
                    getTrade,
                    updateTrade,
                  } = require("../../../../src/features/trade/tradeCache");
                  const tradeId = `trade_user18_user19_${Date.now()}`;
                  const trade = getTrade(tradeId);
                  if (trade) {
                    updateTrade(tradeId, { status: "accepted" });
                  }
                  callback([], "time");
                }, 10);
              }
              return {
                on: jest.fn().mockReturnThis(),
              };
            }),
          }),
          edit: jest.fn().mockResolvedValue({}),
        }),
      }),
    } as unknown as DiscordUser;

    const initiatorDiscordUser = {
      id: "user18",
      username: "Initiator",
      createDM: jest.fn().mockResolvedValue({
        send: jest.fn().mockResolvedValue({
          id: "initiator_message_id",
        }),
      }),
    };

    const server: ServerType = {
      discordId: "server1",
      settings: { language: "eng" },
    } as any;

    const mockClient = {
      users: {
        fetch: jest.fn().mockResolvedValue(initiatorDiscordUser),
      },
    } as unknown as Client;

    const result = await initiateTrade(
      mockClient,
      initiator,
      target,
      targetDiscordUser,
      server,
    );

    expect(result.success).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 50));
  });
});

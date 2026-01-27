import { sendTradeMenuToUser } from "../../../../src/features/trade/tradeMenuHandler";
import { resetTestEnv } from "../../../utils/resetTestEnv";
import { getUserById } from "../../../../src/cache/UserCache";

jest.mock("../../../../src/cache/UserCache", () => {
  const actual = jest.requireActual("../../../../src/cache/UserCache");
  return {
    ...actual,
    getUserById: jest.fn(),
  };
});

jest.mock("../../../../src/features/trade/tradeMenu", () => ({
  regenerateTradeMenu: jest.fn(),
}));

jest.mock("../../../../src/features/trade/tradeSelection", () => ({
  handlePokemonSelection: jest.fn(),
}));

jest.mock("../../../../src/features/trade/tradeUtils", () => ({
  calculateCooldownRemaining: jest.fn().mockReturnValue(null),
}));

describe("TradeMenuHandler", () => {
  beforeAll(async () => {
    await resetTestEnv();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send menu to user", async () => {
    const tradeMenu = require("../../../../src/features/trade/tradeMenu");
    const user = {
      discordId: "user1",
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

    (getUserById as jest.Mock).mockResolvedValue(user);

    const mockMenuStructure = {
      children: [
        {
          label: "Gen 1",
          value: "gen_1",
          description: "Generation 1",
        },
      ],
    };

    tradeMenu.regenerateTradeMenu.mockReturnValue(
      new Map([
        [
          "generation",
          {
            getMenuStructure: jest.fn().mockReturnValue(mockMenuStructure),
          },
        ],
      ]),
    );

    const mockDM = {
      send: jest.fn().mockResolvedValue({
        createMessageComponentCollector: jest.fn().mockReturnValue({
          on: jest.fn().mockReturnThis(),
          stop: jest.fn(),
        }),
        edit: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({}),
      }),
    };

    const mockClient = {
      users: {
        fetch: jest.fn().mockResolvedValue({
          createDM: jest.fn().mockResolvedValue(mockDM),
        }),
      },
    };

    const server = {
      discordId: "server1",
      settings: { language: "eng" },
    };

    await sendTradeMenuToUser(mockClient, "user1", "trade_1", user, server);

    expect(mockClient.users.fetch).toHaveBeenCalledWith("user1");
    expect(mockDM.send).toHaveBeenCalled();
  });

  it("should handle no pokemon available", async () => {
    const tradeMenu = require("../../../../src/features/trade/tradeMenu");
    const user = {
      discordId: "user2",
      savePokemon: {
        data: {},
      },
    };

    (getUserById as jest.Mock).mockResolvedValue(user);

    tradeMenu.regenerateTradeMenu.mockReturnValue(
      new Map([
        [
          "generation",
          {
            getMenuStructure: jest.fn().mockReturnValue({
              children: undefined,
            }),
          },
        ],
      ]),
    );

    const mockDM = {
      send: jest.fn().mockResolvedValue({}),
    };

    const mockClient = {
      users: {
        fetch: jest.fn().mockResolvedValue({
          createDM: jest.fn().mockResolvedValue(mockDM),
        }),
      },
    };

    const server = {
      discordId: "server1",
      settings: { language: "eng" },
    };

    await sendTradeMenuToUser(mockClient, "user2", "trade_2", user, server);

    expect(mockDM.send).toHaveBeenCalled();
  });

  it("should handle errors gracefully", async () => {
    const mockClient = {
      users: {
        fetch: jest.fn().mockRejectedValue(new Error("Failed to fetch")),
      },
    };

    const server = {
      discordId: "server1",
      settings: { language: "eng" },
    };

    const user = {
      discordId: "user3",
      savePokemon: { data: {} },
    };

    await expect(
      sendTradeMenuToUser(mockClient, "user3", "trade_3", user, server),
    ).resolves.not.toThrow();
  });

});

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
  getCooldownDisplayText: jest
    .fn()
    .mockReturnValue("Legendary: None\nMythical: None\nUltra Beast: None"),
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

  it("should handle menu collector with cooldowns", async () => {
    const tradeMenu = require("../../../../src/features/trade/tradeMenu");
    const tradeUtils = require("../../../../src/features/trade/tradeUtils");

    const user = {
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

    tradeUtils.calculateCooldownRemaining.mockImplementation(
      (userId: string, rarity: string) => {
        if (rarity === "legendary") return 86400000;
        return null;
      },
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

    await sendTradeMenuToUser(mockClient, "user5", "trade_5", user, server);

    expect(mockDM.send).toHaveBeenCalled();
    const sentEmbed = mockDM.send.mock.calls[0][0].embeds[0];
    expect(sentEmbed.data.fields).toBeDefined();
  });

  it("should handle menu collector interactions with children", async () => {
    const tradeMenu = require("../../../../src/features/trade/tradeMenu");
    const tradeSelection = require("../../../../src/features/trade/tradeSelection");
    const tradeUtils = require("../../../../src/features/trade/tradeUtils");

    const user = {
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
          children: [
            {
              label: "Type Normal",
              value: "gen_1_type_normal",
              description: "Normal type",
              children: [
                {
                  label: "Pikachu",
                  value: "25-ordinary-1",
                  description: "Pikachu",
                },
              ],
            },
          ],
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

    tradeUtils.calculateCooldownRemaining.mockReturnValue(null);
    tradeSelection.handlePokemonSelection.mockResolvedValue(undefined);

    let collectCallback: any;
    let endCallback: any;

    const mockCollector: {
      on: jest.Mock;
      stop: jest.Mock;
    } = {
      on: jest.fn((event: string, callback: any) => {
        if (event === "collect") {
          collectCallback = callback;
        }
        if (event === "end") {
          endCallback = callback;
        }
        return mockCollector;
      }),
      stop: jest.fn(),
    };

    const mockMessage = {
      createMessageComponentCollector: jest.fn().mockReturnValue(mockCollector),
      edit: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
    };

    const mockDM = {
      send: jest.fn().mockResolvedValue(mockMessage),
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

    await sendTradeMenuToUser(mockClient, "user6", "trade_6", user, server);

    expect(mockMessage.createMessageComponentCollector).toHaveBeenCalled();

    if (collectCallback) {
      const mockInteraction1 = {
        user: { id: "user6" },
        customId: "tm_trade_6_user6_0",
        values: ["gen_1"],
        deferUpdate: jest.fn().mockResolvedValue({}),
        editReply: jest.fn().mockResolvedValue({}),
      };

      await collectCallback(mockInteraction1);
      expect(mockInteraction1.deferUpdate).toHaveBeenCalled();
      expect(mockInteraction1.editReply).toHaveBeenCalled();

      const mockInteraction2 = {
        user: { id: "user6" },
        customId: "tm_trade_6_user6_1",
        values: ["gen_1_type_normal"],
        deferUpdate: jest.fn().mockResolvedValue({}),
        editReply: jest.fn().mockResolvedValue({}),
      };

      await collectCallback(mockInteraction2);
      expect(mockInteraction2.deferUpdate).toHaveBeenCalled();

      const mockInteraction3 = {
        user: { id: "user6" },
        customId: "tm_trade_6_user6_2",
        values: ["25-ordinary-1"],
        deferUpdate: jest.fn().mockResolvedValue({}),
        editReply: jest.fn().mockResolvedValue({}),
      };

      await collectCallback(mockInteraction3);
      expect(tradeSelection.handlePokemonSelection).toHaveBeenCalled();
    }

    if (endCallback) {
      await endCallback();
      expect(mockMessage.edit).toHaveBeenCalled();
    }
  });

  it("should handle collector error", async () => {
    const tradeMenu = require("../../../../src/features/trade/tradeMenu");
    const tradeUtils = require("../../../../src/features/trade/tradeUtils");

    const user = {
      discordId: "user7",
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

    tradeUtils.calculateCooldownRemaining.mockReturnValue(null);

    let collectCallback: any;

    const mockCollector: {
      on: jest.Mock;
      stop: jest.Mock;
    } = {
      on: jest.fn((event: string, callback: any) => {
        if (event === "collect") {
          collectCallback = callback;
        }
        return mockCollector;
      }),
      stop: jest.fn(),
    };

    const mockMessage = {
      createMessageComponentCollector: jest.fn().mockReturnValue(mockCollector),
      edit: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockRejectedValue(new Error("Delete failed")),
    };

    const mockDM = {
      send: jest.fn().mockResolvedValue(mockMessage),
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

    await sendTradeMenuToUser(mockClient, "user7", "trade_7", user, server);

    if (collectCallback) {
      const mockInteraction = {
        user: { id: "user7" },
        customId: "tm_trade_7_user7_0",
        values: ["25-ordinary-1"],
        deferUpdate: jest.fn().mockRejectedValue(new Error("Defer failed")),
        editReply: jest.fn().mockResolvedValue({}),
      };

      await collectCallback(mockInteraction);
      expect(mockInteraction.deferUpdate).toHaveBeenCalled();
    }
  });

  it("should handle empty children options", async () => {
    const tradeMenu = require("../../../../src/features/trade/tradeMenu");
    const tradeUtils = require("../../../../src/features/trade/tradeUtils");

    const user = {
      discordId: "user8",
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
          children: [],
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

    tradeUtils.calculateCooldownRemaining.mockReturnValue(null);

    let collectCallback: any;

    const mockCollector: {
      on: jest.Mock;
      stop: jest.Mock;
    } = {
      on: jest.fn((event: string, callback: any) => {
        if (event === "collect") {
          collectCallback = callback;
        }
        return mockCollector;
      }),
      stop: jest.fn(),
    };

    const mockMessage = {
      createMessageComponentCollector: jest.fn().mockReturnValue(mockCollector),
      edit: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
    };

    const mockDM = {
      send: jest.fn().mockResolvedValue(mockMessage),
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

    await sendTradeMenuToUser(mockClient, "user8", "trade_8", user, server);

    if (collectCallback) {
      const mockInteraction = {
        user: { id: "user8" },
        customId: "tm_trade_8_user8_0",
        values: ["gen_1"],
        deferUpdate: jest.fn().mockResolvedValue({}),
        editReply: jest.fn().mockResolvedValue({}),
      };

      await collectCallback(mockInteraction);
      expect(mockInteraction.deferUpdate).toHaveBeenCalled();
    }
  });
});

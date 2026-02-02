import {
  ButtonInteraction,
  Client,
  User,
  DMChannel,
  Message,
  EmbedBuilder,
} from "discord.js";
import {
  handleTradeAccept,
  handleTradeRefuse,
  handleTradeRefuseWeek,
  handleTradeConfirm,
  handleTradeCancel,
} from "../../../../src/features/trade/tradeHandlers";
import {
  TradeData,
  PokemonChoice,
} from "../../../../src/features/trade/tradeCache";
import { resetTestEnv } from "../../../utils/resetTestEnv";
import { getUserById } from "../../../../src/cache/UserCache";
import { getServerById } from "../../../../src/cache/ServerCache";
import { createMockInteraction } from "../../../utils/mock/mockInteraction";
import language from "../../../../src/lang/language";

jest.mock("../../../../src/cache/UserCache", () => {
  const actual = jest.requireActual("../../../../src/cache/UserCache");
  return {
    ...actual,
    getUserById: jest.fn(),
  };
});

jest.mock("../../../../src/cache/ServerCache", () => {
  const actual = jest.requireActual("../../../../src/cache/ServerCache");
  return {
    ...actual,
    getServerById: jest.fn(),
  };
});

jest.mock("../../../../src/middlewares/logger", () => ({
  newLogger: jest.fn(),
}));

jest.mock("../../../../src/features/trade/tradeValidation", () => ({
  executeTrade: jest.fn(),
}));

jest.mock("../../../../src/features/trade/tradeUtils", () => ({
  getEligiblePokemon: jest.fn(),
  calculateCooldownRemaining: jest.fn().mockReturnValue(null),
}));

jest.mock("../../../../src/features/trade/tradeMenu", () => ({
  regenerateTradeMenu: jest.fn(),
}));

jest.mock("../../../../src/features/trade/tradeCache", () => {
  const actual =
    jest.requireActual<typeof import("../../../../src/features/trade/tradeCache")>(
      "../../../../src/features/trade/tradeCache",
    );
  return {
    ...actual,
    createTrade: jest.fn(),
    getTrade: jest.fn(),
    updateTrade: jest.fn(),
    deleteTrade: jest.fn(),
    setTradeBlock: jest.fn(),
    getTradeByUserId: jest.fn(),
    getUserActiveTrade: jest.fn(),
    setTradeCooldown: jest.fn(),
    getTradeCooldown: jest.fn(),
    getTradeBlock: jest.fn(),
  };
});

jest.mock("../../../../src/features/trade/tradeMenuHandler", () => ({
  sendTradeMenuToUser: jest.fn(),
}));

jest.mock("../../../../src/features/trade/tradeSelection", () => ({
  handlePokemonSelection: jest.fn(),
}));

jest.mock("../../../../src/features/trade/tradeConfirmation", () => ({
  sendConfirmationEmbeds: jest.fn(),
}));

jest.mock("../../../../src/features/trade/tradeEmbeds", () => ({
  createTradeCompletedEmbed: jest.fn(),
}));

const tradeValidation = require("../../../../src/features/trade/tradeValidation");
const tradeUtils = require("../../../../src/features/trade/tradeUtils");
const tradeMenu = require("../../../../src/features/trade/tradeMenu");
const tradeMenuHandler = require("../../../../src/features/trade/tradeMenuHandler");
const tradeConfirmation = require("../../../../src/features/trade/tradeConfirmation");
const tradeEmbeds = require("../../../../src/features/trade/tradeEmbeds");
const tradeCache = require("../../../../src/features/trade/tradeCache");
const userCache = require("../../../../src/cache/UserCache");
const serverCache = require("../../../../src/cache/ServerCache");

function createMockButtonInteraction(
  userId: string,
  customId: string,
): ButtonInteraction {
  const mockMessage = {
    edit: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    createMessageComponentCollector: jest.fn().mockReturnValue({
      on: jest.fn().mockReturnThis(),
      stop: jest.fn(),
    }),
  } as unknown as Message;

  const mockUser = {
    id: userId,
    username: `User${userId}`,
    createDM: jest.fn().mockResolvedValue({
      send: jest.fn().mockResolvedValue(mockMessage),
      messages: {
        fetch: jest.fn().mockResolvedValue(mockMessage),
      },
    } as unknown as DMChannel),
  } as unknown as User;

  const mockClient = {
    users: {
      fetch: jest.fn().mockResolvedValue(mockUser),
    },
  } as unknown as Client;

  const mock = {
    client: mockClient,
    user: mockUser,
    customId,
    deferUpdate: jest.fn().mockResolvedValue(undefined),
    editReply: jest.fn().mockResolvedValue(undefined),
    followUp: jest.fn().mockResolvedValue(undefined),
    reply: jest.fn().mockResolvedValue(mockMessage),
  };

  return mock as unknown as ButtonInteraction;
}

function createMockTrade(
  tradeId: string,
  initiatorId: string,
  targetId: string,
  serverId: string,
  status: TradeData["status"] = "pending",
): TradeData {
  return {
    tradeId,
    initiatorId,
    targetId,
    serverId,
    status,
    createdAt: Date.now(),
    expiresAt: Date.now() + 3600000, // 1 hour
  };
}

describe("Trade Handlers", () => {
  let initiatorId: string;
  let targetId: string;
  let serverId: string;
  let tradeId: string;

  beforeAll(async () => {
    await resetTestEnv();
  });

  beforeEach(async () => {
    initiatorId = "initiator123";
    targetId = "target456";
    serverId = "server789";
    tradeId = `trade_${Date.now()}`;

    const mockInitiator = {
      discordId: initiatorId,
      savePokemon: {
        data: {},
        initMissingPokemons: jest.fn(),
      },
    };
    const mockTarget = {
      discordId: targetId,
      savePokemon: {
        data: {},
        initMissingPokemons: jest.fn(),
      },
    };
    const mockServer = {
      discordId: serverId,
      settings: { language: "eng" },
    };

    (userCache.getUserById as jest.Mock).mockImplementation(
      async (id: string) => {
        if (id === initiatorId) return mockInitiator;
        if (id === targetId) return mockTarget;
        return mockInitiator;
      },
    );
    (serverCache.getServerById as jest.Mock).mockResolvedValue(mockServer);

    (tradeCache.getTrade as jest.Mock).mockReturnValue(undefined);
    (tradeCache.updateTrade as jest.Mock).mockImplementation(() => {});
    (tradeCache.deleteTrade as jest.Mock).mockImplementation(() => {});
    (tradeCache.setTradeBlock as jest.Mock).mockImplementation(() => {});
    (tradeCache.createTrade as jest.Mock).mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("handleTradeAccept", () => {
    it("should handle trade not found", async () => {
      const interaction = createMockButtonInteraction(
        targetId,
        `trade_accept_${tradeId}`,
      );

      await handleTradeAccept(interaction, tradeId);

      expect(interaction.deferUpdate).toHaveBeenCalled();
      expect(interaction.followUp).toHaveBeenCalledWith({
        content: language("tradeNotFound", "eng"),
        ephemeral: true,
      });
    });

    it("should reject if user is not the target", async () => {
      const trade = createMockTrade(tradeId, initiatorId, targetId, serverId);
      (tradeCache.getTrade as jest.Mock).mockReturnValue(trade);

      const interaction = createMockButtonInteraction(
        "wrongUser",
        `trade_accept_${tradeId}`,
      );

      await handleTradeAccept(interaction, tradeId);

      expect(interaction.deferUpdate).toHaveBeenCalled();
      expect(interaction.followUp).toHaveBeenCalledWith({
        content: language("tradeNotAuthorized", "eng"),
        ephemeral: true,
      });
    });

    it("should reject if trade status is not pending", async () => {
      const trade = createMockTrade(
        tradeId,
        initiatorId,
        targetId,
        serverId,
        "accepted",
      );
      (tradeCache.getTrade as jest.Mock).mockReturnValue(trade);

      const interaction = createMockButtonInteraction(
        targetId,
        `trade_accept_${tradeId}`,
      );

      await handleTradeAccept(interaction, tradeId);

      expect(interaction.deferUpdate).toHaveBeenCalled();
      expect(interaction.followUp).toHaveBeenCalledWith({
        content: language("tradeInvalidStatus", "eng"),
        ephemeral: true,
      });
    });

    it("should handle missing serverId", async () => {
      const trade = createMockTrade(tradeId, initiatorId, targetId, serverId);
      trade.serverId = "" as any;
      (tradeCache.getTrade as jest.Mock).mockReturnValue(trade);

      const interaction = createMockButtonInteraction(
        targetId,
        `trade_accept_${tradeId}`,
      );

      await handleTradeAccept(interaction, tradeId);

      expect(interaction.deferUpdate).toHaveBeenCalled();
      expect(interaction.followUp).toHaveBeenCalledWith({
        content: language("tradeError", "eng"),
        ephemeral: true,
      });
    });

    it("should handle users with no eligible pokemon", async () => {
      const trade = createMockTrade(tradeId, initiatorId, targetId, serverId);
      (tradeCache.getTrade as jest.Mock).mockReturnValue(trade);
      (tradeUtils.getEligiblePokemon as jest.Mock).mockReturnValue([]);

      const interaction = createMockButtonInteraction(
        targetId,
        `trade_accept_${tradeId}`,
      );

      await handleTradeAccept(interaction, tradeId);

      expect(interaction.deferUpdate).toHaveBeenCalled();
      expect(tradeCache.updateTrade).toHaveBeenCalled();
      expect(tradeCache.deleteTrade).toHaveBeenCalled();
    });

    it("should successfully accept trade and send menus", async () => {
      const trade = createMockTrade(tradeId, initiatorId, targetId, serverId);
      (tradeCache.getTrade as jest.Mock).mockReturnValue(trade);

      const mockPokemon = {
        "25-ordinary-1": {
          normalCount: 5,
          shinyCount: 0,
          rarity: "ordinary",
        },
      };

      (tradeUtils.getEligiblePokemon as jest.Mock).mockReturnValue([
        mockPokemon,
      ]);
      (tradeMenuHandler.sendTradeMenuToUser as jest.Mock).mockResolvedValue(
        undefined,
      );

      const interaction = createMockButtonInteraction(
        targetId,
        `trade_accept_${tradeId}`,
      );

      await handleTradeAccept(interaction, tradeId);

      expect(interaction.deferUpdate).toHaveBeenCalled();
      expect(tradeCache.updateTrade).toHaveBeenCalledWith(tradeId, {
        status: "accepted",
      });
      expect(tradeMenuHandler.sendTradeMenuToUser).toHaveBeenCalledTimes(2);
    });
  });

  describe("handleTradeRefuse", () => {
    it("should handle trade not found", async () => {
      const interaction = createMockButtonInteraction(
        targetId,
        `trade_refuse_${tradeId}`,
      );

      await handleTradeRefuse(interaction, tradeId);

      expect(interaction.deferUpdate).toHaveBeenCalled();
    });

    it("should reject if user is not the target", async () => {
      const trade = createMockTrade(tradeId, initiatorId, targetId, serverId);
      (tradeCache.getTrade as jest.Mock).mockReturnValue(trade);

      const interaction = createMockButtonInteraction(
        "wrongUser",
        `trade_refuse_${tradeId}`,
      );

      await handleTradeRefuse(interaction, tradeId);

      expect(interaction.deferUpdate).toHaveBeenCalled();
      expect(tradeCache.updateTrade).not.toHaveBeenCalled();
    });

    it("should successfully refuse trade", async () => {
      const trade = createMockTrade(tradeId, initiatorId, targetId, serverId);
      (tradeCache.getTrade as jest.Mock).mockReturnValue(trade);

      const interaction = createMockButtonInteraction(
        targetId,
        `trade_refuse_${tradeId}`,
      );

      await handleTradeRefuse(interaction, tradeId);

      expect(interaction.deferUpdate).toHaveBeenCalled();
      expect(tradeCache.updateTrade).toHaveBeenCalledWith(tradeId, {
        status: "cancelled",
      });
      expect(tradeCache.deleteTrade).toHaveBeenCalledWith(tradeId);
    });
  });

  describe("handleTradeRefuseWeek", () => {
    it("should handle trade not found", async () => {
      const interaction = createMockButtonInteraction(
        targetId,
        `trade_refuse_week_${tradeId}`,
      );

      await handleTradeRefuseWeek(interaction, tradeId);

      expect(interaction.deferUpdate).toHaveBeenCalled();
    });

    it("should reject if user is not the target", async () => {
      const trade = createMockTrade(tradeId, initiatorId, targetId, serverId);
      (tradeCache.getTrade as jest.Mock).mockReturnValue(trade);

      const interaction = createMockButtonInteraction(
        "wrongUser",
        `trade_refuse_week_${tradeId}`,
      );

      await handleTradeRefuseWeek(interaction, tradeId);

      expect(interaction.deferUpdate).toHaveBeenCalled();
      expect(tradeCache.setTradeBlock).not.toHaveBeenCalled();
    });

    it("should successfully refuse trade and block user", async () => {
      const trade = createMockTrade(tradeId, initiatorId, targetId, serverId);
      (tradeCache.getTrade as jest.Mock).mockReturnValue(trade);

      const interaction = createMockButtonInteraction(
        targetId,
        `trade_refuse_week_${tradeId}`,
      );

      await handleTradeRefuseWeek(interaction, tradeId);

      expect(interaction.deferUpdate).toHaveBeenCalled();
      expect(tradeCache.setTradeBlock).toHaveBeenCalled();
      expect(tradeCache.updateTrade).toHaveBeenCalledWith(tradeId, {
        status: "cancelled",
      });
      expect(tradeCache.deleteTrade).toHaveBeenCalledWith(tradeId);
    });
  });

  describe("handleTradeConfirm", () => {
    it("should handle trade not found", async () => {
      const interaction = createMockButtonInteraction(
        initiatorId,
        `trade_confirm_${tradeId}`,
      );

      await handleTradeConfirm(interaction, tradeId);

      expect(interaction.deferUpdate).toHaveBeenCalled();
      expect(interaction.followUp).toHaveBeenCalledWith({
        content: language("tradeNotFound", "eng"),
        ephemeral: true,
      });
    });

    it("should reject if user is not part of the trade", async () => {
      const trade = createMockTrade(
        tradeId,
        initiatorId,
        targetId,
        serverId,
        "confirming",
      );
      (tradeCache.getTrade as jest.Mock).mockReturnValue(trade);

      const interaction = createMockButtonInteraction(
        "wrongUser",
        `trade_confirm_${tradeId}`,
      );

      await handleTradeConfirm(interaction, tradeId);

      expect(interaction.deferUpdate).toHaveBeenCalled();
      expect(tradeCache.updateTrade).not.toHaveBeenCalled();
    });

    it("should reject if trade status is not confirming", async () => {
      const trade = createMockTrade(
        tradeId,
        initiatorId,
        targetId,
        serverId,
        "accepted",
      );
      (tradeCache.getTrade as jest.Mock).mockReturnValue(trade);

      const interaction = createMockButtonInteraction(
        initiatorId,
        `trade_confirm_${tradeId}`,
      );

      await handleTradeConfirm(interaction, tradeId);

      expect(interaction.deferUpdate).toHaveBeenCalled();
      expect(tradeCache.updateTrade).not.toHaveBeenCalled();
    });

    it("should reject if choices are missing", async () => {
      const trade = createMockTrade(
        tradeId,
        initiatorId,
        targetId,
        serverId,
        "confirming",
      );
      (tradeCache.getTrade as jest.Mock).mockReturnValue(trade);

      const interaction = createMockButtonInteraction(
        initiatorId,
        `trade_confirm_${tradeId}`,
      );

      await handleTradeConfirm(interaction, tradeId);

      expect(interaction.deferUpdate).toHaveBeenCalled();
      expect(tradeCache.updateTrade).not.toHaveBeenCalled();
    });

    it("should update confirmation status for initiator", async () => {
      const trade = createMockTrade(
        tradeId,
        initiatorId,
        targetId,
        serverId,
        "confirming",
      );
      trade.initiatorChoice = {
        pokemonKey: "25-ordinary-1",
        pokemonId: "25",
        rarity: "ordinary",
      };
      trade.targetChoice = {
        pokemonKey: "1-ordinary-1",
        pokemonId: "1",
        rarity: "ordinary",
      };
      (tradeCache.getTrade as jest.Mock).mockReturnValue(trade);

      const interaction = createMockButtonInteraction(
        initiatorId,
        `trade_confirm_${tradeId}`,
      );

      await handleTradeConfirm(interaction, tradeId);

      expect(interaction.deferUpdate).toHaveBeenCalled();
      expect(tradeCache.updateTrade).toHaveBeenCalledWith(tradeId, {
        initiatorConfirmed: true,
      });
    });

    it("should update confirmation status for target", async () => {
      const trade = createMockTrade(
        tradeId,
        initiatorId,
        targetId,
        serverId,
        "confirming",
      );
      trade.initiatorChoice = {
        pokemonKey: "25-ordinary-1",
        pokemonId: "25",
        rarity: "ordinary",
      };
      trade.targetChoice = {
        pokemonKey: "1-ordinary-1",
        pokemonId: "1",
        rarity: "ordinary",
      };
      (tradeCache.getTrade as jest.Mock).mockReturnValue(trade);

      const interaction = createMockButtonInteraction(
        targetId,
        `trade_confirm_${tradeId}`,
      );

      await handleTradeConfirm(interaction, tradeId);

      expect(interaction.deferUpdate).toHaveBeenCalled();
      expect(tradeCache.updateTrade).toHaveBeenCalledWith(tradeId, {
        targetConfirmed: true,
      });
    });

    it("should execute trade when both users confirmed", async () => {
      const trade = createMockTrade(
        tradeId,
        initiatorId,
        targetId,
        serverId,
        "confirming",
      );
      trade.initiatorChoice = {
        pokemonKey: "25-ordinary-1",
        pokemonId: "25",
        rarity: "ordinary",
      };
      trade.targetChoice = {
        pokemonKey: "1-ordinary-1",
        pokemonId: "1",
        rarity: "ordinary",
      };
      trade.initiatorConfirmed = true;
      trade.targetConfirmed = true;
      (tradeCache.getTrade as jest.Mock).mockReturnValue(trade);

      (tradeValidation.executeTrade as jest.Mock).mockResolvedValue(true);

      const interaction = createMockButtonInteraction(
        initiatorId,
        `trade_confirm_${tradeId}`,
      );

      await handleTradeConfirm(interaction, tradeId);

      expect(interaction.deferUpdate).toHaveBeenCalled();
      expect(tradeValidation.executeTrade).toHaveBeenCalled();
      expect(tradeCache.updateTrade).toHaveBeenCalledWith(tradeId, {
        status: "completed",
      });
      expect(tradeCache.deleteTrade).toHaveBeenCalledWith(tradeId);
    });

    it("should handle trade execution failure", async () => {
      const trade = createMockTrade(
        tradeId,
        initiatorId,
        targetId,
        serverId,
        "confirming",
      );
      trade.initiatorChoice = {
        pokemonKey: "25-ordinary-1",
        pokemonId: "25",
        rarity: "ordinary",
      };
      trade.targetChoice = {
        pokemonKey: "1-ordinary-1",
        pokemonId: "1",
        rarity: "ordinary",
      };
      trade.initiatorConfirmed = true;
      trade.targetConfirmed = true;
      (tradeCache.getTrade as jest.Mock).mockReturnValue(trade);

      (tradeValidation.executeTrade as jest.Mock).mockResolvedValue(false);

      const interaction = createMockButtonInteraction(
        initiatorId,
        `trade_confirm_${tradeId}`,
      );

      await handleTradeConfirm(interaction, tradeId);

      expect(interaction.deferUpdate).toHaveBeenCalled();
      expect(tradeValidation.executeTrade).toHaveBeenCalled();
      expect(interaction.editReply).toHaveBeenCalled();
      expect(tradeCache.updateTrade).toHaveBeenCalledWith(tradeId, {
        status: "accepted",
        initiatorChoice: undefined,
        targetChoice: undefined,
        initiatorConfirmed: false,
        targetConfirmed: false,
      });
    });
  });

  describe("handleTradeCancel", () => {
    it("should handle trade not found", async () => {
      const interaction = createMockButtonInteraction(
        initiatorId,
        `trade_cancel_${tradeId}`,
      );

      await handleTradeCancel(interaction, tradeId);

      expect(interaction.deferUpdate).toHaveBeenCalled();
    });

    it("should reject if user is not part of the trade", async () => {
      const trade = createMockTrade(
        tradeId,
        initiatorId,
        targetId,
        serverId,
        "confirming",
      );
      (tradeCache.getTrade as jest.Mock).mockReturnValue(trade);

      const interaction = createMockButtonInteraction(
        "wrongUser",
        `trade_cancel_${tradeId}`,
      );

      await handleTradeCancel(interaction, tradeId);

      expect(interaction.deferUpdate).toHaveBeenCalled();
      expect(tradeCache.updateTrade).not.toHaveBeenCalled();
    });

    it("should successfully cancel trade and reset choices", async () => {
      const trade = createMockTrade(
        tradeId,
        initiatorId,
        targetId,
        serverId,
        "confirming",
      );
      trade.initiatorChoice = {
        pokemonKey: "25-ordinary-1",
        pokemonId: "25",
        rarity: "ordinary",
      };
      trade.targetChoice = {
        pokemonKey: "1-ordinary-1",
        pokemonId: "1",
        rarity: "ordinary",
      };
      (tradeCache.getTrade as jest.Mock).mockReturnValue(trade);

      (tradeMenuHandler.sendTradeMenuToUser as jest.Mock).mockResolvedValue(
        undefined,
      );

      const interaction = createMockButtonInteraction(
        initiatorId,
        `trade_cancel_${tradeId}`,
      );

      await handleTradeCancel(interaction, tradeId);

      expect(interaction.deferUpdate).toHaveBeenCalled();
      expect(tradeCache.updateTrade).toHaveBeenCalledWith(tradeId, {
        status: "accepted",
        initiatorChoice: undefined,
        targetChoice: undefined,
      });
      expect(tradeMenuHandler.sendTradeMenuToUser).toHaveBeenCalledTimes(2);
    });
  });
});

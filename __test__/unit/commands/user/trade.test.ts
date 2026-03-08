import tradeCommand from "../../../../src/commands/user/trade";
import { ChatInputCommandInteraction } from "discord.js";
import { getUserById } from "../../../../src/cache/UserCache";
import { getServerById } from "../../../../src/cache/ServerCache";
import { initiateTrade } from "../../../../src/features/trade/trade";
import { resetTestEnv } from "../../../utils/resetTestEnv";

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

jest.mock("../../../../src/features/trade/trade", () => ({
  initiateTrade: jest.fn(),
}));

jest.mock("../../../../src/middlewares/logger", () => ({
  newLogger: jest.fn(),
}));

describe("Trade Command", () => {
  beforeAll(async () => {
    await resetTestEnv();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should reject when not in guild", async () => {
    const interaction = {
      guild: null,
      reply: jest.fn().mockResolvedValue({}),
    } as unknown as ChatInputCommandInteraction;

    await tradeCommand.execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        ephemeral: true,
      }),
    );
  });

  it("should reject when trading with self", async () => {
    const interaction = {
      guild: {
        id: "server1",
        preferredLocale: "eng",
      },
      user: {
        id: "user1",
      },
      options: {
        getUser: jest.fn().mockReturnValue({
          id: "user1",
          bot: false,
        }),
      },
      reply: jest.fn().mockResolvedValue({}),
    } as unknown as ChatInputCommandInteraction;

    await tradeCommand.execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        ephemeral: true,
      }),
    );
  });

  it("should reject when trading with bot", async () => {
    const interaction = {
      guild: {
        id: "server1",
        preferredLocale: "eng",
      },
      user: {
        id: "user2",
      },
      options: {
        getUser: jest.fn().mockReturnValue({
          id: "bot1",
          bot: true,
        }),
      },
      reply: jest.fn().mockResolvedValue({}),
    } as unknown as ChatInputCommandInteraction;

    await tradeCommand.execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        ephemeral: true,
      }),
    );
  });

  it("should reject when server not found", async () => {
    (getServerById as jest.Mock).mockResolvedValue(null);

    const interaction = {
      guild: {
        id: "server1",
        preferredLocale: "eng",
      },
      user: {
        id: "user3",
      },
      options: {
        getUser: jest.fn().mockReturnValue({
          id: "user4",
          bot: false,
        }),
      },
      reply: jest.fn().mockResolvedValue({}),
      client: {},
    } as unknown as ChatInputCommandInteraction;

    await tradeCommand.execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        ephemeral: true,
      }),
    );
  });

  it("should execute trade successfully", async () => {
    const initiator = {
      discordId: "user5",
    };

    const target = {
      discordId: "user6",
    };

    const server = {
      discordId: "server1",
      settings: { language: "eng" },
    };

    (getUserById as jest.Mock).mockImplementation(async (id: string) => {
      if (id === "user5") return initiator;
      if (id === "user6") return target;
      return null;
    });

    (getServerById as jest.Mock).mockResolvedValue(server);
    (initiateTrade as jest.Mock).mockResolvedValue({
      success: true,
      message: "Trade initiated",
    });

    const targetUser = {
      id: "user6",
      bot: false,
    };

    const interaction = {
      guild: {
        id: "server1",
        preferredLocale: "eng",
      },
      user: {
        id: "user5",
      },
      options: {
        getUser: jest.fn().mockReturnValue(targetUser),
      },
      reply: jest.fn().mockResolvedValue({}),
      client: {},
    } as unknown as ChatInputCommandInteraction;

    await tradeCommand.execute(interaction);

    expect(initiateTrade).toHaveBeenCalled();
    expect(interaction.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        ephemeral: true,
      }),
    );
  });

  it("should handle trade failure", async () => {
    const initiator = {
      discordId: "user7",
    };

    const target = {
      discordId: "user8",
    };

    const server = {
      discordId: "server1",
      settings: { language: "eng" },
    };

    (getUserById as jest.Mock).mockImplementation(async (id: string) => {
      if (id === "user7") return initiator;
      if (id === "user8") return target;
      return null;
    });

    (getServerById as jest.Mock).mockResolvedValue(server);
    (initiateTrade as jest.Mock).mockResolvedValue({
      success: false,
      message: "Trade failed",
    });

    const targetUser = {
      id: "user8",
      bot: false,
    };

    const interaction = {
      guild: {
        id: "server1",
        preferredLocale: "eng",
      },
      user: {
        id: "user7",
      },
      options: {
        getUser: jest.fn().mockReturnValue(targetUser),
      },
      reply: jest.fn().mockResolvedValue({}),
      client: {},
    } as unknown as ChatInputCommandInteraction;

    await tradeCommand.execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        ephemeral: true,
      }),
    );
  });

  it("should handle errors", async () => {
    const interaction = {
      guild: {
        id: "server1",
        preferredLocale: "eng",
      },
      user: {
        id: "user9",
      },
      options: {
        getUser: jest.fn().mockImplementation(() => {
          throw new Error("Test error");
        }),
      },
      reply: jest.fn().mockResolvedValue({}),
    } as unknown as ChatInputCommandInteraction;

    await tradeCommand.execute(interaction);

    expect(interaction.reply).toHaveBeenCalled();
  });
});

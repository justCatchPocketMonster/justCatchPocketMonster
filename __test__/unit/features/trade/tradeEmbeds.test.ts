import { createTradeCompletedEmbed } from "../../../../src/features/trade/tradeEmbeds";
import { TradeData } from "../../../../src/features/trade/tradeCache";
import type { ServerType } from "../../../../src/core/types/ServerType";
import type { UserType } from "../../../../src/core/types/UserType";

describe("TradeEmbeds", () => {
  it("should create embed without choices", () => {
    const tradeData: TradeData = {
      tradeId: "test_trade",
      initiatorId: "user1",
      targetId: "user2",
      serverId: "server1",
      status: "completed",
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    const server = {
      discordId: "server1",
      settings: { language: "eng" },
    } as ServerType;

    const user = {
      discordId: "user1",
      savePokemon: { data: {} },
    } as unknown as UserType;

    const embed = createTradeCompletedEmbed(
      tradeData,
      server,
      true,
      "Initiator",
      "Target",
      user,
    );

    expect(embed).toBeDefined();
    expect(embed.data.title).toBeDefined();
  });

  it("should create embed with choices", () => {
    const tradeData: TradeData = {
      tradeId: "test_trade_2",
      initiatorId: "user3",
      targetId: "user4",
      serverId: "server1",
      status: "completed",
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

    const server = {
      discordId: "server1",
      settings: { language: "eng" },
    } as ServerType;

    const user = {
      discordId: "user3",
      savePokemon: {
        data: {
          "25-ordinary-1": {
            normalCount: 2,
            shinyCount: 0,
          },
          "1-ordinary-1": {
            normalCount: 1,
            shinyCount: 0,
          },
        },
      },
    } as unknown as UserType;

    const embed = createTradeCompletedEmbed(
      tradeData,
      server,
      true,
      "Initiator",
      "Target",
      user,
    );

    expect(embed).toBeDefined();
    expect(embed.data.fields).toBeDefined();
    expect(embed.data.fields!.length).toBeGreaterThan(0);
  });

  it("should handle missing pokemon data", () => {
    const tradeData: TradeData = {
      tradeId: "test_trade_3",
      initiatorId: "user5",
      targetId: "user6",
      serverId: "server1",
      status: "completed",
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
      initiatorChoice: {
        pokemonKey: "999-invalid-1",
        pokemonId: "999",
        rarity: "ordinary",
      },
      targetChoice: {
        pokemonKey: "998-invalid-1",
        pokemonId: "998",
        rarity: "ordinary",
      },
    };

    const server = {
      discordId: "server1",
      settings: { language: "eng" },
    } as ServerType;

    const user = {
      discordId: "user5",
      savePokemon: { data: {} },
    } as unknown as UserType;

    const embed = createTradeCompletedEmbed(
      tradeData,
      server,
      true,
      "Initiator",
      "Target",
      user,
    );

    expect(embed).toBeDefined();
  });
});

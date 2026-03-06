import {
  getActiveRaid,
  isChannelInRaid,
  startRaid,
  joinRaid,
  isRaidFull,
  resolveRaid,
} from "../../../../src/features/raid/raidManager";
import { Client } from "discord.js";
import { PokemonType } from "../../../../src/core/types/PokemonType";
import { resetTestEnv } from "../../../utils/resetTestEnv";

jest.mock("../../../../src/middlewares/logger", () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
  },
}));

const mockPokemon: PokemonType = {
  id: "1",
  name: { nameEng: ["Bulbasaur"], nameFr: ["Bulbizarre"] },
  arrayType: ["grass", "poison"],
  rarity: "ordinary",
  imgName: "001",
  gen: 1,
  form: "giga",
  versionForm: 0,
  isShiny: false,
  hint: "B___",
  canSosBattle: false,
};

describe("raidManager", () => {
  let client: Client;

  beforeEach(async () => {
    await resetTestEnv();
    client = {
      channels: {
        cache: new Map(),
      },
    } as unknown as Client;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("getActiveRaid", () => {
    it("should return undefined when no raid exists", () => {
      expect(getActiveRaid("server1")).toBeUndefined();
    });

    it("should return raid when one exists", () => {
      const raid = startRaid(
        client,
        "server1",
        "channel1",
        mockPokemon,
        "msg1",
      );
      expect(getActiveRaid("server1")).toBe(raid);
    });
  });

  describe("isChannelInRaid", () => {
    it("should return false when no raid exists", () => {
      expect(isChannelInRaid("server-nonexistent", "channel1")).toBe(false);
    });

    it("should return true when channel is in raid", () => {
      startRaid(client, "server1", "channel1", mockPokemon, "msg1");
      expect(isChannelInRaid("server1", "channel1")).toBe(true);
    });

    it("should return false when different channel", () => {
      startRaid(client, "server1", "channel1", mockPokemon, "msg1");
      expect(isChannelInRaid("server1", "channel2")).toBe(false);
    });
  });

  describe("startRaid", () => {
    it("should create raid and return raid state", () => {
      jest.useFakeTimers();

      const raid = startRaid(
        client,
        "server1",
        "channel1",
        mockPokemon,
        "msg1",
      );

      expect(raid).toBeDefined();
      expect(raid.serverId).toBe("server1");
      expect(raid.channelId).toBe("channel1");
      expect(raid.pokemon).toBe(mockPokemon);
      expect(raid.players).toEqual([]);
      expect(raid.messageId).toBe("msg1");
      expect(getActiveRaid("server1")).toBe(raid);

      jest.advanceTimersByTime(2 * 60 * 1000 + 100);
    });
  });

  describe("joinRaid", () => {
    it("should return joined false when no raid exists", () => {
      const result = joinRaid("server1", "user1");
      expect(result.joined).toBe(false);
      expect(result.raid).toBeUndefined();
    });

    it("should allow user to join raid", () => {
      startRaid(client, "server1", "channel1", mockPokemon, "msg1");
      const result = joinRaid("server1", "user1");

      expect(result.joined).toBe(true);
      expect(result.raid?.players).toContain("user1");
    });

    it("should not allow same user to join twice", () => {
      startRaid(client, "server1", "channel1", mockPokemon, "msg1");
      joinRaid("server1", "user1");
      const result = joinRaid("server1", "user1");

      expect(result.joined).toBe(false);
      expect(result.raid?.players).toHaveLength(1);
    });

    it("should not allow join when raid is full", () => {
      startRaid(client, "server1", "channel1", mockPokemon, "msg1");
      joinRaid("server1", "user1");
      joinRaid("server1", "user2");
      joinRaid("server1", "user3");
      const result = joinRaid("server1", "user4");
      const result5 = joinRaid("server1", "user5");

      expect(result.joined).toBe(true);
      expect(result5.joined).toBe(false);
      expect(result5.raid?.players).toHaveLength(4);
    });
  });

  describe("isRaidFull", () => {
    it("should return false when no raid exists", () => {
      expect(isRaidFull("server-nonexistent")).toBe(false);
    });

    it("should return false when raid has players but not full", () => {
      startRaid(client, "server1", "channel1", mockPokemon, "msg1");
      joinRaid("server1", "user1");
      expect(isRaidFull("server1")).toBe(false);
    });

    it("should return true when raid has 4 players", () => {
      startRaid(client, "server1", "channel1", mockPokemon, "msg1");
      joinRaid("server1", "user1");
      joinRaid("server1", "user2");
      joinRaid("server1", "user3");
      joinRaid("server1", "user4");
      expect(isRaidFull("server1")).toBe(true);
    });
  });

  describe("resolveRaid", () => {
    it("should clear raid when raid exists", async () => {
      startRaid(client, "server-resolve", "channel1", mockPokemon, "msg1");
      expect(getActiveRaid("server-resolve")).toBeDefined();

      await resolveRaid(client, "server-resolve");

      expect(getActiveRaid("server-resolve")).toBeUndefined();
    }, 10000);

    it("should do nothing when no raid exists", async () => {
      await expect(
        resolveRaid(client, "server-nonexistent"),
      ).resolves.not.toThrow();
    });
  });
});

import { spawn } from "../../../../src/features/spawn/spawn";
import { resetTestEnv } from "../../../utils/resetTestEnv";
import { getServerById, updateServer } from "../../../../src/cache/ServerCache";
import { Message } from "discord.js";
import { createMockMessage } from "../../../utils/mock/mockMessage";
import * as helperFunction from "../../../../src/utils/helperFunction";
import logger from "../../../../src/middlewares/logger";
import { __deps } from "../../../../src/features/pokemon/selectPokemon";

jest.mock("../../../../src/middlewares/logger", () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
  },
}));

const mockGenerationSelect = jest.fn();
const mockRaritySelect = jest.fn();
const mockTypeSelect = jest.fn();

describe("spawn", () => {
  let message: Message;

  beforeEach(async () => {
    await resetTestEnv();
    message = createMockMessage();
    __deps.generationSelect = mockGenerationSelect;
    __deps.raritySelect = mockRaritySelect;
    __deps.typeSelect = mockTypeSelect;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    const { generationSelect, raritySelect, typeSelect } = jest.requireActual(
      "../../../../src/features/pokemon/selectPokemon",
    );
    __deps.generationSelect = generationSelect;
    __deps.raritySelect = raritySelect;
    __deps.typeSelect = typeSelect;
  });

  test("should return null when spawnLock is active", async () => {
    const server = await getServerById(message.guildId!);
    server.countMessage = 19;
    server.maxCountMessage = 20;
    server.channelAllowed.push(message.channelId);
    await updateServer(server.discordId, server);

    jest.spyOn(helperFunction, "random").mockImplementation(() => 2);
    mockGenerationSelect.mockReturnValue("1");
    mockRaritySelect.mockReturnValue("ordinary");
    mockTypeSelect.mockReturnValue("normal");

    const promise1 = spawn(message.guildId!, message.channelId);
    const promise2 = spawn(message.guildId!, message.channelId);

    const [result1, result2] = await Promise.all([promise1, promise2]);

    expect(result1 === null || result2 === null).toBe(true);
  });

  test("should return null when channelId is empty", async () => {
    const server = await getServerById(message.guildId!);
    server.channelAllowed = [];
    await updateServer(server.discordId, server);

    const result = await spawn(message.guildId!, message.channelId);

    expect(result).toBeNull();
  });

  test("should return null when hasReachedSpawnLimit returns false", async () => {
    const server = await getServerById(message.guildId!);
    server.countMessage = 0;
    server.maxCountMessage = 20;
    server.channelAllowed.push(message.channelId);
    await updateServer(server.discordId, server);

    jest.spyOn(helperFunction, "random").mockImplementation(() => 2);
    mockGenerationSelect.mockReturnValue("1");
    mockRaritySelect.mockReturnValue("ordinary");
    mockTypeSelect.mockReturnValue("normal");

    const result = await spawn(message.guildId!, message.channelId);

    expect(result).toBeNull();
  });

  test("should handle error and return undefined", async () => {
    jest
      .spyOn(require("../../../../src/cache/ServerCache"), "getServerById")
      .mockRejectedValueOnce(new Error("Database error"));

    const result = await spawn(message.guildId!, message.channelId);

    expect(result).toBeUndefined();
    expect(logger.error).toHaveBeenCalled();
  });

  test("should handle choiceChannel returning different channel", async () => {
    const server = await getServerById(message.guildId!);
    server.countMessage = 19;
    server.maxCountMessage = 20;
    server.channelAllowed.push("other-channel");
    await updateServer(server.discordId, server);

    jest.spyOn(helperFunction, "random").mockImplementation((max) => {
      if (max === 100) return 2;
      if (max === 300) return 1;
      if (max === 1) return 0;
      return 0;
    });
    mockGenerationSelect.mockReturnValue("1");
    mockRaritySelect.mockReturnValue("ordinary");
    mockTypeSelect.mockReturnValue("normal");

    const result = await spawn(message.guildId!, message.channelId);

    expect(result).toBeDefined();
  });

  test("should handle initMaxCount recalculation", async () => {
    const server = await getServerById(message.guildId!);
    server.countMessage = 20;
    server.maxCountMessage = 0;
    server.channelAllowed.push(message.channelId);
    await updateServer(server.discordId, server);

    jest.spyOn(helperFunction, "random").mockImplementation((max, min = 0) => {
      if (max === 100 && min === 0) return 2;
      if (max === 300 && min === 0) return 1;
      if (min > 0) return Math.max(min, Math.floor((max + min) / 2));
      return 0;
    });
    mockGenerationSelect.mockReturnValue("1");
    mockRaritySelect.mockReturnValue("ordinary");
    mockTypeSelect.mockReturnValue("normal");

    const result = await spawn(message.guildId!, message.channelId);

    expect(result).toBeDefined();
  });

  test("should handle nightMode in generateEmbedPokemon", async () => {
    const server = await getServerById(message.guildId!);
    server.countMessage = 19;
    server.maxCountMessage = 20;
    server.channelAllowed.push(message.channelId);
    server.eventSpawn.nightMode = true;
    await updateServer(server.discordId, server);

    jest.spyOn(helperFunction, "random").mockImplementation((max, min = 0) => {
      if (max === 100 && min === 0) return 2;
      if (max === 300 && min === 0) return 1;
      if (min > 0) return Math.max(min, Math.floor((max + min) / 2));
      return 0;
    });
    mockGenerationSelect.mockReturnValue("1");
    mockRaritySelect.mockReturnValue("ordinary");
    mockTypeSelect.mockReturnValue("normal");

    const result = await spawn(message.guildId!, message.channelId);

    expect(result).toBeDefined();
    expect(result?.embed.data.image?.url).toContain("pokeHomeShadow");
  });
});

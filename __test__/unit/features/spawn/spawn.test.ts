import {
  spawn,
  generateEmbedSosPokemon,
} from "../../../../src/features/spawn/spawn";
import { urlImageRepo } from "../../../../src/config/default/misc";

jest.mock("../../../../src/utils/imageUrl", () => ({
  getImageUrl: jest.fn((subFolder: string, imageName: string) =>
    Promise.resolve(`${urlImageRepo}/${subFolder}/${imageName}`),
  ),
}));
import {
  startRaid,
  resolveRaid,
  getActiveRaid,
} from "../../../../src/features/raid/raidManager";
import { resetTestEnv } from "../../../utils/resetTestEnv";
import { Server } from "../../../../src/core/classes/Server";
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

  afterEach(async () => {
    if (message?.guildId && getActiveRaid(message.guildId)) {
      await resolveRaid(
        { channels: { cache: new Map() } } as any,
        message.guildId,
      );
    }
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

  test("should return null when all channels are in raid", async () => {
    const server = await getServerById(message.guildId!);
    server.countMessage = 19;
    server.maxCountMessage = 20;
    server.channelAllowed.push(message.channelId);
    await updateServer(server.discordId, server);

    const mockPokemon = {
      id: "1",
      name: { nameEng: ["Pikachu"], nameFr: ["Pikachu"] },
      arrayType: ["electric"],
      rarity: "ordinary",
      imgName: "025",
      gen: 1,
      form: "giga",
      versionForm: 0,
      isShiny: false,
      hint: "P___",
      canSosBattle: false,
    };
    startRaid(
      { channels: { cache: new Map() } } as any,
      message.guildId!,
      message.channelId,
      mockPokemon as any,
      "msg1",
    );

    jest.spyOn(helperFunction, "random").mockImplementation(() => 2);
    mockGenerationSelect.mockReturnValue("1");
    mockRaritySelect.mockReturnValue("ordinary");
    mockTypeSelect.mockReturnValue("normal");

    const result = await spawn(message.guildId!, message.channelId);

    expect(result).toBeNull();
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

  test("should spawn raid when random returns 0 for raid roll", async () => {
    const server = await getServerById(message.guildId!);
    server.countMessage = 19;
    server.maxCountMessage = 20;
    server.channelAllowed.push(message.channelId);
    await updateServer(server.discordId, server);

    jest.spyOn(helperFunction, "random").mockImplementation((max, min = 0) => {
      if (max === 100 && min === 0) return 0;
      if (max === 300 && min === 0) return 1;
      if (min > 0) return Math.max(min, Math.floor((max + min) / 2));
      return 0;
    });

    const result = await spawn(message.guildId!, message.channelId);

    expect(result).toBeDefined();
    expect(result?.isRaid).toBe(true);
    expect(result?.raidPokemon).toBeDefined();
    expect(result?.embed.data.title).toContain("Raid");
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

describe("generateEmbedSosPokemon", () => {
  const server = Server.createDefault("server1");

  beforeEach(() => {
    jest.spyOn(helperFunction, "random").mockReturnValue(0);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should generate embed with night mode", async () => {
    server.eventSpawn.nightMode = true;
    const pokemon = {
      id: "1",
      name: { nameEng: ["Pikachu"], nameFr: ["Pikachu"] },
      arrayType: ["electric"],
      rarity: "ordinary",
      imgName: "025",
      gen: 1,
      form: "normal",
      versionForm: 0,
      isShiny: false,
      hint: "P___",
      canSosBattle: true,
      sosChainLvl: 2,
    };

    const { embed } = await generateEmbedSosPokemon(pokemon as any, server);

    expect(embed.data.image?.url).toContain("pokeHomeShadow");
    expect(embed.data.footer?.text).toContain("2");
  });

  test("should generate embed with shiny pokemon", async () => {
    const pokemon = {
      id: "1",
      name: { nameEng: ["Pikachu"], nameFr: ["Pikachu"] },
      arrayType: ["electric"],
      rarity: "legendary",
      imgName: "025",
      gen: 1,
      form: "normal",
      versionForm: 0,
      isShiny: true,
      hint: "P___",
      canSosBattle: false,
    };

    const { embed } = await generateEmbedSosPokemon(pokemon as any, server);

    expect(embed.data.image?.url).toContain("-shiny.png");
    expect(embed.data.footer?.text).toContain("1");
  });

  test("should use colorByType for unknown rarity", async () => {
    const pokemon = {
      id: "1",
      name: { nameEng: ["Pikachu"], nameFr: ["Pikachu"] },
      arrayType: ["electric"],
      rarity: "unknown_rarity",
      imgName: "025",
      gen: 1,
      form: "normal",
      versionForm: 0,
      isShiny: false,
      hint: "P___",
      canSosBattle: false,
    };

    const { embed } = await generateEmbedSosPokemon(pokemon as any, server);

    expect(embed.data.color).toBeDefined();
  });
});

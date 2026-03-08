import {
  catchPokemon,
  generateCatchMessage,
} from "../../../../src/features/catch/catch";
import { Pokemon } from "../../../../src/core/classes/Pokemon";

jest.mock("../../../../src/features/raid/raidManager", () => ({
  isChannelInRaid: jest.fn(),
  joinRaid: jest.fn(),
  isRaidFull: jest.fn(),
  resolveRaid: jest.fn(),
  updateRaidEmbed: jest.fn(),
}));

jest.mock("../../../../src/features/event/eventShinyAfterCatch", () => ({
  eventShinyAfterCatch: jest.fn((_i: any, isShiny: boolean) => isShiny),
}));

jest.mock("../../../../src/features/pokemon/selectPokemon", () => ({
  selectSosPokemon: jest.fn(),
}));

jest.mock("../../../../src/features/spawn/spawn", () => ({
  generateEmbedSosPokemon: jest.fn(),
}));

jest.mock("../../../../src/utils/helperFunction", () => ({
  random: jest.fn(),
}));

jest.mock("../../../../src/middlewares/logger", () => ({
  newLogger: jest.fn(),
}));

jest.mock("../../../../src/cache/StatCache", () => ({
  getStatById: jest.fn().mockResolvedValue({
    savePokemonCatch: { addOneCatch: jest.fn() },
    addSpawn: jest.fn(),
    addCatch: jest.fn(),
  }),
  updateStat: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../../../../src/cache/UserCache", () => ({
  updateUser: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../../../../src/cache/ServerCache", () => ({
  updateServer: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../../../../src/lang/language", () => ({
  __esModule: true,
  default: jest.fn((key: string) => {
    const map: Record<string, string> = {
      noPokemonDisponible: "No Pokémon present",
      raidJoined: "Joined the raid",
      raidAlreadyJoined: "You already joined this raid",
    };
    return map[key] ?? key;
  }),
}));

const raidManager = require("../../../../src/features/raid/raidManager");
const eventShinyAfterCatch = require("../../../../src/features/event/eventShinyAfterCatch");
const selectSosPokemon = require("../../../../src/features/pokemon/selectPokemon");
const spawn = require("../../../../src/features/spawn/spawn");
const helperFunction = require("../../../../src/utils/helperFunction");

function createMockUser() {
  const savePokemon = {
    data: {
      "399-ordinary-1": {
        idPokemon: "399",
        rarity: "ordinary",
        form: "ordinary",
        versionForm: 1,
        normalCount: 0,
        shinyCount: 0,
      },
      "25-ordinary-1": {
        idPokemon: "25",
        rarity: "ordinary",
        form: "ordinary",
        versionForm: 1,
        normalCount: 0,
        shinyCount: 0,
      },
    },
    addOneCatch: jest.fn(),
    getSaveOnePokemonFusedForm: jest
      .fn()
      .mockReturnValue({ normalCount: 1, shinyCount: 0 }),
  };
  return {
    discordId: "user1",
    savePokemon: savePokemon as any,
  };
}

function createMockServer() {
  const savePokemon = {
    data: {
      "399-ordinary-1": {
        idPokemon: "399",
        rarity: "ordinary",
        form: "ordinary",
        versionForm: 1,
        normalCount: 0,
        shinyCount: 0,
      },
      "25-ordinary-1": {
        idPokemon: "25",
        rarity: "ordinary",
        form: "ordinary",
        versionForm: 1,
        normalCount: 0,
        shinyCount: 0,
      },
    },
    addOneCatch: jest.fn(),
  };
  return {
    discordId: "server1",
    settings: { language: "eng" },
    getPokemonByIdChannel: jest.fn(),
    removePokemonByIdChannel: jest.fn(),
    savePokemon: savePokemon as any,
    pokemonPresent: {} as Record<string, unknown>,
  };
}

function createMockInteraction() {
  return {
    guild: { id: "guild1" },
    user: { id: "user1" },
    member: {
      nickname: "TestNick",
      displayName: "TestDisplay",
    },
    reply: jest.fn().mockResolvedValue(undefined),
    deferReply: jest.fn().mockResolvedValue(undefined),
    deleteReply: jest.fn().mockResolvedValue(undefined),
    followUp: jest.fn().mockResolvedValue({ id: "mock-message-id" }),
    client: {},
  };
}

describe("catch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    raidManager.isChannelInRaid.mockReturnValue(false);
    eventShinyAfterCatch.eventShinyAfterCatch.mockImplementation(
      (_i: any, isShiny: boolean) => isShiny,
    );
  });

  describe("catchPokemon", () => {
    it("should reply no pokemon when server has no pokemon in channel", async () => {
      const server = createMockServer();
      server.getPokemonByIdChannel.mockReturnValue(null);
      const interaction = createMockInteraction();

      await catchPokemon(
        createMockUser() as any,
        server as any,
        "channel1",
        "Bidoof",
        interaction as any,
      );

      expect(server.getPokemonByIdChannel).toHaveBeenCalledWith("channel1");
      expect(interaction.reply).toHaveBeenCalledWith(
        expect.stringMatching(/no|pokémon|present/i),
      );
    });

    it("should reply fail when pokemon name does not match", async () => {
      const pokemon = Pokemon.from({
        id: "399",
        name: { nameEng: ["Bidoof"], nameFr: ["Keunotor"] },
        arrayType: ["normal"],
        rarity: "ordinary",
        imgName: "399",
        gen: 4,
        form: "ordinary",
        versionForm: 1,
        isShiny: false,
        hint: "B___",
      });
      const server = createMockServer();
      server.getPokemonByIdChannel.mockReturnValue(pokemon);

      const interaction = createMockInteraction();

      await catchPokemon(
        createMockUser() as any,
        server as any,
        "channel1",
        "WrongName",
        interaction as any,
      );

      expect(interaction.reply).toHaveBeenCalledWith(
        expect.stringContaining("WrongName"),
      );
    });

    it("should use displayName when nickname is null", async () => {
      const pokemon = Pokemon.from({
        id: "399",
        name: { nameEng: ["Bidoof"], nameFr: ["Keunotor"] },
        arrayType: ["normal"],
        rarity: "ordinary",
        imgName: "399",
        gen: 4,
        form: "ordinary",
        versionForm: 1,
        isShiny: false,
        hint: "B___",
      });
      const server = createMockServer();
      server.getPokemonByIdChannel.mockReturnValue(pokemon);

      const interaction = createMockInteraction();
      (interaction.member as any).nickname = null;

      await catchPokemon(
        createMockUser() as any,
        server as any,
        "channel1",
        "Bidoof",
        interaction as any,
      );

      expect(interaction.deferReply).toHaveBeenCalledWith({ ephemeral: true });
      expect(interaction.deleteReply).toHaveBeenCalled();
    });

    it("should call handleRaidCatch when channel is in raid", async () => {
      raidManager.isChannelInRaid.mockReturnValue(true);
      raidManager.joinRaid.mockReturnValue({
        joined: true,
        raid: { players: ["user1"], channelId: "ch1" },
      });

      const pokemon = Pokemon.from({
        id: "399",
        name: { nameEng: ["Bidoof"], nameFr: ["Keunotor"] },
        arrayType: ["normal"],
        rarity: "ordinary",
        imgName: "399",
        gen: 4,
        form: "ordinary",
        versionForm: 1,
        isShiny: false,
        hint: "B___",
      });
      const server = createMockServer();
      server.getPokemonByIdChannel.mockReturnValue(pokemon);

      const interaction = createMockInteraction();
      (interaction as any).client = { channels: { cache: new Map() } };

      await catchPokemon(
        createMockUser() as any,
        server as any,
        "channel1",
        "Bidoof",
        interaction as any,
      );

      expect(raidManager.joinRaid).toHaveBeenCalled();
      expect(interaction.reply).toHaveBeenCalledWith(
        expect.stringMatching(/raid|joined/i),
      );
    });

    it("should reply raidAlreadyJoined when user already in raid", async () => {
      raidManager.isChannelInRaid.mockReturnValue(true);
      raidManager.joinRaid.mockReturnValue({ joined: false, raid: {} });

      const pokemon = Pokemon.from({
        id: "399",
        name: { nameEng: ["Bidoof"], nameFr: ["Keunotor"] },
        arrayType: ["normal"],
        rarity: "ordinary",
        imgName: "399",
        gen: 4,
        form: "ordinary",
        versionForm: 1,
        isShiny: false,
        hint: "B___",
      });
      const server = createMockServer();
      server.getPokemonByIdChannel.mockReturnValue(pokemon);

      const interaction = createMockInteraction();
      (interaction as any).client = { channels: { cache: new Map() } };

      await catchPokemon(
        createMockUser() as any,
        server as any,
        "channel1",
        "Bidoof",
        interaction as any,
      );

      expect(interaction.reply).toHaveBeenCalledWith(
        expect.stringMatching(/raid|already|joined/i),
      );
    });

    it("should successfully catch pokemon and clean up reply", async () => {
      const pokemon = Pokemon.from({
        id: "399",
        name: { nameEng: ["Bidoof"], nameFr: ["Keunotor"] },
        arrayType: ["normal"],
        rarity: "ordinary",
        imgName: "399",
        gen: 4,
        form: "ordinary",
        versionForm: 1,
        isShiny: false,
        hint: "B___",
        canSosBattle: false,
      });
      const server = createMockServer();
      server.getPokemonByIdChannel.mockReturnValue(pokemon);
      helperFunction.random.mockReturnValue(0);

      const interaction = createMockInteraction();

      await catchPokemon(
        createMockUser() as any,
        server as any,
        "channel1",
        "Bidoof",
        interaction as any,
      );

      expect(server.removePokemonByIdChannel).toHaveBeenCalledWith("channel1");
      expect(interaction.deferReply).toHaveBeenCalledWith({ ephemeral: true });
      expect(interaction.deleteReply).toHaveBeenCalled();
    });

    it("should trigger SOS followUp when canSosBattle and random returns 1", async () => {
      const pokemon = Pokemon.from({
        id: "25",
        name: { nameEng: ["Pikachu"], nameFr: ["Pikachu"] },
        arrayType: ["electric"],
        rarity: "ordinary",
        imgName: "025",
        gen: 1,
        form: "ordinary",
        versionForm: 1,
        isShiny: false,
        hint: "P___",
        canSosBattle: true,
        sosChainLvl: 0,
      });
      const server = createMockServer();
      server.getPokemonByIdChannel.mockReturnValue(pokemon);
      helperFunction.random.mockReturnValue(1);
      selectSosPokemon.selectSosPokemon.mockReturnValue({
        id: "25",
        name: { nameEng: ["Pikachu"], nameFr: ["Pikachu"] },
        arrayType: ["electric"],
        rarity: "ordinary",
        imgName: "025",
        gen: 1,
        form: "ordinary",
        versionForm: 1,
        isShiny: false,
        hint: "P___",
        canSosBattle: true,
      });
      spawn.generateEmbedSosPokemon.mockResolvedValue({ embed: {} });

      const user = createMockUser();
      const interaction = createMockInteraction();

      await catchPokemon(
        user as any,
        server as any,
        "channel1",
        "Pikachu",
        interaction as any,
      );

      expect(selectSosPokemon.selectSosPokemon).toHaveBeenCalled();
      expect(interaction.followUp).toHaveBeenCalled();
    });
  });

  describe("generateCatchMessage", () => {
    it("should include nameFr/nameEng when different", () => {
      const result = generateCatchMessage(
        {
          name: { nameFr: ["Keunotor"], nameEng: ["Bidoof"] },
          isShiny: false,
        },
        "TestNick",
        createMockUser() as any,
        { settings: { language: "eng" } } as any,
      );

      expect(result).toContain("Keunotor/Bidoof");
      expect(result).not.toContain(":star:");
    });

    it("should use single name when nameFr equals nameEng", () => {
      const result = generateCatchMessage(
        {
          name: { nameFr: ["Pikachu"], nameEng: ["Pikachu"] },
          isShiny: false,
        },
        "TestNick",
        createMockUser() as any,
        { settings: { language: "eng" } } as any,
      );

      expect(result).toContain("Pikachu");
      expect(result).not.toContain(":star:");
    });

    it("should add star when isShiny", () => {
      const result = generateCatchMessage(
        {
          name: { nameFr: ["Pikachu"], nameEng: ["Pikachu"] },
          isShiny: true,
        },
        "TestNick",
        createMockUser() as any,
        { settings: { language: "eng" } } as any,
      );

      expect(result).toContain(":star:");
    });
  });
});

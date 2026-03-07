import { Server } from "../../../src/core/classes/Server";

describe("Server", () => {
  describe("fromMongo", () => {
    it("should create Server with whatEvent null", () => {
      const data = {
        discordId: "server1",
        channelAllowed: ["ch1"],
        charmeChroma: false,
        settings: { language: "fr", spawnMax: 20, spawnMin: 5 },
        savePokemon: {},
        eventSpawn: {
          gen: { "1": 100 },
          type: { fire: 100 },
          rarity: { ordinary: 100 },
          shiny: 1000,
          whatEvent: null,
          allowedForm: { mega: false, giga: false },
          messageSpawn: { min: 5, max: 10 },
          nightMode: false,
          valueMaxChoiceEgg: 100,
          valueMaxChoiceRaid: 100,
        },
        maxCountMessage: 10,
        countMessage: 0,
        pokemonPresent: {},
      };

      const server = Server.fromMongo(data as any);

      expect(server.eventSpawn.whatEvent).toBeNull();
      expect(server.discordId).toBe("server1");
    });

    it("should create Server with whatEvent", () => {
      const data = {
        discordId: "server2",
        channelAllowed: [],
        charmeChroma: false,
        settings: { language: "eng", spawnMax: 20, spawnMin: 5 },
        savePokemon: {},
        eventSpawn: {
          gen: { "1": 100 },
          type: { fire: 100 },
          rarity: { ordinary: 100 },
          shiny: 1000,
          whatEvent: {
            id: "1",
            name: "testEvent",
            description: "testDesc",
            type: "test",
            color: "#FF0000",
            image: "0001",
            effectDescription: "Effect",
            endTime: new Date(),
            statMultipliers: {},
          },
          allowedForm: { mega: false, giga: false },
          messageSpawn: { min: 5, max: 10 },
          nightMode: false,
          valueMaxChoiceEgg: 100,
          valueMaxChoiceRaid: 100,
        },
        maxCountMessage: 10,
        countMessage: 0,
        pokemonPresent: {},
      };

      const server = Server.fromMongo(data as any);

      expect(server.eventSpawn.whatEvent).toBeDefined();
      expect(server.eventSpawn.whatEvent?.id).toBe("1");
    });

    it("should handle pokemonPresent with entries", () => {
      const data = {
        discordId: "server3",
        channelAllowed: [],
        charmeChroma: false,
        settings: { language: "fr", spawnMax: 20, spawnMin: 5 },
        savePokemon: {},
        eventSpawn: {
          gen: { "1": 100 },
          type: { fire: 100 },
          rarity: { ordinary: 100 },
          shiny: 1000,
          whatEvent: null,
          allowedForm: { mega: false, giga: false },
          messageSpawn: { min: 5, max: 10 },
          nightMode: false,
          valueMaxChoiceEgg: 100,
          valueMaxChoiceRaid: 100,
        },
        maxCountMessage: 10,
        countMessage: 0,
        pokemonPresent: {
          ch1: {
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
            canSosBattle: false,
          },
        },
      };

      const server = Server.fromMongo(data as any);

      expect(server.getPokemonByIdChannel("ch1")).toBeDefined();
      expect(server.getPokemonByIdChannel("ch2")).toBeNull();
    });

    it("should use default settings when missing", () => {
      const data = {
        discordId: "server4",
        channelAllowed: [],
        charmeChroma: false,
        savePokemon: {},
        eventSpawn: {
          gen: { "1": 100 },
          type: { fire: 100 },
          rarity: { ordinary: 100 },
          shiny: 1000,
          whatEvent: null,
          allowedForm: { mega: false, giga: false },
          messageSpawn: { min: 5, max: 10 },
          nightMode: false,
          valueMaxChoiceEgg: 100,
          valueMaxChoiceRaid: 100,
        },
        maxCountMessage: 10,
        countMessage: 0,
        pokemonPresent: {},
      };

      const server = Server.fromMongo(data as any);

      expect(server.settings.language).toBeDefined();
      expect(server.settings.spawnMax).toBeDefined();
    });
  });

  describe("createDefault", () => {
    it("should create server with default values", () => {
      const server = Server.createDefault("server-default");

      expect(server.discordId).toBe("server-default");
      expect(server.channelAllowed).toEqual([]);
      expect(server.charmeChroma).toBe(false);
      expect(server.settings.language).toBeDefined();
      expect(server.settings.spawnMax).toBeDefined();
      expect(server.settings.spawnMin).toBeDefined();
      expect(server.maxCountMessage).toBe(10);
      expect(server.countMessage).toBe(0);
      expect(server.pokemonPresent).toEqual({});
      expect(Object.keys(server.savePokemon.data).length).toBeGreaterThan(0);
    });
  });

  describe("getPokemonByIdChannel", () => {
    it("should return null when channel has no pokemon", () => {
      const server = Server.createDefault("server1");
      expect(server.getPokemonByIdChannel("ch1")).toBeNull();
    });
  });

  describe("removePokemonByIdChannel", () => {
    it("should remove pokemon when present", () => {
      const server = Server.createDefault("server1");
      server.pokemonPresent["ch1"] = {} as any;

      server.removePokemonByIdChannel("ch1");

      expect(server.pokemonPresent["ch1"]).toBeUndefined();
    });

    it("should not throw when channel has no pokemon", () => {
      const server = Server.createDefault("server1");

      expect(() =>
        server.removePokemonByIdChannel("nonexistent"),
      ).not.toThrow();
    });
  });
});

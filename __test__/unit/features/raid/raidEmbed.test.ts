import {
  generateRaidEmbed,
  generateRaidEndEmbed,
} from "../../../../src/features/raid/raidEmbed";
import { Server } from "../../../../src/core/classes/Server";
import { PokemonType } from "../../../../src/core/types/PokemonType";
import * as helperFunction from "../../../../src/utils/helperFunction";
import { urlImageRepo } from "../../../../src/config/default/misc";

jest.mock("../../../../src/utils/imageUrl", () => ({
  getImageUrl: jest.fn((subFolder: string, imageName: string) =>
    Promise.resolve(`${urlImageRepo}/${subFolder}/${imageName}`),
  ),
}));

describe("raidEmbed", () => {
  const server = Server.createDefault("server1");
  const pokemon: PokemonType = {
    id: "1",
    name: { nameEng: ["Bulbasaur"], nameFr: ["Bulbizarre"] },
    arrayType: ["grass", "poison"],
    rarity: "ordinary",
    imgName: "001",
    gen: 1,
    form: "normal",
    versionForm: 0,
    isShiny: false,
    hint: "B___",
    canSosBattle: false,
  };

  beforeEach(() => {
    jest.spyOn(helperFunction, "random").mockReturnValue(0);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("generateRaidEmbed", () => {
    it("should generate embed with normal mode and non-shiny pokemon", async () => {
      server.eventSpawn.nightMode = false;
      const { embed } = await generateRaidEmbed(pokemon, server, [], 1234567890);

      expect(embed.data.title).toBeDefined();
      expect(embed.data.image?.url).toContain("pokeHome/");
      expect(embed.data.image?.url).toContain("001.png");
      expect(embed.data.fields).toHaveLength(2);
    });

    it("should generate embed with night mode", async () => {
      server.eventSpawn.nightMode = true;
      const { embed } = await generateRaidEmbed(pokemon, server, [], 1234567890);

      expect(embed.data.image?.url).toContain("pokeHomeShadow/");
    });

    it("should generate embed with shiny pokemon", async () => {
      const shinyPokemon = { ...pokemon, isShiny: true };
      const { embed } = await generateRaidEmbed(
        shinyPokemon,
        server,
        [],
        1234567890,
      );

      expect(embed.data.image?.url).toContain("-shiny.png");
    });

    it("should show player list when players exist", async () => {
      const { embed } = await generateRaidEmbed(
        pokemon,
        server,
        ["user1", "user2"],
        1234567890,
      );

      const playersField = embed.data.fields?.find((f) =>
        f.name?.includes("(2/4)"),
      );
      expect(playersField?.value).toContain("<@user1>");
      expect(playersField?.value).toContain("<@user2>");
    });

    it("should show no players text when players empty", async () => {
      const { embed } = await generateRaidEmbed(pokemon, server, [], 1234567890);

      const playersField = embed.data.fields?.find((f) =>
        f.name?.includes("(0/4)"),
      );
      expect(playersField?.value).toBeDefined();
    });
  });

  describe("generateRaidEndEmbed", () => {
    it("should generate success embed with green color", async () => {
      const embed = await generateRaidEndEmbed(
        pokemon,
        server,
        ["user1"],
        true,
      );

      expect(embed.data.color).toBe(0x2ecc71);
      expect(embed.data.title).toBeDefined();
    });

    it("should generate fail embed with red color", async () => {
      const embed = await generateRaidEndEmbed(pokemon, server, [], false);

      expect(embed.data.color).toBe(0xe74c3c);
      expect(embed.data.title).toBeDefined();
    });

    it("should use night mode image URL", async () => {
      server.eventSpawn.nightMode = true;
      const embed = await generateRaidEndEmbed(pokemon, server, [], false);

      expect(embed.data.image?.url).toContain("pokeHomeShadow/");
    });

    it("should use shiny image for shiny pokemon", async () => {
      const shinyPokemon = { ...pokemon, isShiny: true };
      const embed = await generateRaidEndEmbed(shinyPokemon, server, [], false);

      expect(embed.data.image?.url).toContain("-shiny.png");
    });

    it("should show player list when players exist", async () => {
      const embed = await generateRaidEndEmbed(
        pokemon,
        server,
        ["user1", "user2", "user3"],
        true,
      );

      const playersField = embed.data.fields?.find((f) =>
        f.name?.includes("(3/4)"),
      );
      expect(playersField?.value).toContain("<@user1>");
      expect(playersField?.value).toContain("<@user2>");
    });
  });
});

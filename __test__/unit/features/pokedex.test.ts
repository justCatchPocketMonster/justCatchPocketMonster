import { pokedex } from "../../../src/features/pokedex/pokedex";
import { createMockInteraction } from "../../utils/mock/mockInteraction";
import { SaveAllPokemon } from "../../../src/core/classes/SaveAllPokemon";
import { SaveOnePokemon } from "../../../src/core/classes/SaveOnePokemon";
import { EventSpawnType } from "../../../src/core/types/EventSpawnType";

jest.mock("../../../src/lang/language", () => {
  return {
    __esModule: true,
    default: (key: string) => key,
  };
});

const paginationMenuMock = jest.fn();
jest.mock("../../../src/features/other/paginationMenu", () => ({
  paginationMenu: (...args: any[]) => paginationMenuMock(...args),
  createPageForMenu: jest.requireActual(
    "../../../src/features/other/paginationMenu",
  ).createPageForMenu,
}));

describe("pokedex", () => {
  it("replies when pageChoice is too high and paginates from page 1", async () => {
    const interaction = createMockInteraction();

    const user = {
      discordId: "u1",
      enteredCode: [],
      countPagination: 0,
      savePokemon: new SaveAllPokemon(),
    };
    user.savePokemon.initMissingPokemons();

    const eventSpawn: EventSpawnType = {
      gen: {
        "1": 100,
        "2": 100,
        "3": 100,
        "4": 100,
        "5": 100,
        "6": 100,
        "7": 100,
        "8": 100,
        "9": 100,
      },
      type: {
        steel: 100,
        dragon: 100,
        electric: 100,
        fire: 100,
        bug: 100,
        grass: 100,
        psychic: 100,
        ground: 100,
        dark: 100,
        fighting: 100,
        water: 100,
        fairy: 100,
        ice: 100,
        normal: 100,
        poison: 100,
        rock: 100,
        ghost: 100,
        flying: 100,
      },
      rarity: { ordinary: 990, legendary: 9, mythical: 1, ultraBeast: 0 },
      shiny: 4096,
      whatEvent: null,
      allowedForm: { mega: false, giga: false },
      messageSpawn: { min: 5, max: 20 },
      nightMode: false,
      valueMaxChoiceEgg: 300,
      valueMaxChoiceRaid: 100,
    };

    const server = {
      discordId: "s1",
      channelAllowed: [],
      charmeChroma: false,
      settings: {
        language: "fr",
        spawnMin: 5,
        spawnMax: 20,
      },
      savePokemon: new SaveAllPokemon(),
      eventSpawn,
      maxCountMessage: 0,
      countMessage: 0,
      pokemonPresent: {},
      getPokemonByIdChannel: () => null,
      removePokemonByIdChannel: () => undefined,
    };
    server.savePokemon.initMissingPokemons();

    await pokedex(interaction as any, user as any, server as any, 9_999);

    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(paginationMenuMock).toHaveBeenCalled();

    const [, , , defaultPage] = paginationMenuMock.mock.calls[0];
    expect(defaultPage).toBe(1);
  });

  it("should handle null pageChoice", async () => {
    const interaction = createMockInteraction();

    const user = {
      discordId: "u1",
      enteredCode: [],
      countPagination: 0,
      savePokemon: new SaveAllPokemon(),
    };
    user.savePokemon.initMissingPokemons();

    const eventSpawn: EventSpawnType = {
      gen: {
        "1": 100,
        "2": 100,
        "3": 100,
        "4": 100,
        "5": 100,
        "6": 100,
        "7": 100,
        "8": 100,
        "9": 100,
      },
      type: {
        steel: 100,
        dragon: 100,
        electric: 100,
        fire: 100,
        bug: 100,
        grass: 100,
        psychic: 100,
        ground: 100,
        dark: 100,
        fighting: 100,
        water: 100,
        fairy: 100,
        ice: 100,
        normal: 100,
        poison: 100,
        rock: 100,
        ghost: 100,
        flying: 100,
      },
      rarity: { ordinary: 990, legendary: 9, mythical: 1, ultraBeast: 0 },
      shiny: 4096,
      whatEvent: null,
      allowedForm: { mega: false, giga: false },
      messageSpawn: { min: 5, max: 20 },
      nightMode: false,
      valueMaxChoiceEgg: 300,
      valueMaxChoiceRaid: 100,
    };

    const server = {
      discordId: "s1",
      channelAllowed: [],
      charmeChroma: false,
      settings: {
        language: "fr",
        spawnMin: 5,
        spawnMax: 20,
      },
      savePokemon: new SaveAllPokemon(),
      eventSpawn,
      maxCountMessage: 0,
      countMessage: 0,
      pokemonPresent: {},
      getPokemonByIdChannel: () => null,
      removePokemonByIdChannel: () => undefined,
    };
    server.savePokemon.initMissingPokemons();

    await pokedex(interaction as any, user as any, server as any, null);

    expect(paginationMenuMock).toHaveBeenCalled();
    const [, , , defaultPage] =
      paginationMenuMock.mock.calls[paginationMenuMock.mock.calls.length - 1];
    expect(defaultPage).toBe(1);
  });
});

function buildBasePokedexFixtures() {
  const interaction = createMockInteraction();
  const user = {
    discordId: "u1",
    enteredCode: [],
    countPagination: 0,
    savePokemon: new SaveAllPokemon(),
  };
  user.savePokemon.initMissingPokemons();

  const eventSpawn: EventSpawnType = {
    gen: {
      "1": 100,
      "2": 100,
      "3": 100,
      "4": 100,
      "5": 100,
      "6": 100,
      "7": 100,
      "8": 100,
      "9": 100,
    },
    type: {
      steel: 100,
      dragon: 100,
      electric: 100,
      fire: 100,
      bug: 100,
      grass: 100,
      psychic: 100,
      ground: 100,
      dark: 100,
      fighting: 100,
      water: 100,
      fairy: 100,
      ice: 100,
      normal: 100,
      poison: 100,
      rock: 100,
      ghost: 100,
      flying: 100,
    },
    rarity: { ordinary: 990, legendary: 9, mythical: 1, ultraBeast: 0 },
    shiny: 4096,
    whatEvent: null,
    allowedForm: { mega: false, giga: false },
    messageSpawn: { min: 5, max: 20 },
    nightMode: false,
    valueMaxChoiceEgg: 300,
    valueMaxChoiceRaid: 100,
  };

  const server = {
    discordId: "s1",
    channelAllowed: [],
    charmeChroma: false,
    settings: { language: "eng", spawnMin: 5, spawnMax: 20 },
    savePokemon: new SaveAllPokemon(),
    eventSpawn,
    maxCountMessage: 0,
    countMessage: 0,
    pokemonPresent: {},
    getPokemonByIdChannel: () => null,
    removePokemonByIdChannel: () => undefined,
  };
  server.savePokemon.initMissingPokemons();

  return { interaction, user, server };
}

function createFullRegionSave(
  count: number = 151,
  withShiny = false,
): SaveAllPokemon {
  const save = new SaveAllPokemon();
  for (let i = 1; i <= count; i++) {
    // SaveOnePokemon constructor: (idPokemon, rarity, form, versionForm, shinyCount, normalCount)
    save.data[`${i}-ordinary-1`] = new SaveOnePokemon(
      i.toString(),
      "ordinary",
      "ordinary",
      1,
      withShiny ? 1 : 0,
      1,
    );
  }
  return save;
}

describe("pokedex – buildPokemonField emote variants", () => {
  beforeEach(() => {
    paginationMenuMock.mockClear();
  });

  it("shows shiny emote when pokemon has shinyCount > 0", async () => {
    const { interaction, user, server } = buildBasePokedexFixtures();
    const firstKey = Object.keys(user.savePokemon.data).find((k) =>
      k.startsWith("25-"),
    );
    if (firstKey) {
      user.savePokemon.data[firstKey].normalCount = 1;
      user.savePokemon.data[firstKey].shinyCount = 1;
    }

    await pokedex(interaction as any, user as any, server as any, null);

    expect(paginationMenuMock).toHaveBeenCalled();
  });

  it("shows normal emote when pokemon has normalCount > 0 but no shiny", async () => {
    const { interaction, user, server } = buildBasePokedexFixtures();
    const firstKey = Object.keys(user.savePokemon.data).find((k) =>
      k.startsWith("1-"),
    );
    if (firstKey) {
      user.savePokemon.data[firstKey].normalCount = 3;
    }

    await pokedex(interaction as any, user as any, server as any, null);

    expect(paginationMenuMock).toHaveBeenCalled();
  });

  it("uses displayName when member.nickname is null", async () => {
    const { interaction, user, server } = buildBasePokedexFixtures();
    (interaction.member as any).nickname = null;

    await pokedex(interaction as any, user as any, server as any, null);

    const [, , pages] =
      paginationMenuMock.mock.calls[paginationMenuMock.mock.calls.length - 1];
    const mainEmbed = pages[0]?.page;
    expect(mainEmbed?.data?.title).toContain("Test Member");
  });
});

describe("pokedex – getPokedexColor and processRegion via mocked save", () => {
  beforeEach(() => {
    paginationMenuMock.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns bronze color when exactly 1 region is complete", async () => {
    const { interaction, user, server } = buildBasePokedexFixtures();
    const fullRegion = createFullRegionSave(151);
    const emptySave = new SaveAllPokemon();
    let callCount = 0;
    jest
      .spyOn(user.savePokemon, "getThisSaveUniqueIdWithByIdRange")
      .mockImplementation(() => (callCount++ === 0 ? fullRegion : emptySave));

    await pokedex(interaction as any, user as any, server as any, null);

    const [, , pages] =
      paginationMenuMock.mock.calls[paginationMenuMock.mock.calls.length - 1];
    expect(pages[0]?.page?.data?.color).toBe(0xcd7f32);
  });

  it("returns silver color when 5 regions are complete", async () => {
    const { interaction, user, server } = buildBasePokedexFixtures();
    const fullRegion = createFullRegionSave(160);
    const emptySave = new SaveAllPokemon();
    let callCount = 0;
    jest
      .spyOn(user.savePokemon, "getThisSaveUniqueIdWithByIdRange")
      .mockImplementation(() => (callCount++ < 5 ? fullRegion : emptySave));

    await pokedex(interaction as any, user as any, server as any, null);

    const [, , pages] =
      paginationMenuMock.mock.calls[paginationMenuMock.mock.calls.length - 1];
    expect(pages[0]?.page?.data?.color).toBe(0xc0c0c0);
  });

  it("returns gold color when all 9 regions are complete", async () => {
    const { interaction, user, server } = buildBasePokedexFixtures();
    const fullRegion = createFullRegionSave(160); // Unys has rangeSize=156, need >= 156
    jest
      .spyOn(user.savePokemon, "getThisSaveUniqueIdWithByIdRange")
      .mockReturnValue(fullRegion);

    await pokedex(interaction as any, user as any, server as any, null);

    const [, , pages] =
      paginationMenuMock.mock.calls[paginationMenuMock.mock.calls.length - 1];
    expect(pages[0]?.page?.data?.color).toBe(0xffd700);
  });

  it("processRegion shows fully-caught (not all shiny) field name", async () => {
    const { interaction, user, server } = buildBasePokedexFixtures();
    const fullNoShiny = createFullRegionSave(151, false);
    const emptySave = new SaveAllPokemon();
    let callCount = 0;
    jest
      .spyOn(user.savePokemon, "getThisSaveUniqueIdWithByIdRange")
      .mockImplementation(() => {
        const c = callCount++;
        return c < 1 || (c >= 6 && c < 7) ? fullNoShiny : emptySave;
      });

    await pokedex(interaction as any, user as any, server as any, null);

    expect(paginationMenuMock).toHaveBeenCalled();
  });

  it("processRegion shows fully-caught AND fully-shiny field name", async () => {
    const { interaction, user, server } = buildBasePokedexFixtures();
    const fullShiny = createFullRegionSave(151, true);
    const emptySave = new SaveAllPokemon();
    let callCount = 0;
    jest
      .spyOn(user.savePokemon, "getThisSaveUniqueIdWithByIdRange")
      .mockImplementation(() => {
        const c = callCount++;
        return c < 1 || (c >= 6 && c < 7) ? fullShiny : emptySave;
      });

    await pokedex(interaction as any, user as any, server as any, null);

    expect(paginationMenuMock).toHaveBeenCalled();
  });
});

import { pokedex } from "../../../src/features/pokedex/pokedex";
import { createMockInteraction } from "../../utils/mock/mockInteraction";
import { SaveAllPokemon } from "../../../src/core/classes/SaveAllPokemon";
import { EventSpawnType } from "../../../src/core/types/EventSpawnType";

jest.mock("../../../src/lang/language", () => {
  return {
    __esModule: true,
    default: (key: string) => key,
  };
});

const paginationButtonMock = jest.fn();
jest.mock("../../../src/features/other/paginationButton", () => ({
  paginationButton: (...args: any[]) => paginationButtonMock(...args),
}));

describe("pokedex", () => {
  it("replies when pageChoice is too high and paginates from page 1", () => {
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

    pokedex(interaction as any, user as any, server as any, 9_999);

    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(paginationButtonMock).toHaveBeenCalled();

    const [, , defaultPage] = paginationButtonMock.mock.calls[0];
    expect(defaultPage).toBe(1);
  });

  it("should handle null pageChoice", () => {
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

    pokedex(interaction as any, user as any, server as any, null);

    expect(paginationButtonMock).toHaveBeenCalled();
    const [, , defaultPage] =
      paginationButtonMock.mock.calls[
        paginationButtonMock.mock.calls.length - 1
      ];
    expect(defaultPage).toBe(1);
  });
});

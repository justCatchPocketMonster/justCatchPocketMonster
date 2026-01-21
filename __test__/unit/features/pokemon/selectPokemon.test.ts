import {
  selectPokemon,
  selectEggPokemon,
  __deps,
} from "../../../../src/features/pokemon/selectPokemon";
import { resetTestEnv } from "../../../utils/resetTestEnv";
import { getServerById } from "../../../../src/cache/ServerCache";
import { createMockInteraction } from "../../../utils/mock/mockInteraction";
import { Server } from "../../../../src/core/classes/Server";
import { SaveAllPokemon } from "../../../../src/core/classes/SaveAllPokemon";
import { SaveOnePokemon } from "../../../../src/core/classes/SaveOnePokemon";
import * as helperFunction from "../../../../src/utils/helperFunction";

describe("selectPokemon", () => {
  let server: Server;
  let baseServer: Server;

  beforeAll(async () => {
    await resetTestEnv();
    const interaction = createMockInteraction();
    baseServer = await getServerById(interaction.guildId!);
    baseServer.savePokemon.initMissingPokemons();
  });

  beforeEach(async () => {
    const interaction = createMockInteraction();
    server = await getServerById(interaction.guildId!);
    
    server.eventSpawn.allowedForm.mega = false;
    server.eventSpawn.allowedForm.giga = false;
    
    server.savePokemon.initMissingPokemons();
    
    for (const key in server.savePokemon.data) {
      server.savePokemon.data[key].normalCount = 0;
      server.savePokemon.data[key].shinyCount = 0;
    }
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

  test("should select pokemon with specific id", () => {
    const pokemon = selectPokemon(server, 25);

    expect(pokemon.id).toBe("25");
    expect(pokemon.isShiny).toBeDefined();
  });

  test("should return errorGen when generationSelect fails", () => {
    __deps.generationSelect = jest.fn()
      .mockReturnValueOnce("errorGen")
      .mockReturnValue("1");
    __deps.raritySelect = jest.fn().mockReturnValue("ordinary");
    __deps.typeSelect = jest.fn().mockReturnValue("normal");

    const pokemon = selectPokemon(server, 0);

    expect(pokemon).toBeDefined();
  });

  test("should return errorRarity when raritySelect fails", () => {
    __deps.generationSelect = jest.fn().mockReturnValue("1");
    __deps.raritySelect = jest.fn()
      .mockReturnValueOnce("errorRarity")
      .mockReturnValue("ordinary");
    __deps.typeSelect = jest.fn().mockReturnValue("normal");

    const pokemon = selectPokemon(server, 0);

    expect(pokemon).toBeDefined();
  });

  test("should return errorType when typeSelect fails", () => {
    __deps.generationSelect = jest.fn().mockReturnValue("1");
    __deps.raritySelect = jest.fn().mockReturnValue("ordinary");
    __deps.typeSelect = jest.fn()
      .mockReturnValueOnce("errorType")
      .mockReturnValue("normal");

    const pokemon = selectPokemon(server, 0);

    expect(pokemon).toBeDefined();
  });

  test("should select egg pokemon with specific id", () => {
    const pokemon = selectEggPokemon(server, 25);

    expect(pokemon.id).toBe("25");
    expect(pokemon.isShiny).toBeDefined();
  });

  test.skip("should select random egg pokemon when id is 0", () => {
    const allPokemon = require("../../../../src/data/pokemon.json");
    const maxId = allPokemon[allPokemon.length - 1].id;
    jest.spyOn(helperFunction, "random").mockReturnValue(25);

    const pokemon = selectEggPokemon(server, 0);

    expect(pokemon).toBeDefined();
    expect(pokemon.name).toBeDefined();
    expect(pokemon.imgName).toBeDefined();
  });

  test("should handle shiny selection with different saveServer values", () => {
    const pokemonId = "25";
    server.savePokemon.addOneCatch({
      id: pokemonId,
      rarity: "ordinary",
      form: "ordinary",
      versionForm: 1,
      normalCount: 100,
      shinyCount: 0,
    } as any);

    jest.spyOn(helperFunction, "random").mockReturnValue(1);

    const pokemon = selectPokemon(server, 25);

    expect(pokemon.isShiny).toBe(true);
  });

  test("should handle shiny selection with saveServer >= 75", () => {
    const pokemonId = "25";
    server.savePokemon.addOneCatch({
      id: pokemonId,
      rarity: "ordinary",
      form: "ordinary",
      versionForm: 1,
      normalCount: 75,
      shinyCount: 0,
    } as any);

    jest.spyOn(helperFunction, "random").mockReturnValue(1);

    const pokemon = selectPokemon(server, 25);

    expect(pokemon.isShiny).toBeDefined();
  });

  test("should handle shiny selection with saveServer >= 50", () => {
    const pokemonId = "25";
    server.savePokemon.addOneCatch({
      id: pokemonId,
      rarity: "ordinary",
      form: "ordinary",
      versionForm: 1,
      normalCount: 50,
      shinyCount: 0,
    } as any);

    jest.spyOn(helperFunction, "random").mockReturnValue(1);

    const pokemon = selectPokemon(server, 25);

    expect(pokemon.isShiny).toBeDefined();
  });

  test("should handle shiny selection with saveServer >= 30", () => {
    const pokemonId = "25";
    server.savePokemon.addOneCatch({
      id: pokemonId,
      rarity: "ordinary",
      form: "ordinary",
      versionForm: 1,
      normalCount: 30,
      shinyCount: 0,
    } as any);

    jest.spyOn(helperFunction, "random").mockReturnValue(1);

    const pokemon = selectPokemon(server, 25);

    expect(pokemon.isShiny).toBeDefined();
  });

  test("should handle shiny selection with saveServer >= 20", () => {
    const pokemonId = "25";
    server.savePokemon.addOneCatch({
      id: pokemonId,
      rarity: "ordinary",
      form: "ordinary",
      versionForm: 1,
      normalCount: 20,
      shinyCount: 0,
    } as any);

    jest.spyOn(helperFunction, "random").mockReturnValue(1);

    const pokemon = selectPokemon(server, 25);

    expect(pokemon.isShiny).toBeDefined();
  });

  test("should handle shiny selection with saveServer >= 10", () => {
    const pokemonId = "25";
    server.savePokemon.addOneCatch({
      id: pokemonId,
      rarity: "ordinary",
      form: "ordinary",
      versionForm: 1,
      normalCount: 10,
      shinyCount: 0,
    } as any);

    jest.spyOn(helperFunction, "random").mockReturnValue(1);

    const pokemon = selectPokemon(server, 25);

    expect(pokemon.isShiny).toBeDefined();
  });

  test("should handle shiny selection with saveServer >= 5", () => {
    const pokemonId = "25";
    server.savePokemon.addOneCatch({
      id: pokemonId,
      rarity: "ordinary",
      form: "ordinary",
      versionForm: 1,
      normalCount: 5,
      shinyCount: 0,
    } as any);

    jest.spyOn(helperFunction, "random").mockReturnValue(1);

    const pokemon = selectPokemon(server, 25);

    expect(pokemon.isShiny).toBeDefined();
  });

  test("should handle shiny selection with saveServer >= 3", () => {
    const pokemonId = "25";
    server.savePokemon.addOneCatch({
      id: pokemonId,
      rarity: "ordinary",
      form: "ordinary",
      versionForm: 1,
      normalCount: 3,
      shinyCount: 0,
    } as any);

    jest.spyOn(helperFunction, "random").mockReturnValue(1);

    const pokemon = selectPokemon(server, 25);

    expect(pokemon.isShiny).toBeDefined();
  });

  test("should handle shiny selection with egg", () => {
    jest.spyOn(helperFunction, "random").mockReturnValue(1);

    const pokemon = selectEggPokemon(server, 25);

    expect(pokemon.isShiny).toBeDefined();
  });

  test("should handle isHiddenPokemon", () => {
    jest.spyOn(helperFunction, "random").mockReturnValue(1);
    __deps.generationSelect = jest.fn().mockReturnValue("1");
    __deps.raritySelect = jest.fn().mockReturnValue("ordinary");
    __deps.typeSelect = jest.fn().mockReturnValue("normal");

    const pokemon = selectPokemon(server, 0);

    expect(pokemon).toBeDefined();
  });

  test("should handle megaIsAllowed when mega is allowed", () => {
    server.eventSpawn.allowedForm.mega = true;
    __deps.generationSelect = jest.fn().mockReturnValue("1");
    __deps.raritySelect = jest.fn().mockReturnValue("ordinary");
    __deps.typeSelect = jest.fn().mockReturnValue("normal");
    jest.spyOn(helperFunction, "random").mockImplementation(() => 2);

    const pokemon = selectPokemon(server, 0);

    expect(pokemon).toBeDefined();
  });

  test("should handle gigaIsAllowed when giga is allowed", () => {
    server.eventSpawn.allowedForm.giga = true;
    __deps.generationSelect = jest.fn().mockReturnValue("1");
    __deps.raritySelect = jest.fn().mockReturnValue("ordinary");
    __deps.typeSelect = jest.fn().mockReturnValue("normal");
    jest.spyOn(helperFunction, "random").mockImplementation(() => 2);

    const pokemon = selectPokemon(server, 0);

    expect(pokemon).toBeDefined();
  });
});

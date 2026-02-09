import { selectSosPokemon } from "../../../../src/features/pokemon/selectPokemon";
import { resetTestEnv } from "../../../utils/resetTestEnv";
import { getServerById } from "../../../../src/cache/ServerCache";
import { createMockInteraction } from "../../../utils/mock/mockInteraction";
import * as helperFunction from "../../../../src/utils/helperFunction";

describe("selectSosPokemon", () => {
  let server: Awaited<ReturnType<typeof getServerById>>;

  beforeAll(async () => {
    await resetTestEnv();
    const interaction = createMockInteraction();
    server = await getServerById(interaction.guildId!);
    server!.savePokemon.initMissingPokemons();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should return pokemon with same id and canSosBattle true", () => {
    const pokemon = selectSosPokemon(server!, "25", 1);

    expect(pokemon.id).toBe("25");
    expect(pokemon.canSosBattle).toBe(true);
    expect(pokemon.sosChainLvl).toBe(1);
  });

  test("should exclude giga form when giga not allowed", () => {
    server!.eventSpawn.allowedForm.giga = false;
    const pokemon = selectSosPokemon(server!, "3", 1);

    expect(pokemon.form).not.toBe("giga");
  });

  test("should exclude mega form when mega not allowed", () => {
    server!.eventSpawn.allowedForm.mega = false;
    const pokemon = selectSosPokemon(server!, "3", 1);

    expect(pokemon.form).not.toBe("mega");
  });

  test("should set isShiny when random returns 1 for shiny rate", () => {
    jest.spyOn(helperFunction, "random").mockImplementation((n: number) => {
      if (n > 100) return 1;
      return 0;
    });
    server!.eventSpawn.shiny = 4096;
    const pokemon = selectSosPokemon(server!, "25", 1);

    expect(pokemon.isShiny).toBe(true);
  });

  test("should set sosChainLvl on returned pokemon", () => {
    const pokemon = selectSosPokemon(server!, "25", 3);

    expect(pokemon.sosChainLvl).toBe(3);
  });
});

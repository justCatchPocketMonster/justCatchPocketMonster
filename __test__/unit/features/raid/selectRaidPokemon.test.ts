import { selectRaidPokemon } from "../../../../src/features/raid/selectRaidPokemon";
import { Server } from "../../../../src/core/classes/Server";
import * as helperFunction from "../../../../src/utils/helperFunction";

describe("selectRaidPokemon", () => {
  const server = Server.createDefault("server1");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return a giga pokemon with correct structure", () => {
    jest.spyOn(helperFunction, "random").mockImplementation((max) => {
      if (max > 10) return 0;
      return 0;
    });

    const result = selectRaidPokemon(server);

    expect(result).toBeDefined();
    expect(result.form).toBe("giga");
    expect(result.id).toBeDefined();
    expect(result.name).toBeDefined();
    expect(result.arrayType).toBeDefined();
    expect(result.imgName).toBeDefined();
    expect(result.hint).toBeDefined();
    expect(result.canSosBattle).toBe(false);
  });

  it("should return shiny pokemon when random returns 1 for shiny check", () => {
    let callCount = 0;
    jest.spyOn(helperFunction, "random").mockImplementation((max) => {
      callCount++;
      if (callCount === 2) return 1;
      return 0;
    });

    server.eventSpawn.shiny = 100;
    const result = selectRaidPokemon(server);

    expect(result.isShiny).toBe(true);
  });

  it("should return non-shiny pokemon when random returns 0 for shiny check", () => {
    jest.spyOn(helperFunction, "random").mockImplementation((max) => {
      if (max > 10) return 0;
      return 0;
    });

    server.eventSpawn.shiny = 100;
    const result = selectRaidPokemon(server);

    expect(result.isShiny).toBe(false);
  });

  it("should use french name for hint when server language is fr", () => {
    server.settings.language = "fr";
    jest.spyOn(helperFunction, "random").mockReturnValue(0);

    const result = selectRaidPokemon(server);

    expect(result.hint).toBeDefined();
    expect(result.name.nameFr).toBeDefined();
  });

  it("should use english name for hint when server language is eng", () => {
    server.settings.language = "eng";
    jest.spyOn(helperFunction, "random").mockReturnValue(0);

    const result = selectRaidPokemon(server);

    expect(result.hint).toBeDefined();
    expect(result.name.nameEng).toBeDefined();
  });
});

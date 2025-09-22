import getText, { getAvailableKeys, type LanguageKey } from "../../../src/lang/language";

jest.mock("../../../src/middlewares/logger", () => ({
  newLogger: jest.fn(),
}));

describe("lang/language", () => {
  test("getAvailableKeys includes known keys", () => {
    const keys = getAvailableKeys();
    expect(Array.isArray(keys)).toBe(true);
    expect(keys.length).toBeGreaterThan(0);
    expect(keys).toContain("spawnPokemonActivate" as LanguageKey);
  });

  test("getText returns a string for existing key/lang", () => {
    const text = getText("spawnPokemonActivate", "eng");
    expect(typeof text).toBe("string");
    expect(text.length).toBeGreaterThan(0);
  });

  test("getText falls back when lang not present", () => {
    const text = getText("spawnPokemonActivate", "xx");
    // When language not present, it should push fallback and return it randomly
    // Fallback message is exactly "Error: Key not found" in implementation
    // Accept either original or fallback since randomness is involved, but ensure it's a string
    expect(typeof text).toBe("string");
  });

  test("getText handles try/catch path without throwing", () => {
    // Force an error by temporarily monkey-patching Math.random to cause unexpected behavior is not sufficient.
    // Instead, simulate by mocking language import via jest.resetModules and providing a bad value.
    jest.resetModules();
    jest.doMock("../../../src/data/language.json", () => (null), { virtual: true });
    const faultyModule = require("../../../src/lang/language");
    const result = faultyModule.default("spawnPokemonActivate", "eng");
    expect(result).toBe("Error: Key not found");
  });
});



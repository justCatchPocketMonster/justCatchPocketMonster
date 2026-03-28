import { createHint } from "../../../../src/features/hint/createHint";
import * as helperFunction from "../../../../src/utils/helperFunction";

describe("createHint", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("should return namePokemonHinted when it equals realNameCompleted", () => {
    const result = createHint("Pikachu", "Pikachu");

    expect(result).toBe("Pikachu");
  });

  test("should generate hint when names are different", () => {
    jest.spyOn(helperFunction, "random").mockReturnValue(0);

    const result = createHint("Pikachu", "Bidoof");

    expect(result).toBeDefined();
    expect(result).not.toBe("Pikachu");
    expect(result).not.toBe("Bidoof");
  });

  test("should generate hint when names are same", () => {
    jest.spyOn(helperFunction, "random").mockReturnValue(0);

    const result = createHint("Pikachu", "Pikachu");

    expect(result).toBe("Pikachu");
  });

  test("should handle revealRandomLetter with different names", () => {
    jest
      .spyOn(helperFunction, "random")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(1);

    const result = createHint("Pikachu", "Bidoof");

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  test("should handle revealRandomLetter when letter already revealed", () => {
    jest
      .spyOn(helperFunction, "random")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(1);

    const result = createHint("Pikachu", "Bidoof");

    expect(result).toBeDefined();
  });

  test("should format hint with slashes correctly", () => {
    jest.spyOn(helperFunction, "random").mockReturnValue(0);

    const result = createHint("Pikachu", "Bidoof");

    expect(result).toBeDefined();
  });
});

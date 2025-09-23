import {
  colorByType,
  getPercentage,
  capitalizeFirstLetter,
  deepCloneObject,
} from "../../../src/utils/helperFunction";

describe("utils/helperFunction", () => {
  test("colorByType returns known colors and default", () => {
    expect(colorByType("fire")).toBe("EE8130");
    expect(colorByType("water")).toBe("6390F0");
    expect(colorByType("unknown_type" as any)).toBe("FFFFFF");
  });

  test("getPercentage rounds to 1 decimal", () => {
    expect(getPercentage(1, 3)).toBe(33.3);
    expect(getPercentage(2, 4)).toBe(50.0);
  });

  test("capitalizeFirstLetter capitalizes correctly", () => {
    expect(capitalizeFirstLetter("pikachu")).toBe("Pikachu");
    expect(capitalizeFirstLetter("Pikachu")).toBe("Pikachu");
    expect(capitalizeFirstLetter("")).toBe("");
  });

  test("deepCloneObject clones plain object deeply", () => {
    const original = { a: 1, b: { c: 2 } };
    const clone = deepCloneObject(original);
    expect(clone).toEqual(original);
    expect(clone).not.toBe(original);
    // mutate clone
    (clone as any).b.c = 3;
    expect(original.b.c).toBe(2);
  });
});

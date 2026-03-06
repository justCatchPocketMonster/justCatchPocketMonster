import {
  findMenuOption,
  buildEmbedDescription,
} from "../../../../src/utils/menu/utils";
import { MenuOption } from "../../../../src/utils/menu/types";

describe("menu utils", () => {
  const menuOptions: MenuOption[] = [
    {
      label: "Option 1",
      value: "option1",
      description: "Description 1",
      children: [
        {
          label: "Sub Option 1",
          value: "sub1",
          description: "Sub Description 1",
        },
      ],
    },
    {
      label: "Option 2",
      value: "option2",
      description: "Description 2",
    },
  ];

  test("findMenuOption should find option at root level", () => {
    const found = findMenuOption(menuOptions, "option1");
    expect(found).toBeDefined();
    expect(found?.value).toBe("option1");
  });

  test("findMenuOption should find option in children", () => {
    const found = findMenuOption(menuOptions, "sub1");
    expect(found).toBeDefined();
    expect(found?.value).toBe("sub1");
  });

  test("findMenuOption should return undefined for non-existent option", () => {
    const found = findMenuOption(menuOptions, "nonexistent");
    expect(found).toBeUndefined();
  });

  test("findMenuOption should handle empty array", () => {
    const found = findMenuOption([], "option1");
    expect(found).toBeUndefined();
  });

  test("buildEmbedDescription should build single level", () => {
    const path = [{ value: "opt1", label: "Option 1" }];
    const result = buildEmbedDescription(path, "Main: ", "  ");
    expect(result).toBe("Main: **Option 1**");
  });

  test("buildEmbedDescription should build nested levels", () => {
    const path = [
      { value: "opt1", label: "Level 1" },
      { value: "opt2", label: "Level 2" },
      { value: "opt3", label: "Level 3" },
    ];
    const result = buildEmbedDescription(path, "Main: ", "  ");
    expect(result).toContain("Main: **Level 1**");
    expect(result).toContain("\n  **Level 2**");
    expect(result).toContain("\n    **Level 3**");
  });
});

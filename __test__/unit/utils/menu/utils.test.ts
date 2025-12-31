import { findMenuOption } from "../../../../src/utils/menu/utils";
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
});

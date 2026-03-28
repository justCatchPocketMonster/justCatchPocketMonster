import {
  buildAllMenus,
  MenuBuilderOptions,
} from "../../../../src/utils/menu/menuBuilder";
import { MenuOption, SelectionPath } from "../../../../src/utils/menu/types";

describe("menuBuilder", () => {
  const menuOptions: MenuOption[] = [
    {
      label: "Option 1",
      value: "option1",
      description: "Description 1",
      placeholder: "Select option 1",
      children: [
        {
          label: "Sub Option 1",
          value: "sub1",
          description: "Sub Description 1",
        },
        {
          label: "Sub Option 2",
          value: "sub2",
          description: "Sub Description 2",
        },
      ],
    },
    {
      label: "Option 2",
      value: "option2",
      description: "Description 2",
      children: [
        {
          label: "Sub Option 3",
          value: "sub3",
          description: "Sub Description 3",
        },
      ],
    },
  ];

  const options: MenuBuilderOptions = {
    subElementPlaceholder: "Select a sub-element",
  };

  test("buildAllMenus should return empty array for empty selection path", () => {
    const selectionPath: SelectionPath[] = [];
    const components = buildAllMenus(selectionPath, menuOptions, options);

    expect(components).toBeDefined();
    expect(components.length).toBe(0);
  });

  test("buildAllMenus should build menu for first level selection", () => {
    const selectionPath: SelectionPath[] = [
      { value: "option1", label: "Option 1" },
    ];
    const components = buildAllMenus(selectionPath, menuOptions, options);

    expect(components.length).toBe(2);
    const menuData = (components[0].components[0] as any).toJSON();
    expect(menuData.custom_id).toBe("menu_0_option1");
  });

  test("buildAllMenus should use custom placeholder when available", () => {
    const selectionPath: SelectionPath[] = [
      { value: "option1", label: "Option 1" },
    ];
    const components = buildAllMenus(selectionPath, menuOptions, options);

    const menuData = (components[0].components[0] as any).toJSON();
    expect(menuData.placeholder).toBe("Select option 1");
  });

  test("buildAllMenus should use default placeholder when custom not available", () => {
    const selectionPath: SelectionPath[] = [
      { value: "option2", label: "Option 2" },
    ];
    const components = buildAllMenus(selectionPath, menuOptions, options);

    const nextMenuData = (components[1].components[0] as any).toJSON();
    expect(nextMenuData.placeholder).toBe("Select a sub-element");
  });

  test("buildAllMenus should build menus for nested selection", () => {
    const selectionPath: SelectionPath[] = [
      { value: "option1", label: "Option 1" },
      { value: "sub1", label: "Sub Option 1" },
    ];
    const components = buildAllMenus(selectionPath, menuOptions, options);

    expect(components.length).toBe(2);
    const menu1Data = (components[0].components[0] as any).toJSON();
    const menu2Data = (components[1].components[0] as any).toJSON();
    expect(menu1Data.custom_id).toBe("menu_0_option1");
    expect(menu2Data.custom_id).toBe("menu_1_option1_sub1");
  });

  test("buildAllMenus should mark selected option as default", () => {
    const selectionPath: SelectionPath[] = [
      { value: "option1", label: "Option 1" },
    ];
    const components = buildAllMenus(selectionPath, menuOptions, options);

    const menuData = (components[0].components[0] as any).toJSON();
    const selectedOption = menuData.options.find(
      (opt: any) => opt.default === true,
    );
    expect(selectedOption).toBeDefined();
    expect(selectedOption.value).toBe("option1");
  });
});

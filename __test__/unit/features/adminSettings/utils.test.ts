import {
  createShowValuesButton,
  createDisabledButton,
  buildEmbedDescription,
  findMenuOption,
} from "../../../../src/features/adminSettings/utils";
import { MenuOption } from "../../../../src/utils/menu/types";
import { ButtonBuilder, ButtonStyle } from "discord.js";

describe("adminSettings utils", () => {
  describe("createShowValuesButton", () => {
    test("should create a button with correct properties", () => {
      const button = createShowValuesButton("fr");
      const buttonData = button.toJSON() as any;

      expect(buttonData.custom_id).toBe("show_values");
      expect(buttonData.style).toBe(ButtonStyle.Primary);
      expect(buttonData.disabled).toBeUndefined();
    });

    test("should throw error for invalid label", () => {
      const languageModule = require("../../../../src/lang/language");
      const originalLanguage = languageModule.default;
      languageModule.default = jest.fn().mockReturnValue("");

      expect(() => createShowValuesButton("fr")).toThrow();

      languageModule.default = originalLanguage;
    });
  });

  describe("createDisabledButton", () => {
    test("should create a disabled button", () => {
      const button = createDisabledButton("eng");
      const buttonData = button.toJSON() as any;

      expect(buttonData.custom_id).toBe("show_values");
      expect(buttonData.style).toBe(ButtonStyle.Secondary);
      expect(buttonData.disabled).toBe(true);
      expect(buttonData.label).toBeDefined();
      expect(buttonData.label.length).toBeGreaterThan(0);
      expect(buttonData.label.length).toBeLessThanOrEqual(80);
    });
  });

  describe("buildEmbedDescription", () => {
    test("should build description for single level selection", () => {
      const selectionPath = [{ value: "option1", label: "Option 1" }];
      const description = buildEmbedDescription(selectionPath, "fr");

      expect(description).toContain("Option 1");
    });

    test("should build description for nested selection", () => {
      const selectionPath = [
        { value: "option1", label: "Option 1" },
        { value: "sub1", label: "Sub Option 1" },
      ];
      const description = buildEmbedDescription(selectionPath, "fr");

      expect(description).toContain("Option 1");
      expect(description).toContain("Sub Option 1");
    });
  });

  describe("findMenuOption", () => {
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

    test("should find option at root level", () => {
      const found = findMenuOption(menuOptions, "option1");
      expect(found).toBeDefined();
      expect(found?.value).toBe("option1");
    });

    test("should find option in children", () => {
      const found = findMenuOption(menuOptions, "sub1");
      expect(found).toBeDefined();
      expect(found?.value).toBe("sub1");
    });

    test("should return undefined for non-existent option", () => {
      const found = findMenuOption(menuOptions, "nonexistent");
      expect(found).toBeUndefined();
    });
  });

  describe("handleButtonClick", () => {
    test("should handle button click", async () => {
      const mockButtonInteraction = {
        deferUpdate: jest.fn().mockResolvedValue(undefined),
        editReply: jest.fn().mockResolvedValue(undefined),
      } as any;

      const mockMessage = {
        id: "message123",
      } as any;

      const selectionPath = [{ value: "option1", label: "Option 1" }];

      const {
        handleButtonClick,
      } = require("../../../../src/features/adminSettings/utils");
      await handleButtonClick(
        mockButtonInteraction,
        mockMessage,
        selectionPath,
        "eng",
      );

      expect(mockButtonInteraction.deferUpdate).toHaveBeenCalled();
      expect(mockButtonInteraction.editReply).toHaveBeenCalled();
    });
  });
});

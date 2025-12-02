import {
  handleMenuSelection,
  MenuHandlerConfig,
} from "../../../../src/utils/menu/menuHandler";
import { MenuOption, SelectionPath } from "../../../../src/utils/menu/types";
import { StringSelectMenuInteraction, Message, EmbedBuilder } from "discord.js";

describe("menuHandler", () => {
  let mockInteraction: any;
  let mockMessage: any;
  let menuOptions: MenuOption[];
  let config: MenuHandlerConfig<any>;

  beforeEach(() => {
    menuOptions = [
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
    ];

    mockMessage = {
      id: "message123",
    } as Message;

    mockInteraction = {
      customId: "main_menu",
      values: ["option1"],
      replied: false,
      deferred: false,
      deferUpdate: jest.fn().mockResolvedValue(undefined),
      editReply: jest.fn().mockResolvedValue(undefined),
    } as unknown as StringSelectMenuInteraction;

    config = {
      menuOptions,
      menuHandlers: new Map(),
      currentSelectionPath: new Map(),
      getMainEmbed: jest.fn().mockResolvedValue(new EmbedBuilder()),
      mainMenuText: "Main menu: ",
      subElementText: "Sub-element: ",
      selectSubElementText: "Select a sub-element:",
      clickButtonConfirmText: "Click to confirm",
      subElementPlaceholder: "Select a sub-element",
      lang: "eng",
    };
  });

  test("handleMenuSelection should handle main menu selection", async () => {
    await handleMenuSelection(
      mockInteraction,
      mockMessage,
      "main_menu",
      config,
    );

    expect(mockInteraction.deferUpdate).toHaveBeenCalled();
    expect(mockInteraction.editReply).toHaveBeenCalled();
  });

  test("handleMenuSelection should handle nested menu selection", async () => {
    mockInteraction.customId = "menu_1_option1";
    mockInteraction.values = ["sub1"];

    await handleMenuSelection(
      mockInteraction,
      mockMessage,
      "menu_1_option1",
      config,
    );

    expect(mockInteraction.deferUpdate).toHaveBeenCalled();
    expect(mockInteraction.editReply).toHaveBeenCalled();
  });

  test("handleMenuSelection should not process if already replied", async () => {
    mockInteraction.replied = true;

    await handleMenuSelection(
      mockInteraction,
      mockMessage,
      "main_menu",
      config,
    );

    expect(mockInteraction.deferUpdate).not.toHaveBeenCalled();
  });

  test("handleMenuSelection should not process if already deferred", async () => {
    mockInteraction.deferred = true;

    await handleMenuSelection(
      mockInteraction,
      mockMessage,
      "main_menu",
      config,
    );

    expect(mockInteraction.deferUpdate).not.toHaveBeenCalled();
  });

  test("handleMenuSelection should handle leaf node with confirm button", async () => {
    menuOptions[0].children = undefined;
    mockInteraction.customId = "main_menu";
    mockInteraction.values = ["option1"];

    await handleMenuSelection(
      mockInteraction,
      mockMessage,
      "main_menu",
      config,
    );

    expect(mockInteraction.deferUpdate).toHaveBeenCalled();
    expect(mockInteraction.editReply).toHaveBeenCalled();
  });
});

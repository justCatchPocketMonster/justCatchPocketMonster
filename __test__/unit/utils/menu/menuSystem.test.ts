import {
  MenuSystem,
  MenuSystemConfig,
} from "../../../../src/utils/menu/menuSystem";
import {
  MenuHandler,
  MenuOption,
  SelectionPath,
} from "../../../../src/utils/menu/types";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { createMockInteraction } from "../../../utils/mock/mockInteraction";

jest.mock("../../../../src/middlewares/logger", () => ({
  newLogger: jest.fn(),
}));

class MockHandler implements MenuHandler {
  value: string;
  constructor(value: string) {
    this.value = value;
  }
  getMenuStructure(): MenuOption {
    return {
      label: `Option ${this.value}`,
      value: this.value,
      description: `Description ${this.value}`,
      placeholder: `Placeholder ${this.value}`,
    };
  }
  async handleAction(selectionPath: SelectionPath[]): Promise<void> {
    // Mock implementation
  }
}

describe("MenuSystem", () => {
  let interaction: any;
  let config: MenuSystemConfig<MenuHandler>;
  let menuSystem: MenuSystem<MenuHandler>;

  beforeEach(() => {
    interaction = createMockInteraction();

    const handlers = new Map<string, MenuHandler>();
    handlers.set("option1", new MockHandler("option1"));
    handlers.set("option2", new MockHandler("option2"));

    config = {
      regenerateMenu: () => handlers,
      getMainEmbed: async () => new EmbedBuilder().setTitle("Test Menu"),
      mainMenuPlaceholder: "Select an option",
      mainMenuText: "Main: ",
      subElementText: "Sub: ",
      selectSubElementText: "Select: ",
      clickButtonConfirmText: "Confirm",
      subElementPlaceholder: "Select sub-element",
      lang: "eng",
      createConfirmButton: (lang: string) =>
        new ButtonBuilder()
          .setCustomId("show_values")
          .setLabel("Show Values")
          .setStyle(ButtonStyle.Primary),
      timeout: 60000,
      resetOnButtonClick: false,
    };

    menuSystem = new MenuSystem(config);
  });

  test("should initialize menu system", async () => {
    await menuSystem.initialize(interaction);

    expect(interaction.reply).toHaveBeenCalled();
    const replyCall = (interaction.reply as jest.Mock).mock.calls[0][0];
    expect(replyCall.embeds).toBeDefined();
  });

  test("should handle button click with resetOnButtonClick true", async () => {
    config.resetOnButtonClick = true;
    menuSystem = new MenuSystem(config);
    await menuSystem.initialize(interaction);

    const mockMessage = {
      id: "message123",
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === "collect") {
            setTimeout(() => {
              callback({
                customId: "show_values",
                user: { id: interaction.user.id },
                editReply: jest.fn().mockResolvedValue(undefined),
                deferUpdate: jest.fn().mockResolvedValue(undefined),
              });
            }, 10);
          }
          return {
            on: jest.fn(),
            stop: jest.fn(),
          };
        }),
        stop: jest.fn(),
      }),
    };

    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);
    await menuSystem.initialize(interaction);

    await new Promise((resolve) => setTimeout(resolve, 50));
  });

  test("should handle button click with resetOnButtonClick false", async () => {
    config.resetOnButtonClick = false;
    config.buttonValidationMessage = "Action confirmed!";
    menuSystem = new MenuSystem(config);
    await menuSystem.initialize(interaction);
  });

  test("should handle button click without onButtonClick", async () => {
    delete config.onButtonClick;
    menuSystem = new MenuSystem(config);
    await menuSystem.initialize(interaction);
  });

  test("should handle button click with onButtonClick", async () => {
    config.onButtonClick = jest.fn().mockResolvedValue(undefined);
    menuSystem = new MenuSystem(config);
    await menuSystem.initialize(interaction);
  });

  test("should handle collector end with timeout", async () => {
    const mockMessage = {
      id: "message123",
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === "end") {
            setTimeout(() => {
              callback(new Map(), "time");
            }, 10);
          }
          return {
            on: jest.fn(),
            stop: jest.fn(),
          };
        }),
        stop: jest.fn(),
      }),
    };

    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);
    (interaction.editReply as jest.Mock).mockResolvedValue(undefined);

    await menuSystem.initialize(interaction);
    await new Promise((resolve) => setTimeout(resolve, 50));
  });

  test("should handle collector end with onEnd callback", async () => {
    config.onEnd = jest.fn();
    menuSystem = new MenuSystem(config);

    const mockMessage = {
      id: "message123",
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === "end") {
            setTimeout(() => {
              callback(new Map(), "time");
            }, 10);
          }
          return {
            on: jest.fn(),
            stop: jest.fn(),
          };
        }),
        stop: jest.fn(),
      }),
    };

    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);
    (interaction.editReply as jest.Mock).mockResolvedValue(undefined);

    await menuSystem.initialize(interaction);
    await new Promise((resolve) => setTimeout(resolve, 50));
  });

  test("should stop collectors", () => {
    const stopSpy = jest.fn();
    menuSystem["mainCollector"] = { stop: stopSpy };
    menuSystem["buttonCollector"] = { stop: stopSpy };

    menuSystem.stop();

    expect(stopSpy).toHaveBeenCalledTimes(2);
  });

  test("should stop collectors with onEnd callback", () => {
    config.onEnd = jest.fn();
    menuSystem = new MenuSystem(config);

    const stopSpy = jest.fn();
    menuSystem["mainCollector"] = { stop: stopSpy };
    menuSystem["buttonCollector"] = { stop: stopSpy };

    menuSystem.stop();

    expect(stopSpy).toHaveBeenCalledTimes(2);
    expect(config.onEnd).toHaveBeenCalled();
  });

  test("should handle async regenerateMenu", async () => {
    config.regenerateMenu = async () => {
      const handlers = new Map<string, MenuHandler>();
      handlers.set("option1", new MockHandler("option1"));
      return handlers;
    };
    menuSystem = new MenuSystem(config);
    await menuSystem.initialize(interaction);

    expect(interaction.reply).toHaveBeenCalled();
  });

  test("should handle error in button collector", async () => {
    const mockMessage = {
      id: "message123",
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === "collect") {
            setTimeout(() => {
              try {
                callback({
                  customId: "show_values",
                  user: { id: interaction.user.id },
                  editReply: jest
                    .fn()
                    .mockRejectedValue(new Error("Test error")),
                  deferUpdate: jest.fn().mockResolvedValue(undefined),
                });
              } catch (e) {
                // Error handled
              }
            }, 10);
          }
          return {
            on: jest.fn(),
            stop: jest.fn(),
          };
        }),
        stop: jest.fn(),
      }),
    };

    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);
    await menuSystem.initialize(interaction);

    await new Promise((resolve) => setTimeout(resolve, 50));
  });

  test("should handle error in handleAction", async () => {
    class ErrorHandler implements MenuHandler {
      getMenuStructure(): MenuOption {
        return {
          label: "Error Option",
          value: "error",
          description: "Error description",
        };
      }
      async handleAction(selectionPath: SelectionPath[]): Promise<void> {
        throw new Error("Test error");
      }
    }

    const handlers = new Map<string, MenuHandler>();
    handlers.set("error", new ErrorHandler());
    config.regenerateMenu = () => handlers;
    menuSystem = new MenuSystem(config);

    await menuSystem.initialize(interaction);
  });

  test("should handle handler not found", async () => {
    const mockMessage = {
      id: "message123",
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === "collect") {
            setTimeout(() => {
              callback({
                customId: "show_values",
                user: { id: interaction.user.id },
                editReply: jest.fn().mockResolvedValue(undefined),
                deferUpdate: jest.fn().mockResolvedValue(undefined),
              });
            }, 10);
          }
          return {
            on: jest.fn(),
            stop: jest.fn(),
          };
        }),
        stop: jest.fn(),
      }),
    };

    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);

    menuSystem["currentSelectionPath"].set("message123", [
      { value: "nonexistent", label: "Nonexistent" },
    ]);

    await menuSystem.initialize(interaction);
    await new Promise((resolve) => setTimeout(resolve, 50));
  });

  test("should handle empty selectionPath", async () => {
    const mockMessage = {
      id: "message123",
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === "collect") {
            setTimeout(() => {
              callback({
                customId: "show_values",
                user: { id: interaction.user.id },
                editReply: jest.fn().mockResolvedValue(undefined),
                deferUpdate: jest.fn().mockResolvedValue(undefined),
              });
            }, 10);
          }
          return {
            on: jest.fn(),
            stop: jest.fn(),
          };
        }),
        stop: jest.fn(),
      }),
    };

    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);

    menuSystem["currentSelectionPath"].set("message123", []);

    await menuSystem.initialize(interaction);
    await new Promise((resolve) => setTimeout(resolve, 50));
  });

  test("should use placeholder from menu option", async () => {
    const handlers = new Map<string, MenuHandler>();
    const handler = new MockHandler("option1");
    handlers.set("option1", handler);
    config.regenerateMenu = () => handlers;
    menuSystem = new MenuSystem(config);

    await menuSystem.initialize(interaction);

    expect(interaction.editReply).toHaveBeenCalled();
  });

  test("should handle collector end error", async () => {
    let editReplyCallCount = 0;
    const editReplyMock = jest.fn().mockImplementation(() => {
      editReplyCallCount++;
      // Only reject on the second call (during collector end)
      if (editReplyCallCount > 1) {
        return Promise.reject(new Error("Edit error"));
      }
      return Promise.resolve(undefined);
    });

    const mockMessage = {
      id: "message123",
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === "end") {
            setTimeout(() => {
              callback(new Map(), "time");
            }, 10);
          }
          return {
            on: jest.fn(),
            stop: jest.fn(),
          };
        }),
        stop: jest.fn(),
      }),
    };

    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);
    (interaction.editReply as jest.Mock) = editReplyMock;

    await menuSystem.initialize(interaction);
    await new Promise((resolve) => setTimeout(resolve, 50));

    // The error should be caught and logged, not thrown
    expect(editReplyMock).toHaveBeenCalled();
  });

  test("should handle button click without createConfirmButton", async () => {
    delete config.createConfirmButton;
    config.resetOnButtonClick = false;
    menuSystem = new MenuSystem(config);
    await menuSystem.initialize(interaction);

    const mockMessage = {
      id: "message123",
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === "collect") {
            setTimeout(() => {
              callback({
                customId: "show_values",
                user: { id: interaction.user.id },
                editReply: jest.fn().mockResolvedValue(undefined),
                deferUpdate: jest.fn().mockResolvedValue(undefined),
              });
            }, 10);
          }
          return {
            on: jest.fn(),
            stop: jest.fn(),
          };
        }),
        stop: jest.fn(),
      }),
    };

    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);
    await menuSystem.initialize(interaction);

    await new Promise((resolve) => setTimeout(resolve, 50));
  });

  test("should handle button click with buttonValidationMessage", async () => {
    config.resetOnButtonClick = false;
    config.buttonValidationMessage = "Custom validation message";
    menuSystem = new MenuSystem(config);
    await menuSystem.initialize(interaction);

    const mockMessage = {
      id: "message123",
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === "collect") {
            setTimeout(() => {
              callback({
                customId: "show_values",
                user: { id: interaction.user.id },
                editReply: jest.fn().mockResolvedValue(undefined),
                deferUpdate: jest.fn().mockResolvedValue(undefined),
              });
            }, 10);
          }
          return {
            on: jest.fn(),
            stop: jest.fn(),
          };
        }),
        stop: jest.fn(),
      }),
    };

    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);
    await menuSystem.initialize(interaction);

    await new Promise((resolve) => setTimeout(resolve, 50));
  });

  test("should handle collector end with non-timeout reason", async () => {
    const mockMessage = {
      id: "message123",
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === "end") {
            setTimeout(() => {
              callback(new Map(), "user");
            }, 10);
          }
          return {
            on: jest.fn(),
            stop: jest.fn(),
          };
        }),
        stop: jest.fn(),
      }),
    };

    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);
    (interaction.editReply as jest.Mock).mockResolvedValue(undefined);

    await menuSystem.initialize(interaction);
    await new Promise((resolve) => setTimeout(resolve, 50));
  });

  test("should handle collector end with collected items", async () => {
    const mockMessage = {
      id: "message123",
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === "end") {
            setTimeout(() => {
              const collected = new Map();
              collected.set("item1", {});
              callback(collected, "time");
            }, 10);
          }
          return {
            on: jest.fn(),
            stop: jest.fn(),
          };
        }),
        stop: jest.fn(),
      }),
    };

    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);
    (interaction.editReply as jest.Mock).mockResolvedValue(undefined);

    await menuSystem.initialize(interaction);
    await new Promise((resolve) => setTimeout(resolve, 50));
  });

  test("should handle mainCollector with customId not main_menu", async () => {
    const mockMessage = {
      id: "message123",
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === "collect") {
            setTimeout(() => {
              callback({
                customId: "menu_option1",
                user: { id: interaction.user.id },
                values: ["option1"],
                deferUpdate: jest.fn().mockResolvedValue(undefined),
              });
            }, 10);
          }
          return {
            on: jest.fn(),
            stop: jest.fn(),
          };
        }),
        stop: jest.fn(),
      }),
    };

    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);
    await menuSystem.initialize(interaction);

    await new Promise((resolve) => setTimeout(resolve, 50));
  });

  test("should handle setupMainMenu with null message", async () => {
    menuSystem["message"] = null;
    await menuSystem["setupMainMenu"](interaction);
    // Should return early without error
  });

  test("should handle error in handleMenuSelection", async () => {
    const mockMessage = {
      id: "message123",
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === "collect") {
            setTimeout(() => {
              callback({
                customId: "main_menu",
                user: { id: interaction.user.id },
                values: ["option1"],
                deferUpdate: jest.fn().mockRejectedValue(new Error("Error")),
              });
            }, 10);
          }
          return {
            on: jest.fn(),
            stop: jest.fn(),
          };
        }),
        stop: jest.fn(),
      }),
    };

    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);
    await menuSystem.initialize(interaction);

    await new Promise((resolve) => setTimeout(resolve, 50));
  });
});

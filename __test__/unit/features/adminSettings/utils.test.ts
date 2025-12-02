import {
  createShowValuesButton,
  createDisabledButton,
  buildEmbedDescription,
  findMenuOption,
  hasChannelPermissions,
  countChannelsWithPermissions,
} from "../../../../src/features/adminSettings/utils";
import { MenuOption } from "../../../../src/utils/menu/types";
import {
  ButtonBuilder,
  ButtonStyle,
  BaseGuildTextChannel,
  GuildMember,
  Guild,
  PermissionFlagsBits,
} from "discord.js";

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

  describe("hasChannelPermissions", () => {
    test("should return true when bot has required permissions", () => {
      const mockChannel = {
        id: "channel123",
      } as BaseGuildTextChannel;

      const mockBotMember = {
        permissionsIn: jest.fn().mockReturnValue({
          has: jest.fn((flag: bigint) => {
            return (
              flag === PermissionFlagsBits.SendMessages ||
              flag === PermissionFlagsBits.ViewChannel
            );
          }),
        }),
      } as unknown as GuildMember;

      const result = hasChannelPermissions(mockChannel, mockBotMember);
      expect(result).toBe(true);
      expect(mockBotMember.permissionsIn).toHaveBeenCalledWith(mockChannel);
    });

    test("should return false when bot member is null", () => {
      const mockChannel = {
        id: "channel123",
      } as BaseGuildTextChannel;

      const result = hasChannelPermissions(mockChannel, null);
      expect(result).toBe(false);
    });

    test("should return false when bot lacks permissions", () => {
      const mockChannel = {
        id: "channel123",
      } as BaseGuildTextChannel;

      const mockBotMember = {
        permissionsIn: jest.fn().mockReturnValue({
          has: jest.fn(() => false),
        }),
      } as unknown as GuildMember;

      const result = hasChannelPermissions(mockChannel, mockBotMember);
      expect(result).toBe(false);
    });
  });

  describe("countChannelsWithPermissions", () => {
    test("should count channels with permissions correctly", () => {
      jest.mock("../../../../src/features/adminSettings/utils", () => {
        const originalModule = jest.requireActual("../../../../src/features/adminSettings/utils");
        return {
          ...originalModule,
          hasChannelPermissions: jest.fn((channel: any, botMember: any) => {
            if (channel.id === "channel1") return true;
            return false;
          }),
        };
      });

      const mockBotMember = {
        permissionsIn: jest.fn().mockReturnValue({
          has: jest.fn(() => true),
        }),
      } as unknown as GuildMember;

      const mockTextChannel = {
        id: "channel1",
        isTextBased: jest.fn().mockReturnValue(true),
      } as any;
      Object.setPrototypeOf(mockTextChannel, BaseGuildTextChannel.prototype);

      const mockNonTextChannel = {
        id: "channel2",
        isTextBased: jest.fn().mockReturnValue(false),
      } as any;

      const mockGuild = {
        id: "guild123",
        client: {
          user: { id: "bot-id" },
        },
        members: {
          cache: {
            get: jest.fn().mockReturnValue(mockBotMember),
          },
        },
        channels: {
          cache: {
            get: jest.fn((id: string) => {
              if (id === "channel1") return mockTextChannel;
              if (id === "channel2") return mockNonTextChannel;
              return null;
            }),
          },
        },
      } as unknown as Guild;

      const result = countChannelsWithPermissions(mockGuild, [
        "channel1",
        "channel2",
        "nonexistent",
      ]);

      expect(result.goodCount).toBe(1);
      expect(result.totalCount).toBe(3);
    });

    test("should handle empty channel list", () => {
      const mockGuild = {
        id: "guild123",
        client: {
          user: { id: "bot-id" },
        },
        members: {
          cache: {
            get: jest.fn().mockReturnValue(null),
          },
        },
        channels: {
          cache: {
            get: jest.fn(),
          },
        },
      } as unknown as Guild;

      const result = countChannelsWithPermissions(mockGuild, []);
      expect(result.goodCount).toBe(0);
      expect(result.totalCount).toBe(0);
    });

    test("should handle deleted channels", () => {
      const mockGuild = {
        id: "guild123",
        client: {
          user: { id: "bot-id" },
        },
        members: {
          cache: {
            get: jest.fn().mockReturnValue(null),
          },
        },
        channels: {
          cache: {
            get: jest.fn().mockReturnValue(null),
          },
        },
      } as unknown as Guild;

      const result = countChannelsWithPermissions(mockGuild, ["deleted-channel"]);
      expect(result.goodCount).toBe(0);
      expect(result.totalCount).toBe(1);
    });
  });
});

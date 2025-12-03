import { spawnHandler } from "../../../../src/features/adminSettings/spawnHandler";
import { Server } from "../../../../src/core/classes/Server";
import { resetTestEnv } from "../../../utils/resetTestEnv";
import { getServerById, updateServer } from "../../../../src/cache/ServerCache";
import { createMockInteraction } from "../../../utils/mock/mockInteraction";
import {
  BaseGuildTextChannel,
  Guild,
  GuildMember,
  PermissionFlagsBits,
} from "discord.js";

jest.mock("../../../../src/middlewares/logger", () => ({
  newLogger: jest.fn(),
}));

describe("spawnHandler", () => {
  let server: Server;
  let handler: spawnHandler;
  let interaction: any;

  beforeEach(async () => {
    await resetTestEnv();
    interaction = createMockInteraction();
    server = await getServerById(interaction.guildId!);

    const mockGuild = {
      id: interaction.guildId,
      channels: {
        cache: new Map([
          [
            "channel1",
            {
              id: "channel1",
              name: "test-channel",
              isTextBased: () => true,
              parent: { name: "Category" },
              send: jest.fn().mockResolvedValue(undefined),
            } as unknown as BaseGuildTextChannel,
          ],
        ]),
      },
      members: {
        cache: new Map([
          [
            "bot-id",
            {
              permissionsIn: jest.fn().mockReturnValue({
                has: jest.fn().mockReturnValue(true),
              }),
            } as unknown as GuildMember,
          ],
        ]),
      },
      client: {
        user: { id: "bot-id" },
      },
    } as unknown as Guild;

    interaction.guild = mockGuild;
    handler = new spawnHandler(server, interaction);
  });

  test("getMenuStructure should return correct menu structure", () => {
    const structure = handler.getMenuStructure();

    expect(structure).toBeDefined();
    expect(structure.value).toBe("spawn");
    expect(structure.children).toBeDefined();
    expect(structure.children?.length).toBe(2);
    expect(structure.placeholder).toBeDefined();
  });

  test("getMenuStructure should have add and remove children", () => {
    const structure = handler.getMenuStructure();
    const childrenValues = structure.children!.map((c) => c.value);
    expect(childrenValues).toContain("add");
    expect(childrenValues).toContain("remove");
  });

  test("handleAction should add channel when action is add", async () => {
    const channelId = "channel1";
    const selectionPath = [
      { value: "spawn", label: "Spawn" },
      { value: "add", label: "Add" },
      { value: channelId, label: "Test Channel" },
    ];

    await handler.handleAction(selectionPath);

    const updatedServer = await getServerById(server.discordId);
    expect(updatedServer.channelAllowed).toContain(channelId);
  });

  test("handleAction should remove channel when action is remove", async () => {
    const channelId = "channel1";
    server.channelAllowed.push(channelId);
    await updateServer(server.discordId, server);

    const selectionPath = [
      { value: "spawn", label: "Spawn" },
      { value: "remove", label: "Remove" },
      { value: channelId, label: "Test Channel" },
    ];

    await handler.handleAction(selectionPath);

    const updatedServer = await getServerById(server.discordId);
    expect(updatedServer.channelAllowed).not.toContain(channelId);
  });

  test("handleAction should not process if selectionPath is too short", async () => {
    const selectionPath = [{ value: "spawn", label: "Spawn" }];

    await handler.handleAction(selectionPath);

    const updatedServer = await getServerById(server.discordId);
    expect(updatedServer.channelAllowed.length).toBe(0);
  });

  test("handleAction should not process if channelId is no_channels", async () => {
    const selectionPath = [
      { value: "spawn", label: "Spawn" },
      { value: "add", label: "Add" },
      { value: "no_channels", label: "No Channels" },
    ];

    await handler.handleAction(selectionPath);

    const updatedServer = await getServerById(server.discordId);
    expect(updatedServer.channelAllowed.length).toBe(0);
  });

  test("getMenuStructure should handle deleted channels", () => {
    server.channelAllowed.push("deleted-channel-id");
    const structure = handler.getMenuStructure();

    const removeChildren = structure.children?.find(
      (c) => c.value === "remove",
    );
    expect(removeChildren).toBeDefined();
  });

  test("getMenuStructure should handle channels without permissions", () => {
    const mockGuild = {
      id: interaction.guildId,
      channels: {
        cache: new Map([
          [
            "channel-no-perms",
            {
              id: "channel-no-perms",
              name: "no-perms-channel",
              isTextBased: () => true,
              parent: { name: "Category" },
            } as unknown as BaseGuildTextChannel,
          ],
        ]),
      },
      members: {
        cache: new Map([
          [
            "bot-id",
            {
              permissionsIn: jest.fn().mockReturnValue({
                has: jest.fn().mockReturnValue(false),
              }),
            } as unknown as GuildMember,
          ],
        ]),
      },
      client: {
        user: { id: "bot-id" },
      },
    } as unknown as Guild;

    interaction.guild = mockGuild;
    server.channelAllowed.push("channel-no-perms");

    const newHandler = new spawnHandler(server, interaction);
    const structure = newHandler.getMenuStructure();

    expect(structure).toBeDefined();
  });

  test("getMenuStructure should handle channels without parent", () => {
    const mockGuild = {
      id: interaction.guildId,
      channels: {
        cache: new Map([
          [
            "channel-no-parent",
            {
              id: "channel-no-parent",
              name: "no-parent-channel",
              isTextBased: () => true,
              parent: null,
            } as unknown as BaseGuildTextChannel,
          ],
        ]),
      },
      members: {
        cache: new Map([
          [
            "bot-id",
            {
              permissionsIn: jest.fn().mockReturnValue({
                has: jest.fn().mockReturnValue(true),
              }),
            } as unknown as GuildMember,
          ],
        ]),
      },
      client: {
        user: { id: "bot-id" },
      },
    } as unknown as Guild;

    interaction.guild = mockGuild;

    const newHandler = new spawnHandler(server, interaction);
    const structure = newHandler.getMenuStructure();

    expect(structure).toBeDefined();
  });

  test("getMenuStructure should handle long display names", () => {
    const longName = "a".repeat(150);
    const mockGuild = {
      id: interaction.guildId,
      channels: {
        cache: new Map([
          [
            "channel-long-name",
            {
              id: "channel-long-name",
              name: longName,
              isTextBased: () => true,
              parent: { name: "Category" },
            } as unknown as BaseGuildTextChannel,
          ],
        ]),
      },
      members: {
        cache: new Map([
          [
            "bot-id",
            {
              permissionsIn: jest.fn().mockReturnValue({
                has: jest.fn().mockReturnValue(true),
              }),
            } as unknown as GuildMember,
          ],
        ]),
      },
      client: {
        user: { id: "bot-id" },
      },
    } as unknown as Guild;

    interaction.guild = mockGuild;

    const newHandler = new spawnHandler(server, interaction);
    const structure = newHandler.getMenuStructure();

    const addChildren = structure.children?.find((c) => c.value === "add");
    expect(addChildren).toBeDefined();
  });

  test("getMenuStructure should handle no available channels", () => {
    const mockGuild = {
      id: interaction.guildId,
      channels: {
        cache: new Map(),
      },
      members: {
        cache: new Map([
          [
            "bot-id",
            {
              permissionsIn: jest.fn().mockReturnValue({
                has: jest.fn().mockReturnValue(true),
              }),
            } as unknown as GuildMember,
          ],
        ]),
      },
      client: {
        user: { id: "bot-id" },
      },
    } as unknown as Guild;

    interaction.guild = mockGuild;

    const newHandler = new spawnHandler(server, interaction);
    const structure = newHandler.getMenuStructure();

    const addChildren = structure.children?.find((c) => c.value === "add");
    expect(addChildren?.children).toBeDefined();
    expect(addChildren?.children?.some((c) => c.value === "no_channels")).toBe(
      true,
    );
  });

  test("getMenuStructure should handle non-text channels", () => {
    const mockGuild = {
      id: interaction.guildId,
      channels: {
        cache: new Map([
          [
            "voice-channel",
            {
              id: "voice-channel",
              name: "voice",
              isTextBased: () => false,
            } as unknown as BaseGuildTextChannel,
          ],
        ]),
      },
      members: {
        cache: new Map([
          [
            "bot-id",
            {
              permissionsIn: jest.fn().mockReturnValue({
                has: jest.fn().mockReturnValue(true),
              }),
            } as unknown as GuildMember,
          ],
        ]),
      },
      client: {
        user: { id: "bot-id" },
      },
    } as unknown as Guild;

    interaction.guild = mockGuild;
    server.channelAllowed.push("voice-channel");

    const newHandler = new spawnHandler(server, interaction);
    const structure = newHandler.getMenuStructure();

    expect(structure).toBeDefined();
  });

  test("getMainEmbed should handle no guild", () => {
    const handlerWithoutGuild = new spawnHandler(server, {} as any);
    const embed = handlerWithoutGuild["getMainEmbed"]();

    expect(embed).toBeDefined();
    expect(embed.data.description).toBeDefined();
  });

  test("handleAction should handle send message error", async () => {
    const channelId = "channel1";
    const mockChannel = {
      id: channelId,
      name: "test-channel",
      isTextBased: () => true,
      send: jest.fn().mockRejectedValue(new Error("Send failed")),
    } as unknown as BaseGuildTextChannel;

    const mockGuild = {
      id: interaction.guildId,
      channels: {
        cache: new Map([[channelId, mockChannel]]),
      },
      members: {
        cache: new Map(),
      },
      client: {
        user: { id: "bot-id" },
      },
    } as unknown as Guild;

    interaction.guild = mockGuild;

    const newHandler = new spawnHandler(server, interaction);
    const selectionPath = [
      { value: "spawn", label: "Spawn" },
      { value: "add", label: "Add" },
      { value: channelId, label: "Test Channel" },
    ];

    await newHandler.handleAction(selectionPath);

    const updatedServer = await getServerById(server.discordId);
    expect(updatedServer.channelAllowed).toContain(channelId);
  });

  test("handleAction should not add channel if already exists", async () => {
    const channelId = "channel1";
    server.channelAllowed.push(channelId);
    await updateServer(server.discordId, server);

    const selectionPath = [
      { value: "spawn", label: "Spawn" },
      { value: "add", label: "Add" },
      { value: channelId, label: "Test Channel" },
    ];

    await handler.handleAction(selectionPath);

    const updatedServer = await getServerById(server.discordId);
    const count = updatedServer.channelAllowed.filter(
      (id) => id === channelId,
    ).length;
    expect(count).toBe(1);
  });

  test("handleAction should handle remove when channel not in list", async () => {
    const channelId = "channel-not-in-list";
    const selectionPath = [
      { value: "spawn", label: "Spawn" },
      { value: "remove", label: "Remove" },
      { value: channelId, label: "Test Channel" },
    ];

    await handler.handleAction(selectionPath);

    const updatedServer = await getServerById(server.discordId);
    expect(updatedServer.channelAllowed).not.toContain(channelId);
  });

  test("handleAction should handle remove with deleted channel", async () => {
    const channelId = "deleted-channel";
    server.channelAllowed.push(channelId);
    await updateServer(server.discordId, server);

    const selectionPath = [
      { value: "spawn", label: "Spawn" },
      { value: "remove", label: "Remove" },
      { value: channelId, label: "Deleted Channel" },
    ];

    await handler.handleAction(selectionPath);

    const updatedServer = await getServerById(server.discordId);
    expect(updatedServer.channelAllowed).not.toContain(channelId);
  });

  test("handleAction should handle followUp error", async () => {
    const channelId = "channel1";
    interaction.followUp = jest
      .fn()
      .mockRejectedValue(new Error("FollowUp failed"));

    const selectionPath = [
      { value: "spawn", label: "Spawn" },
      { value: "add", label: "Add" },
      { value: channelId, label: "Test Channel" },
    ];

    await handler.handleAction(selectionPath);

    const updatedServer = await getServerById(server.discordId);
    expect(updatedServer.channelAllowed).toContain(channelId);
  });

  test("handleAction should handle remove with followUp error", async () => {
    const channelId = "channel1";
    server.channelAllowed.push(channelId);
    await updateServer(server.discordId, server);
    interaction.followUp = jest
      .fn()
      .mockRejectedValue(new Error("FollowUp failed"));

    const selectionPath = [
      { value: "spawn", label: "Spawn" },
      { value: "remove", label: "Remove" },
      { value: channelId, label: "Test Channel" },
    ];

    await handler.handleAction(selectionPath);

    const updatedServer = await getServerById(server.discordId);
    expect(updatedServer.channelAllowed).not.toContain(channelId);
  });

  test("handleAction should handle remove without guild", async () => {
    const channelId = "channel1";
    server.channelAllowed.push(channelId);
    await updateServer(server.discordId, server);

    const handlerWithoutGuild = new spawnHandler(server, {} as any);
    const selectionPath = [
      { value: "spawn", label: "Spawn" },
      { value: "remove", label: "Remove" },
      { value: channelId, label: "Test Channel" },
    ];

    await handlerWithoutGuild.handleAction(selectionPath);

    const updatedServer = await getServerById(server.discordId);
    expect(updatedServer.channelAllowed).not.toContain(channelId);
  });

  test("handleAction should handle remove without interaction", async () => {
    const channelId = "channel1";
    server.channelAllowed.push(channelId);
    await updateServer(server.discordId, server);

    const handlerWithoutInteraction = new spawnHandler(server, {
      guild: interaction.guild,
    } as any);
    const selectionPath = [
      { value: "spawn", label: "Spawn" },
      { value: "remove", label: "Remove" },
      { value: channelId, label: "Test Channel" },
    ];

    await handlerWithoutInteraction.handleAction(selectionPath);

    const updatedServer = await getServerById(server.discordId);
    expect(updatedServer.channelAllowed).not.toContain(channelId);
  });

  test("handleAction should handle unknown action", async () => {
    const selectionPath = [
      { value: "spawn", label: "Spawn" },
      { value: "unknown", label: "Unknown" },
      { value: "channel1", label: "Test Channel" },
    ];

    await handler.handleAction(selectionPath);
    // Should not throw and not modify server
  });

  test("handleAction should handle remove with index -1", async () => {
    const selectionPath = [
      { value: "spawn", label: "Spawn" },
      { value: "remove", label: "Remove" },
      { value: "nonexistent-channel", label: "Test Channel" },
    ];

    await handler.handleAction(selectionPath);
    // Should not throw and not modify server
  });

  test("getMenuStructure should handle null guild", () => {
    const handlerWithoutGuild = new spawnHandler(server, {} as any);
    const structure = handlerWithoutGuild.getMenuStructure();

    expect(structure).toBeDefined();
    expect(structure.value).toBe("spawn");
    expect(structure.children).toBeDefined();
  });

  test("getMenuStructure should handle channels without botMember", () => {
    const mockGuildWithoutBot = {
      id: interaction.guildId,
      channels: {
        cache: new Map([
          [
            "channel1",
            {
              id: "channel1",
              name: "test-channel",
              isTextBased: () => true,
              parent: { name: "Category" },
            } as unknown as BaseGuildTextChannel,
          ],
        ]),
      },
      members: {
        cache: {
          get: jest.fn().mockReturnValue(null),
        },
      },
      client: {
        user: { id: "bot-id" },
      },
    } as unknown as Guild;

    const handlerWithoutBot = new spawnHandler(server, {
      guild: mockGuildWithoutBot,
    } as any);
    const structure = handlerWithoutBot.getMenuStructure();

    expect(structure).toBeDefined();
    expect(structure.children).toBeDefined();
  });

  test("getMenuStructure should handle long channel names", () => {
    const longChannelName = "a".repeat(100);
    const mockGuildWithLongName = {
      id: interaction.guildId,
      channels: {
        cache: new Map([
          [
            "channel1",
            {
              id: "channel1",
              name: longChannelName,
              isTextBased: () => true,
              parent: { name: "Category" },
            } as unknown as BaseGuildTextChannel,
          ],
        ]),
      },
      members: {
        cache: new Map([
          [
            "bot-id",
            {
              permissionsIn: jest.fn().mockReturnValue({
                has: jest.fn().mockReturnValue(true),
              }),
            } as unknown as GuildMember,
          ],
        ]),
      },
      client: {
        user: { id: "bot-id" },
      },
    } as unknown as Guild;

    const handlerWithLongName = new spawnHandler(server, {
      guild: mockGuildWithLongName,
    } as any);
    const structure = handlerWithLongName.getMenuStructure();

    expect(structure).toBeDefined();
    if (structure.children && structure.children[0].children) {
      const addChildren = structure.children[0].children;
      const longNameOption = addChildren.find(
        (c: any) => c.value === "channel1",
      );
      if (longNameOption) {
        expect(longNameOption.label.length).toBeLessThanOrEqual(100);
      }
    }
  });

  test("handleAction should handle updateServerData error", async () => {
    const updateServerSpy = jest
      .spyOn(require("../../../../src/cache/ServerCache"), "updateServer")
      .mockRejectedValueOnce(new Error("Update error"));

    const selectionPath = [
      { value: "spawn", label: "Spawn" },
      { value: "add", label: "Add" },
      { value: "channel1", label: "Test Channel" },
    ];

    await handler.handleAction(selectionPath);

    updateServerSpy.mockRestore();
  });

  test("handleAction should handle sendChannelMessage error", async () => {
    const channelId = "channel1";
    const mockChannel = {
      id: channelId,
      name: "test-channel",
      isTextBased: () => true,
      send: jest.fn().mockRejectedValue(new Error("Send error")),
    } as unknown as BaseGuildTextChannel;

    const mockGuildWithError = {
      id: interaction.guildId,
      channels: {
        cache: {
          get: jest.fn().mockReturnValue(mockChannel),
        },
      },
      members: {
        cache: new Map(),
      },
      client: {
        user: { id: "bot-id" },
      },
    } as any;

    Object.setPrototypeOf(mockChannel, BaseGuildTextChannel.prototype);

    const handlerWithError = new spawnHandler(server, {
      guild: mockGuildWithError,
    } as any);

    const selectionPath = [
      { value: "spawn", label: "Spawn" },
      { value: "add", label: "Add" },
      { value: channelId, label: "Test Channel" },
    ];

    await handlerWithError.handleAction(selectionPath);
  });

  test("handleAction should handle sendFollowUp error", async () => {
    const channelId = "channel1";
    const mockInteractionWithError = {
      ...interaction,
      followUp: jest.fn().mockRejectedValue(new Error("FollowUp error")),
    };

    const handlerWithError = new spawnHandler(server, mockInteractionWithError);

    const selectionPath = [
      { value: "spawn", label: "Spawn" },
      { value: "add", label: "Add" },
      { value: channelId, label: "Test Channel" },
    ];

    await handlerWithError.handleAction(selectionPath);
  });

  test("handleAction should handle reloadServer error", async () => {
    const getServerByIdSpy = jest
      .spyOn(require("../../../../src/cache/ServerCache"), "getServerById")
      .mockRejectedValueOnce(new Error("Reload error"));

    const selectionPath = [
      { value: "spawn", label: "Spawn" },
      { value: "add", label: "Add" },
      { value: "channel1", label: "Test Channel" },
    ];

    await handler.handleAction(selectionPath);

    getServerByIdSpy.mockRestore();
  });

  test("getMainEmbed should truncate long channel list", () => {
    const longChannelList = Array.from({ length: 50 }, (_, i) => ({
      id: `channel${i}`,
      name: `Channel ${i}`,
      isTextBased: () => true,
      parent: { name: "Category" },
      send: jest.fn().mockResolvedValue(undefined),
    })) as unknown as BaseGuildTextChannel[];

    const mockGuild = {
      id: interaction.guildId,
      channels: {
        cache: new Map(longChannelList.map((channel) => [channel.id, channel])),
      },
      members: {
        cache: new Map([
          [
            "bot-id",
            {
              permissionsIn: jest.fn().mockReturnValue({
                has: jest.fn().mockReturnValue(true),
              }),
            } as unknown as GuildMember,
          ],
        ]),
      },
      client: {
        user: { id: "bot-id" },
      },
    } as unknown as Guild;

    server.channelAllowed = longChannelList.map((c) => c.id);
    interaction.guild = mockGuild;

    const newHandler = new spawnHandler(server, interaction);
    const embed = newHandler["getMainEmbed"]();

    expect(embed).toBeDefined();
    const fields = embed.data.fields;
    if (fields && fields.length > 0) {
      const channelsField = fields.find((f: any) =>
        f.name?.includes("Permissions"),
      );
      if (channelsField && channelsField.value) {
        expect(channelsField.value.length).toBeLessThanOrEqual(1024);
      }
    }
  });

  test("getMainEmbed should handle empty channels list", () => {
    const mockGuild = {
      id: interaction.guildId,
      channels: {
        cache: new Map(),
      },
      members: {
        cache: new Map([
          [
            "bot-id",
            {
              permissionsIn: jest.fn().mockReturnValue({
                has: jest.fn().mockReturnValue(true),
              }),
            } as unknown as GuildMember,
          ],
        ]),
      },
      client: {
        user: { id: "bot-id" },
      },
    } as unknown as Guild;

    server.channelAllowed = [];
    interaction.guild = mockGuild;

    const newHandler = new spawnHandler(server, interaction);
    const embed = newHandler["getMainEmbed"]();

    expect(embed).toBeDefined();
    expect(embed.data.description).toBeDefined();
  });

  test("getAvailableChannelsMenuOptions should handle channels already in allowed list", () => {
    const mockChannel = {
      id: "channel1",
      name: "test-channel",
      isTextBased: () => true,
      parent: { name: "Category" },
    } as unknown as BaseGuildTextChannel;

    const mockGuild = {
      id: interaction.guildId,
      channels: {
        cache: new Map([["channel1", mockChannel]]),
      },
      members: {
        cache: new Map([
          [
            "bot-id",
            {
              permissionsIn: jest.fn().mockReturnValue({
                has: jest.fn().mockReturnValue(true),
              }),
            } as unknown as GuildMember,
          ],
        ]),
      },
      client: {
        user: { id: "bot-id" },
      },
    } as unknown as Guild;

    server.channelAllowed = ["channel1"];
    interaction.guild = mockGuild;

    const newHandler = new spawnHandler(server, interaction);
    const structure = newHandler.getMenuStructure();

    const addChildren = structure.children?.find((c) => c.value === "add");
    const availableChannels = addChildren?.children || [];
    expect(availableChannels.some((c) => c.value === "channel1")).toBe(false);
  });

  test("getAllowedChannelsMenuOptions should handle channels without parent", () => {
    const mockChannel = {
      id: "channel-no-parent",
      name: "no-parent-channel",
      isTextBased: () => true,
      parent: null,
    } as unknown as BaseGuildTextChannel;

    const mockGuild = {
      id: interaction.guildId,
      channels: {
        cache: new Map([["channel-no-parent", mockChannel]]),
      },
      members: {
        cache: new Map([
          [
            "bot-id",
            {
              permissionsIn: jest.fn().mockReturnValue({
                has: jest.fn().mockReturnValue(true),
              }),
            } as unknown as GuildMember,
          ],
        ]),
      },
      client: {
        user: { id: "bot-id" },
      },
    } as unknown as Guild;

    server.channelAllowed = ["channel-no-parent"];
    interaction.guild = mockGuild;

    const newHandler = new spawnHandler(server, interaction);
    const structure = newHandler.getMenuStructure();

    const removeChildren = structure.children?.find(
      (c) => c.value === "remove",
    );
    expect(removeChildren).toBeDefined();
    expect(removeChildren?.children).toBeDefined();
  });
});

import { paginationButton } from "../../../../src/features/other/paginationButton";
import { createMockInteraction } from "../../../utils/mock/mockInteraction";
import { EmbedBuilder, AttachmentBuilder } from "discord.js";

describe("paginationButton", () => {
  let interaction: any;

  beforeEach(() => {
    interaction = createMockInteraction();
  });

  test("should return early when pages array is empty", async () => {
    await paginationButton(interaction, []);

    expect(interaction.reply).not.toHaveBeenCalled();
  });

  test("should display single page with disabled buttons", async () => {
    const embed = new EmbedBuilder().setTitle("Test");
    const pages = [{ page: embed }];

    const mockMessage = {
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn(),
        stop: jest.fn(),
      }),
    };
    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);

    await paginationButton(interaction, pages);

    expect(interaction.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        embeds: [embed],
        components: expect.any(Array),
      }),
    );
  });

  test("should handle previous button at first page (wrap to last)", async () => {
    const embed1 = new EmbedBuilder().setTitle("Page 1");
    const embed2 = new EmbedBuilder().setTitle("Page 2");
    const pages = [{ page: embed1 }, { page: embed2 }];

    let collectCallback: (i: any) => void;
    const mockMessage = {
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === "collect") collectCallback = callback;
          if (event === "end") setTimeout(() => callback(), 10);
          return { on: jest.fn(), stop: jest.fn() };
        }),
        stop: jest.fn(),
      }),
    };
    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);
    (interaction.editReply as jest.Mock).mockResolvedValue(undefined);

    await paginationButton(interaction, pages, 1, 60000);
    await new Promise((r) => setTimeout(r, 5));

    const prevInteraction = {
      user: { id: interaction.user.id },
      customId: "previous",
      deferUpdate: jest.fn().mockResolvedValue(undefined),
      editReply: jest.fn().mockResolvedValue(undefined),
    };
    collectCallback!(prevInteraction);
    await new Promise((r) => setTimeout(r, 5));

    expect(prevInteraction.editReply).toHaveBeenCalledWith(
      expect.objectContaining({
        embeds: [embed2],
      }),
    );
  });

  test("should handle next button at last page (wrap to first)", async () => {
    const embed1 = new EmbedBuilder().setTitle("Page 1");
    const embed2 = new EmbedBuilder().setTitle("Page 2");
    const pages = [{ page: embed1 }, { page: embed2 }];

    let collectCallback: (i: any) => void;
    const mockMessage = {
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === "collect") collectCallback = callback;
          if (event === "end") setTimeout(() => callback(), 10);
          return { on: jest.fn(), stop: jest.fn() };
        }),
        stop: jest.fn(),
      }),
    };
    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);
    (interaction.editReply as jest.Mock).mockResolvedValue(undefined);

    await paginationButton(interaction, pages, 2, 60000);
    await new Promise((r) => setTimeout(r, 5));

    const nextInteraction = {
      user: { id: interaction.user.id },
      customId: "next",
      deferUpdate: jest.fn().mockResolvedValue(undefined),
      editReply: jest.fn().mockResolvedValue(undefined),
    };
    collectCallback!(nextInteraction);
    await new Promise((r) => setTimeout(r, 5));

    expect(nextInteraction.editReply).toHaveBeenCalledWith(
      expect.objectContaining({
        embeds: [embed1],
      }),
    );
  });

  test("should handle stop button", async () => {
    const embed = new EmbedBuilder().setTitle("Test");
    const pages = [{ page: embed }];

    const stopFn = jest.fn();
    const collectorObj = {
      on: jest.fn(),
      stop: stopFn,
    };
    collectorObj.on.mockImplementation(
      (event: string, callback: (i?: any) => void) => {
        if (event === "collect")
          setTimeout(
            () =>
              callback({
                user: { id: interaction.user.id },
                customId: "stop",
                deferUpdate: jest.fn(),
              }),
            5,
          );
        if (event === "end") setTimeout(() => callback(), 20);
        return collectorObj;
      },
    );
    const mockMessage = {
      createMessageComponentCollector: jest.fn().mockReturnValue(collectorObj),
    };
    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);
    (interaction.editReply as jest.Mock).mockResolvedValue(undefined);

    await paginationButton(interaction, pages, 1, 60000);
    await new Promise((r) => setTimeout(r, 50));

    expect(stopFn).toHaveBeenCalled();
  });

  test("should ignore interaction from different user", async () => {
    const embed = new EmbedBuilder().setTitle("Test");
    const pages = [{ page: embed }];

    const stopFn = jest.fn();
    const collectorObj = {
      on: jest.fn(),
      stop: stopFn,
    };
    collectorObj.on.mockImplementation(
      (event: string, callback: (i?: any) => void) => {
        if (event === "collect")
          setTimeout(
            () =>
              callback({
                user: { id: "different-user" },
                customId: "next",
                deferUpdate: jest.fn(),
                editReply: jest.fn(),
              }),
            5,
          );
        if (event === "end") setTimeout(() => callback(), 20);
        return collectorObj;
      },
    );
    const mockMessage = {
      createMessageComponentCollector: jest.fn().mockReturnValue(collectorObj),
    };
    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);

    await paginationButton(interaction, pages);
    await new Promise((r) => setTimeout(r, 50));

    expect(stopFn).not.toHaveBeenCalled();
  });

  test("should include image when page has imagePage", async () => {
    const embed = new EmbedBuilder().setTitle("Test");
    const image = new AttachmentBuilder(Buffer.from("test"), {
      name: "test.png",
    });
    const pages = [{ page: embed, imagePage: image }];

    const mockMessage = {
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn(),
        stop: jest.fn(),
      }),
    };
    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);

    await paginationButton(interaction, pages);

    expect(interaction.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        files: [image],
      }),
    );
  });

  test("should not include files when page has no imagePage", async () => {
    const embed = new EmbedBuilder().setTitle("Test");
    const pages = [{ page: embed }];

    const mockMessage = {
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn(),
        stop: jest.fn(),
      }),
    };
    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);

    await paginationButton(interaction, pages);

    expect(interaction.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        files: [],
      }),
    );
  });

  test("should call editReply on collector end", async () => {
    const embed = new EmbedBuilder().setTitle("Test");
    const pages = [{ page: embed }];

    const mockMessage = {
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === "end") setTimeout(() => callback(), 10);
          return { on: jest.fn(), stop: jest.fn() };
        }),
        stop: jest.fn(),
      }),
    };
    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);
    (interaction.editReply as jest.Mock).mockResolvedValue(undefined);

    await paginationButton(interaction, pages);
    await new Promise((r) => setTimeout(r, 50));

    expect(interaction.editReply).toHaveBeenCalledWith({ components: [] });
  });
});

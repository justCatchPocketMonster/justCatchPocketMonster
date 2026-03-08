import {
  paginationMenu,
  createPageForMenu,
  PageData,
} from "../../../../src/features/other/paginationMenu";
import { createMockInteraction } from "../../../utils/mock/mockInteraction";
import { EmbedBuilder, AttachmentBuilder } from "discord.js";

describe("paginationMenu", () => {
  let interaction: any;

  beforeEach(() => {
    interaction = createMockInteraction();
  });

  test("should return early when pages array is empty", async () => {
    await paginationMenu(interaction, "Select", []);

    expect(interaction.reply).not.toHaveBeenCalled();
  });

  test("should return early when no valid pages found", async () => {
    const pages: PageData[] = [
      {
        page: null,
        information: { nameSelection: "Header" },
      },
    ];

    await paginationMenu(interaction, "Select", pages);

    expect(interaction.reply).not.toHaveBeenCalled();
  });

  test("should return early when menuOptions is empty after filtering", async () => {
    const pages: PageData[] = [
      {
        page: new EmbedBuilder().setTitle("Test"),
        information: { nameSelection: "a".repeat(101) },
      },
    ];

    await paginationMenu(interaction, "Select", pages);

    expect(interaction.reply).not.toHaveBeenCalled();
  });

  test("should handle pages with images", async () => {
    const embed = new EmbedBuilder().setTitle("Test");
    const image = new AttachmentBuilder(Buffer.from("test"), {
      name: "test.png",
    });
    const pages: PageData[] = [
      {
        page: embed,
        imagePage: image,
        information: { nameSelection: "Page 1" },
      },
    ];

    const mockMessage = {
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn(),
        stop: jest.fn(),
      }),
    };
    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);

    await paginationMenu(interaction, "Select", pages);

    expect(interaction.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        files: [image],
      }),
    );
  });

  test("should handle collector interaction with different user", async () => {
    const embed = new EmbedBuilder().setTitle("Test");
    const pages: PageData[] = [
      {
        page: embed,
        information: { nameSelection: "Page 1" },
      },
    ];

    const selectInteraction = {
      user: { id: "different-user" },
      values: ["0"],
      deferUpdate: jest.fn(),
      editReply: jest.fn(),
    };

    const mockMessage = {
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === "collect") {
            setTimeout(() => callback(selectInteraction), 10);
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

    await paginationMenu(interaction, "Select", pages);
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(selectInteraction.deferUpdate).not.toHaveBeenCalled();
  });

  test("should handle collector interaction with null page selection", async () => {
    const embed1 = new EmbedBuilder().setTitle("Test 1");
    const embed2 = new EmbedBuilder().setTitle("Test 2");
    const pages: PageData[] = [
      {
        page: null,
        information: { nameSelection: "Header" },
      },
      {
        page: embed1,
        information: { nameSelection: "Page 1" },
      },
      {
        page: embed2,
        information: { nameSelection: "Page 2" },
      },
    ];

    const selectInteraction = {
      user: { id: interaction.user.id },
      values: ["0"],
      deferUpdate: jest.fn().mockResolvedValue(undefined),
      editReply: jest.fn().mockResolvedValue(undefined),
    };

    const mockMessage = {
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === "collect") {
            setTimeout(() => callback(selectInteraction), 10);
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

    await paginationMenu(interaction, "Select", pages);
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(selectInteraction.deferUpdate).toHaveBeenCalled();
  });

  test("should handle collector end event", async () => {
    const embed = new EmbedBuilder().setTitle("Test");
    const pages: PageData[] = [
      {
        page: embed,
        information: { nameSelection: "Page 1" },
      },
    ];

    const mockMessage = {
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === "end") {
            setTimeout(() => callback(), 10);
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

    await paginationMenu(interaction, "Select", pages);
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(interaction.editReply).toHaveBeenCalledWith({
      components: [],
    });
  });

  test("should handle __prev__ navigation to switch to previous group", async () => {
    const pages: PageData[] = new Array(30).fill(null).map((_, i) => ({
      page: new EmbedBuilder().setTitle(`Page ${i}`),
      information: { nameSelection: `Page ${i}` },
    }));

    const selectInteraction = {
      user: { id: interaction.user.id },
      values: ["__prev__"],
      deferUpdate: jest.fn().mockResolvedValue(undefined),
      editReply: jest.fn().mockResolvedValue(undefined),
    };

    const mockMessage = {
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === "collect") {
            setTimeout(() => callback(selectInteraction), 10);
          }
          return { on: jest.fn(), stop: jest.fn() };
        }),
        stop: jest.fn(),
      }),
    };
    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);

    await paginationMenu(interaction, "Select", pages, 26);
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(selectInteraction.deferUpdate).toHaveBeenCalled();
    expect(selectInteraction.editReply).toHaveBeenCalled();
  });

  test("should handle __next__ navigation to switch to next group", async () => {
    const pages: PageData[] = new Array(50).fill(null).map((_, i) => ({
      page: new EmbedBuilder().setTitle(`Page ${i}`),
      information: { nameSelection: `Page ${i}` },
    }));

    const selectInteraction = {
      user: { id: interaction.user.id },
      values: ["__next__"],
      deferUpdate: jest.fn().mockResolvedValue(undefined),
      editReply: jest.fn().mockResolvedValue(undefined),
    };

    const mockMessage = {
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === "collect") {
            setTimeout(() => callback(selectInteraction), 10);
          }
          return { on: jest.fn(), stop: jest.fn() };
        }),
        stop: jest.fn(),
      }),
    };
    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);

    await paginationMenu(interaction, "Select", pages, 1);
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(selectInteraction.deferUpdate).toHaveBeenCalled();
    expect(selectInteraction.editReply).toHaveBeenCalled();
  });

  test("should include files when updated page has an imagePage", async () => {
    const image1 = new AttachmentBuilder(Buffer.from("img1"), {
      name: "p1.png",
    });
    const image2 = new AttachmentBuilder(Buffer.from("img2"), {
      name: "p2.png",
    });
    const pages: PageData[] = [
      {
        page: new EmbedBuilder().setTitle("Page 0"),
        imagePage: image1,
        information: { nameSelection: "Page 0" },
      },
      {
        page: new EmbedBuilder().setTitle("Page 1"),
        imagePage: image2,
        information: { nameSelection: "Page 1" },
      },
    ];

    const selectInteraction = {
      user: { id: interaction.user.id },
      values: ["1"],
      deferUpdate: jest.fn().mockResolvedValue(undefined),
      editReply: jest.fn().mockResolvedValue(undefined),
    };

    const mockMessage = {
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === "collect") {
            setTimeout(() => callback(selectInteraction), 10);
          }
          return { on: jest.fn(), stop: jest.fn() };
        }),
        stop: jest.fn(),
      }),
    };
    (interaction.reply as jest.Mock).mockResolvedValue(mockMessage);

    await paginationMenu(interaction, "Select", pages);
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(selectInteraction.editReply).toHaveBeenCalledWith(
      expect.objectContaining({ files: [image2] }),
    );
  });

  test("should handle loop limit in collector", async () => {
    const embed = new EmbedBuilder().setTitle("Test");
    const pages: PageData[] = new Array(1001).fill(null).map((_, i) => ({
      page: i === 1000 ? embed : null,
      information: { nameSelection: `Page ${i}` },
    }));

    const selectInteraction = {
      user: { id: interaction.user.id },
      values: ["0"],
      deferUpdate: jest.fn().mockResolvedValue(undefined),
      editReply: jest.fn().mockResolvedValue(undefined),
    };

    const mockMessage = {
      createMessageComponentCollector: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === "collect") {
            setTimeout(() => callback(selectInteraction), 10);
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

    await paginationMenu(interaction, "Select", pages);
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(interaction.editReply).toHaveBeenCalled();
  });
});

describe("createPageForMenu", () => {
  test("should create page with image", () => {
    const embed = new EmbedBuilder().setTitle("Test");
    const image = new AttachmentBuilder(Buffer.from("test"), {
      name: "test.png",
    });

    const result = createPageForMenu(embed, image, "Test Page", "Description");

    expect(result.page).toBe(embed);
    expect(result.imagePage).toBe(image);
    expect(result.information.nameSelection).toBe("Test Page");
    expect(result.information.descriptionSelection).toBe("Description");
  });

  test("should create page without image", () => {
    const embed = new EmbedBuilder().setTitle("Test");

    const result = createPageForMenu(embed, null, "Test Page", "Description");

    expect(result.page).toBe(embed);
    expect(result.imagePage).toBeUndefined();
    expect(result.information.nameSelection).toBe("Test Page");
    expect(result.information.descriptionSelection).toBe("Description");
  });

  test("should set descriptionSelection to undefined when empty string", () => {
    const embed = new EmbedBuilder().setTitle("Test");

    const result = createPageForMenu(embed, null, "Test Page", "");

    expect(result.information.descriptionSelection).toBeUndefined();
  });

  test("should handle null page", () => {
    const result = createPageForMenu(null, null, "Test Page");

    expect(result.page).toBeNull();
    expect(result.information.nameSelection).toBe("Test Page");
  });
});

import { AdminTutorialHandler } from "../../../../src/features/tutorial/adminTutorialHandler";
import { Server } from "../../../../src/core/classes/Server";
import { EmbedBuilder } from "discord.js";

describe("AdminTutorialHandler", () => {
  const server = { settings: { language: "fr" } } as unknown as Server;

  test("getMenuStructure returns option with value admin and two children", () => {
    const handler = new AdminTutorialHandler(server);
    const structure = handler.getMenuStructure();

    expect(structure.value).toBe("admin");
    expect(structure.label).toBeDefined();
    expect(structure.description).toBeDefined();
    expect(structure.placeholder).toBeDefined();
    expect(structure.children).toHaveLength(2);
    expect(structure.children?.map((c) => c.value)).toEqual([
      "language",
      "spawn",
    ]);
  });

  test("each child has getEmbed returning embed with color, title and description", () => {
    const handler = new AdminTutorialHandler(server);
    const structure = handler.getMenuStructure();

    for (const child of structure.children ?? []) {
      const embed = child.getEmbed?.();
      expect(embed).toBeDefined();
      expect(embed).toBeInstanceOf(EmbedBuilder);
      expect(embed!.data.color).toBe(0xe74c3c);
      expect(embed!.data.title).toBeDefined();
      expect(embed!.data.description).toBeDefined();
    }
  });

  test("handleAction does nothing", () => {
    const handler = new AdminTutorialHandler(server);
    expect(() =>
      handler.handleAction([{ value: "admin", label: "Admin" }]),
    ).not.toThrow();
  });
});

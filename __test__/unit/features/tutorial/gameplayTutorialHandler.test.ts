import { GameplayTutorialHandler } from "../../../../src/features/tutorial";
import { Server } from "../../../../src/core/classes/Server";
import { EmbedBuilder } from "discord.js";

describe("GameplayTutorialHandler", () => {
  const server = { settings: { language: "fr" } } as unknown as Server;

  test("getMenuStructure returns option with value gameplay and five children", () => {
    const handler = new GameplayTutorialHandler(server);
    const structure = handler.getMenuStructure();

    expect(structure.value).toBe("gameplay");
    expect(structure.label).toBeDefined();
    expect(structure.description).toBeDefined();
    expect(structure.placeholder).toBeDefined();
    expect(structure.children).toHaveLength(5);
    expect(structure.children?.map((c) => c.value)).toEqual([
      "spawn",
      "eggs",
      "sos",
      "events",
      "raids",
    ]);
  });

  test("each child getEmbed returns embed with color 0x7b68ee, title and description", () => {
    const handler = new GameplayTutorialHandler(server);
    const structure = handler.getMenuStructure();

    for (const child of structure.children ?? []) {
      const embed = child.getEmbed?.();
      expect(embed).toBeDefined();
      expect(embed).toBeInstanceOf(EmbedBuilder);
      expect(embed!.data.color).toBe(0x7b68ee);
      expect(embed!.data.title).toBeDefined();
      expect(embed!.data.description).toBeDefined();
    }
  });

  test("handleAction does nothing", () => {
    const handler = new GameplayTutorialHandler(server);
    expect(() =>
      handler.handleAction([{ value: "gameplay", label: "Gameplay" }]),
    ).not.toThrow();
  });
});

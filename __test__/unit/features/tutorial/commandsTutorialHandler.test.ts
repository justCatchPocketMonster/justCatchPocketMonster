import { CommandsTutorialHandler } from "../../../../src/features/tutorial/commandsTutorialHandler";
import { Server } from "../../../../src/core/classes/Server";
import { EmbedBuilder } from "discord.js";

describe("CommandsTutorialHandler", () => {
  const server = { settings: { language: "eng" } } as unknown as Server;

  test("getMenuStructure returns option with value commands and nine children", () => {
    const handler = new CommandsTutorialHandler(server);
    const structure = handler.getMenuStructure();

    expect(structure.value).toBe("commands");
    expect(structure.label).toBeDefined();
    expect(structure.description).toBeDefined();
    expect(structure.placeholder).toBeDefined();
    expect(structure.children).toHaveLength(9);
    const values = structure.children?.map((c) => c.value) ?? [];
    expect(values).toContain("catch");
    expect(values).toContain("code");
    expect(values).toContain("pokedex");
    expect(values).toContain("howHaveThisPokemon");
  });

  test("child getEmbed returns embed with color, title and description", () => {
    const handler = new CommandsTutorialHandler(server);
    const structure = handler.getMenuStructure();
    const catchChild = structure.children?.find((c) => c.value === "catch");
    expect(catchChild?.getEmbed).toBeDefined();

    const embed = catchChild!.getEmbed!();
    expect(embed).toBeInstanceOf(EmbedBuilder);
    expect(embed.data.color).toBe(0x0099ff);
    expect(embed.data.title).toBeDefined();
    expect(embed.data.description).toBeDefined();
  });

  test("handleAction does nothing", () => {
    const handler = new CommandsTutorialHandler(server);
    expect(() =>
      handler.handleAction([{ value: "commands", label: "Commands" }]),
    ).not.toThrow();
  });

  test("buildCommandEmbed uses fallback label when value not in COMMAND_ENTRIES", () => {
    const handler = new CommandsTutorialHandler(server);
    const embed = (handler as any).buildCommandEmbed(
      "unknownValue",
      "commandCatchExplication",
    );
    expect(embed).toBeInstanceOf(EmbedBuilder);
    expect(embed.data.title).toBeDefined();
    expect(embed.data.description).toBeDefined();
  });
});

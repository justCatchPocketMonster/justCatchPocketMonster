import { languageHandler } from "../../../../src/features/adminSettings/languageHandler";
import { Server } from "../../../../src/core/classes/Server";
import { resetTestEnv } from "../../../utils/resetTestEnv";
import { getServerById } from "../../../../src/cache/ServerCache";
import { createMockInteraction } from "../../../utils/mock/mockInteraction";
import { MenuOption } from "../../../../src/utils/menu";

describe("languageHandler", () => {
  let server: Server;
  let handler: languageHandler;

  beforeEach(async () => {
    await resetTestEnv();
    const interaction = createMockInteraction();
    server = await getServerById(interaction.guildId!);
    handler = new languageHandler(server);
  });

  test("getMenuStructure should return correct menu structure", () => {
    const structure = handler.getMenuStructure();

    expect(structure).toBeDefined();
    expect(structure.value).toBe("language");
    expect(structure.children).toBeDefined();
    expect(structure.children?.length).toBe(2);
    expect(structure.children?.some((c: MenuOption) => c.value === "eng")).toBe(
      true,
    );
    expect(structure.children?.some((c: MenuOption) => c.value === "fr")).toBe(
      true,
    );
    expect(structure.placeholder).toBeDefined();
  });

  test("handleAction should update server language to eng", async () => {
    const selectionPath = [
      { value: "language", label: "Language" },
      { value: "eng", label: "English" },
    ];

    await handler.handleAction(selectionPath);

    const updatedServer = await getServerById(server.discordId);
    expect(updatedServer.settings.language).toBe("eng");
  });

  test("handleAction should update server language to fr", async () => {
    const selectionPath = [
      { value: "language", label: "Language" },
      { value: "fr", label: "Français" },
    ];

    await handler.handleAction(selectionPath);

    const updatedServer = await getServerById(server.discordId);
    expect(updatedServer.settings.language).toBe("fr");
  });
});

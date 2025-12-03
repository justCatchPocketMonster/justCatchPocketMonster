import { maxSpawnsHandler } from "../../../../src/features/adminSettings/MaxSpawnsHandler";
import { Server } from "../../../../src/core/classes/Server";
import { resetTestEnv } from "../../../utils/resetTestEnv";
import { getServerById, updateServer } from "../../../../src/cache/ServerCache";
import { createMockInteraction } from "../../../utils/mock/mockInteraction";
import { MenuOption } from "../../../../src/utils/menu";

describe("maxSpawnsHandler", () => {
  let server: Server;
  let handler: maxSpawnsHandler;

  beforeEach(async () => {
    await resetTestEnv();
    const interaction = createMockInteraction();
    server = await getServerById(interaction.guildId!);
    handler = new maxSpawnsHandler(server);
  });

  test("getMenuStructure should return correct menu structure", () => {
    const structure = handler.getMenuStructure();

    expect(structure).toBeDefined();
    expect(structure.value).toBe("maxSpawns");
    expect(structure.children).toBeDefined();
    expect(structure.children!.length).toBeGreaterThan(0);
    expect(structure.placeholder).toBeDefined();
  });

  test("getMenuStructure should have children based on min spawns", async () => {
    server.settings.spawnMin = 10;
    await updateServer(server.discordId, server);

    const freshServer = await getServerById(server.discordId);
    const newHandler = new maxSpawnsHandler(freshServer);
    const structure = newHandler.getMenuStructure();

    const childrenValues = structure.children!.map((c: MenuOption) =>
      Number.parseInt(c.value),
    );
    const minPossibleValue = Math.ceil(10 / 5) * 5 + 15;
    const minValue = Math.min(...childrenValues);
    expect(minValue).toBeGreaterThanOrEqual(minPossibleValue);
  });

  test("handleAction should update server max spawns", async () => {
    const selectionPath = [
      { value: "maxSpawns", label: "Max Spawns" },
      { value: "25", label: "25" },
    ];

    await handler.handleAction(selectionPath);

    const updatedServer = await getServerById(server.discordId);
    expect(updatedServer.settings.spawnMax).toBe(25);
  });

  test("handleAction should update server max spawns to different value", async () => {
    const selectionPath = [
      { value: "maxSpawns", label: "Max Spawns" },
      { value: "50", label: "50" },
    ];

    await handler.handleAction(selectionPath);

    const updatedServer = await getServerById(server.discordId);
    expect(updatedServer.settings.spawnMax).toBe(50);
  });
});

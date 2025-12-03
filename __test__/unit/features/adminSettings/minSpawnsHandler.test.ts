import { minSpawnsHandler } from "../../../../src/features/adminSettings/MinSpawnsHandler";
import { Server } from "../../../../src/core/classes/Server";
import { resetTestEnv } from "../../../utils/resetTestEnv";
import { getServerById } from "../../../../src/cache/ServerCache";
import { createMockInteraction } from "../../../utils/mock/mockInteraction";
import { MenuOption } from "../../../../src/utils/menu";

describe("minSpawnsHandler", () => {
  let server: Server;
  let handler: minSpawnsHandler;

  beforeEach(async () => {
    await resetTestEnv();
    const interaction = createMockInteraction();
    server = await getServerById(interaction.guildId!);
    handler = new minSpawnsHandler(server);
  });

  test("getMenuStructure should return correct menu structure", () => {
    const structure = handler.getMenuStructure();

    expect(structure).toBeDefined();
    expect(structure.value).toBe("minSpawns");
    expect(structure.children).toBeDefined();
    expect(structure.children!.length).toBeGreaterThan(0);
    expect(structure.placeholder).toBeDefined();
  });

  test("getMenuStructure should have children starting from 5", () => {
    const structure = handler.getMenuStructure();
    const childrenValues = structure.children!.map((c: MenuOption) =>
      Number.parseInt(c.value),
    );
    const minValue = Math.min(...childrenValues);
    expect(minValue).toBe(5);
  });

  test("handleAction should update server min spawns", async () => {
    const selectionPath = [
      { value: "minSpawns", label: "Min Spawns" },
      { value: "8", label: "8" },
    ];

    await handler.handleAction(selectionPath);

    const updatedServer = await getServerById(server.discordId);
    expect(updatedServer.eventSpawn.messageSpawn.min).toBe(8);
  });

  test("handleAction should update server min spawns to different value", async () => {
    const selectionPath = [
      { value: "minSpawns", label: "Min Spawns" },
      { value: "11", label: "11" },
    ];

    await handler.handleAction(selectionPath);

    const updatedServer = await getServerById(server.discordId);
    expect(updatedServer.eventSpawn.messageSpawn.min).toBe(11);
  });
});

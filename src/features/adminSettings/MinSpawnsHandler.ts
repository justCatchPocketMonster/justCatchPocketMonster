import { SelectionPath, MenuHandler } from "../../utils/menu";
import { Server } from "../../core/classes/Server";
import { updateServer } from "../../cache/ServerCache";
import language from "../../lang/language";

export class MinSpawnsHandler implements MenuHandler {
  server: Server;
  constructor(server: Server) {
    this.server = server;
  }

  getMenuStructure() {
    const maxSpawns = this.server.eventSpawn.messageSpawn.max;

    const children = [];
    for (let i = 5; i <= maxSpawns; i += 3) {
      children.push({
        label: i.toString(),
        value: i.toString(),
        description:
          language(
            "adminSettingsSpawnDescription",
            this.server.settings.language,
          ) + i.toString(),
      });
    }
    return {
      label: language(
        "adminSettingsMinSpawnsLabel",
        this.server.settings.language,
      ),
      value: "minSpawns",
      description: language(
        "adminSettingsMinSpawnsDescription",
        this.server.settings.language,
      ),
      placeholder: language(
        "adminSettingsMinSpawnsPlaceholder",
        this.server.settings.language,
      ),
      children: children,
    };
  }

  async handleAction(selectionPath: SelectionPath[]): Promise<void> {
    const selectedValue = selectionPath.at(-1)!.value;

    this.server.eventSpawn.messageSpawn.min = Number.parseInt(selectedValue);
    await updateServer(this.server.discordId, this.server);
  }
}

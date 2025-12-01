import { SelectionPath, MenuHandler } from "../../utils/menu";
import { Server } from "../../core/classes/Server";
import { updateServer } from "../../cache/ServerCache";
import language from "../../lang/language";

export class maxSpawnsHandler implements MenuHandler {
  server: Server;
  constructor(server: Server) {
    this.server = server;
  }

  getMenuStructure() {
    const minSpawns = this.server.settings.spawnMin;
    const minPossibleValue = Math.ceil(minSpawns / 5) * 5 + 15;

    const children = [];
    for (let i = minPossibleValue; i <= 200; i += 5) {
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
        "adminSettingsMaxSpawnsLabel",
        this.server.settings.language,
      ),
      value: "maxSpawns",
      description: language(
        "adminSettingsMaxSpawnsDescription",
        this.server.settings.language,
      ),
      placeholder: language(
        "adminSettingsMaxSpawnsPlaceholder",
        this.server.settings.language,
      ),
      children: children,
    };
  }

  async handleAction(selectionPath: SelectionPath[]): Promise<void> {
    const selectedValue = selectionPath[selectionPath.length - 1].value;

    this.server.settings.spawnMax = parseInt(selectedValue);
    await updateServer(this.server.discordId, this.server);
  }
}

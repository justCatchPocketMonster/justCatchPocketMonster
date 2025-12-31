import { SelectionPath, MenuHandler } from "../../utils/menu";
import { Server } from "../../core/classes/Server";
import { updateServer } from "../../cache/ServerCache";
import language from "../../lang/language";

export class LanguageHandler implements MenuHandler {
  server: Server;
  constructor(server: Server) {
    this.server = server;
  }

  getMenuStructure() {
    const children = [
      {
        label: "eng",
        value: "eng",
        description: "English",
      },
      {
        label: "fr",
        value: "fr",
        description: "Français",
      },
    ];

    return {
      label: language(
        "adminSettingsLanguageLabel",
        this.server.settings.language,
      ),
      value: "language",
      description: language(
        "adminSettingsLanguageDescription",
        this.server.settings.language,
      ),
      placeholder: language(
        "adminSettingsLanguagePlaceholder",
        this.server.settings.language,
      ),
      children: children,
    };
  }

  async handleAction(selectionPath: SelectionPath[]): Promise<void> {
    const selectedValue = selectionPath.at(-1)!.value;

    this.server.settings.language = selectedValue;
    await updateServer(this.server.discordId, this.server);
  }
}

import { MenuHandler, MenuOption, SelectionPath } from "../../utils/menu";
import { Server } from "../../core/classes/Server";
import { EmbedBuilder } from "discord.js";
import language, { type LanguageKey } from "../../lang/language";

const ADMIN_ENTRIES: Array<{
  value: string;
  labelKey: string;
  titleKey: string;
  descKey: string;
}> = [
  {
    value: "language",
    labelKey: "tutorialAdminField1Title",
    titleKey: "tutorialAdminField1Title",
    descKey: "tutorialAdminField1Desc",
  },
  {
    value: "spawn",
    labelKey: "tutorialAdminField2Title",
    titleKey: "tutorialAdminField2Title",
    descKey: "tutorialAdminField2Desc",
  },
];

export class AdminTutorialHandler implements MenuHandler {
  constructor(private server: Server) {}

  getMenuStructure(): MenuOption {
    const lang = this.server.settings.language;
    const children: MenuOption[] = ADMIN_ENTRIES.map((entry) => ({
      label: language(entry.labelKey as LanguageKey, lang),
      value: entry.value,
      description: language("tutorialGameplayShortDesc", lang),
      getEmbed: () => this.buildAdminEmbed(entry),
    }));

    return {
      label: language("tutorialCategoryAdmin", lang),
      value: "admin",
      description: language("tutorialAdminDescription", lang),
      placeholder: language("tutorialSubPlaceholder", lang),
      children,
    };
  }

  private buildAdminEmbed(entry: (typeof ADMIN_ENTRIES)[0]): EmbedBuilder {
    const lang = this.server.settings.language;
    return new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle(language(entry.titleKey as LanguageKey, lang))
      .setDescription(language(entry.descKey as LanguageKey, lang));
  }

  handleAction(_selectionPath: SelectionPath[]): void {}
}

import { MenuHandler, MenuOption, SelectionPath } from "../../utils/menu";
import { Server } from "../../core/classes/Server";
import { EmbedBuilder } from "discord.js";
import language, { type LanguageKey } from "../../lang/language";
import { buildTutorialMenuStructure } from "./tutorialMenuBuilder";

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

const ADMIN_COLOR = 0xe74c3c;

export class AdminTutorialHandler implements MenuHandler {
  constructor(private server: Server) {}

  getMenuStructure(): MenuOption {
    return buildTutorialMenuStructure(this.server, {
      categoryLabelKey: "tutorialCategoryAdmin",
      categoryValue: "admin",
      categoryDescKey: "tutorialAdminDescription",
      placeholderKey: "tutorialSubPlaceholder",
      shortDescKey: "tutorialGameplayShortDesc",
      entries: ADMIN_ENTRIES,
      getLabel: (entry, lang) => language(entry.labelKey as LanguageKey, lang),
      color: ADMIN_COLOR,
      buildEmbed: (entry, lang) =>
        new EmbedBuilder()
          .setColor(ADMIN_COLOR)
          .setTitle(language(entry.titleKey as LanguageKey, lang))
          .setDescription(language(entry.descKey as LanguageKey, lang)),
    });
  }

  handleAction(_selectionPath: SelectionPath[]): void {}
}

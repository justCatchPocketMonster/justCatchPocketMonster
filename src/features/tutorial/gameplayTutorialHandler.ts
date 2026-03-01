import { MenuHandler, MenuOption, SelectionPath } from "../../utils/menu";
import { Server } from "../../core/classes/Server";
import { EmbedBuilder } from "discord.js";
import language, { type LanguageKey } from "../../lang/language";
import { buildTutorialMenuStructure } from "./tutorialMenuBuilder";

const GAMEPLAY_ENTRIES: Array<{
  value: string;
  labelKey: string;
  titleKey: string;
  descKey: string;
}> = [
  {
    value: "spawn",
    labelKey: "tutorialGameplaySpawnLabel",
    titleKey: "tutorialGameplaySpawnTitle",
    descKey: "tutorialGameplaySpawnDesc",
  },
  {
    value: "eggs",
    labelKey: "tutorialGameplayEggsLabel",
    titleKey: "tutorialGameplayEggsTitle",
    descKey: "tutorialGameplayEggsDesc",
  },
  {
    value: "sos",
    labelKey: "tutorialGameplaySosLabel",
    titleKey: "tutorialGameplaySosTitle",
    descKey: "tutorialGameplaySosDesc",
  },
  {
    value: "events",
    labelKey: "tutorialGameplayEventsLabel",
    titleKey: "tutorialGameplayEventsTitle",
    descKey: "tutorialGameplayEventsDesc",
  },
];

const GAMEPLAY_COLOR = 0x7b68ee;

export class GameplayTutorialHandler implements MenuHandler {
  constructor(private server: Server) {}

  getMenuStructure(): MenuOption {
    return buildTutorialMenuStructure(this.server, {
      categoryLabelKey: "tutorialCategoryGameplay",
      categoryValue: "gameplay",
      categoryDescKey: "tutorialCategoryGameplayDesc",
      placeholderKey: "tutorialSubPlaceholder",
      shortDescKey: "tutorialGameplayShortDesc",
      entries: GAMEPLAY_ENTRIES,
      getLabel: (entry, lang) => language(entry.labelKey as LanguageKey, lang),
      color: GAMEPLAY_COLOR,
      buildEmbed: (entry, lang) =>
        new EmbedBuilder()
          .setColor(GAMEPLAY_COLOR)
          .setTitle(language(entry.titleKey as LanguageKey, lang))
          .setDescription(language(entry.descKey as LanguageKey, lang)),
    });
  }

  handleAction(_selectionPath: SelectionPath[]): void {}
}

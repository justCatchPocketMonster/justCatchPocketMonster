import { MenuHandler, MenuOption, SelectionPath } from "../../utils/menu";
import { Server } from "../../core/classes/Server";
import { EmbedBuilder } from "discord.js";
import language, { type LanguageKey } from "../../lang/language";

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

export class GameplayTutorialHandler implements MenuHandler {
  constructor(private server: Server) {}

  getMenuStructure(): MenuOption {
    const lang = this.server.settings.language;
    const children: MenuOption[] = GAMEPLAY_ENTRIES.map((entry) => ({
      label: language(entry.labelKey as LanguageKey, lang),
      value: entry.value,
      description: language("tutorialGameplayShortDesc", lang),
      getEmbed: () => this.buildGameplayEmbed(entry),
    }));

    return {
      label: language("tutorialCategoryGameplay", lang),
      value: "gameplay",
      description: language("tutorialCategoryGameplayDesc", lang),
      placeholder: language("tutorialSubPlaceholder", lang),
      children,
    };
  }

  private buildGameplayEmbed(entry: (typeof GAMEPLAY_ENTRIES)[0]): EmbedBuilder {
    const lang = this.server.settings.language;
    return new EmbedBuilder()
      .setColor(0x7b68ee)
      .setTitle(language(entry.titleKey as LanguageKey, lang))
      .setDescription(language(entry.descKey as LanguageKey, lang));
  }

  handleAction(_selectionPath: SelectionPath[]): void {}
}

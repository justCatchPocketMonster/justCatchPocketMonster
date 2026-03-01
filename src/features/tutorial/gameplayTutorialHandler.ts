import { MenuHandler, MenuOption, SelectionPath } from "../../utils/menu";
import { Server } from "../../core/classes/Server";
import { buildTitleDescTutorialMenu } from "./tutorialMenuBuilder";
import type { TitleDescTutorialEntry } from "./tutorialMenuBuilder";

const GAMEPLAY_ENTRIES: TitleDescTutorialEntry[] = [
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
    return buildTitleDescTutorialMenu(
      this.server,
      "tutorialCategoryGameplay",
      "gameplay",
      "tutorialCategoryGameplayDesc",
      "tutorialGameplayShortDesc",
      GAMEPLAY_ENTRIES,
      GAMEPLAY_COLOR,
    );
  }

  handleAction(_selectionPath: SelectionPath[]): void {}
}

import { MenuHandler, MenuOption, SelectionPath } from "../../utils/menu";
import { Server } from "../../core/classes/Server";
import {
  buildCommandsTutorialMenu,
  buildTitleDescTutorialMenu,
  type CommandsTutorialEntry,
  type TitleDescTutorialEntry,
} from "./tutorialMenuBuilder";

const COMMAND_ENTRIES: CommandsTutorialEntry[] = [
  {
    value: "catch",
    labelKey: "tutorialCmdCatch",
    explicationKey: "commandCatchExplication",
  },
  {
    value: "code",
    labelKey: "tutorialCmdCode",
    explicationKey: "commandCodeExplication",
  },
  {
    value: "pokedex",
    labelKey: "tutorialCmdPokedex",
    explicationKey: "commandPokedexExplication",
  },
  {
    value: "hint",
    labelKey: "tutorialCmdHint",
    explicationKey: "commandHintExplication",
  },
  {
    value: "stat",
    labelKey: "tutorialCmdStat",
    explicationKey: "commandStatExplication",
  },
  {
    value: "information",
    labelKey: "tutorialCmdInformation",
    explicationKey: "commandInformationExplication",
  },
  {
    value: "effect",
    labelKey: "tutorialCmdEffect",
    explicationKey: "commandEffectEvent",
  },
  {
    value: "trade",
    labelKey: "tutorialCmdTrade",
    explicationKey: "commandTradeExplication",
  },
  {
    value: "howHaveThisPokemon",
    labelKey: "tutorialCmdHowHave",
    explicationKey: "commandHowExplication",
  },
];

const ADMIN_ENTRIES: TitleDescTutorialEntry[] = [
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
  {
    value: "raids",
    labelKey: "tutorialGameplayRaidLabel",
    titleKey: "tutorialGameplayRaidTitle",
    descKey: "tutorialGameplayRaidDesc",
  },
];

function createTutorialHandler(
  getMenu: (server: Server) => MenuOption,
): new (server: Server) => MenuHandler {
  return class implements MenuHandler {
    constructor(private server: Server) {}
    getMenuStructure(): MenuOption {
      return getMenu(this.server);
    }
    handleAction(_selectionPath: SelectionPath[]): void {}
  };
}

export const CommandsTutorialHandler = createTutorialHandler((server) =>
  buildCommandsTutorialMenu(
    server,
    "tutorialCategoryCommands",
    "commands",
    "tutorialCategoryCommandsDesc",
    "tutorialCmdShortDesc",
    COMMAND_ENTRIES,
    0x0099ff,
  ),
);

export const AdminTutorialHandler = createTutorialHandler((server) =>
  buildTitleDescTutorialMenu(
    server,
    "tutorialCategoryAdmin",
    "admin",
    "tutorialAdminDescription",
    "tutorialGameplayShortDesc",
    ADMIN_ENTRIES,
    0xe74c3c,
  ),
);

export const GameplayTutorialHandler = createTutorialHandler((server) =>
  buildTitleDescTutorialMenu(
    server,
    "tutorialCategoryGameplay",
    "gameplay",
    "tutorialCategoryGameplayDesc",
    "tutorialGameplayShortDesc",
    GAMEPLAY_ENTRIES,
    0x7b68ee,
  ),
);

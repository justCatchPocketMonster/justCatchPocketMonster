import { MenuHandler, MenuOption, SelectionPath } from "../../utils/menu";
import { Server } from "../../core/classes/Server";
import { buildCommandsTutorialMenu } from "./tutorialMenuBuilder";
import type { CommandsTutorialEntry } from "./tutorialMenuBuilder";

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

const COMMANDS_COLOR = 0x0099ff;

export class CommandsTutorialHandler implements MenuHandler {
  constructor(private server: Server) {}

  getMenuStructure(): MenuOption {
    return buildCommandsTutorialMenu(
      this.server,
      "tutorialCategoryCommands",
      "commands",
      "tutorialCategoryCommandsDesc",
      "tutorialCmdShortDesc",
      COMMAND_ENTRIES,
      COMMANDS_COLOR,
    );
  }

  handleAction(_selectionPath: SelectionPath[]): void {}
}

import { MenuHandler, MenuOption, SelectionPath } from "../../utils/menu";
import { Server } from "../../core/classes/Server";
import { EmbedBuilder } from "discord.js";
import language, { type LanguageKey } from "../../lang/language";
import { buildTutorialMenuStructure } from "./tutorialMenuBuilder";

const COMMAND_ENTRIES: Array<{
  value: string;
  labelKey: string;
  explicationKey: string;
}> = [
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
    return buildTutorialMenuStructure(this.server, {
      categoryLabelKey: "tutorialCategoryCommands",
      categoryValue: "commands",
      categoryDescKey: "tutorialCategoryCommandsDesc",
      placeholderKey: "tutorialSubPlaceholder",
      shortDescKey: "tutorialCmdShortDesc",
      entries: COMMAND_ENTRIES,
      getLabel: (entry, lang) => language(entry.labelKey as LanguageKey, lang),
      color: COMMANDS_COLOR,
      buildEmbed: (entry, lang) =>
        new EmbedBuilder()
          .setColor(COMMANDS_COLOR)
          .setTitle(language(entry.labelKey as LanguageKey, lang))
          .setDescription(language(entry.explicationKey as LanguageKey, lang)),
    });
  }

  handleAction(_selectionPath: SelectionPath[]): void {}
}

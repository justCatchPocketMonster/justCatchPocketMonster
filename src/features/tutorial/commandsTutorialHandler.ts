import { MenuHandler, MenuOption, SelectionPath } from "../../utils/menu";
import { Server } from "../../core/classes/Server";
import { EmbedBuilder } from "discord.js";
import language, { type LanguageKey } from "../../lang/language";

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

export class CommandsTutorialHandler implements MenuHandler {
  constructor(private server: Server) {}

  getMenuStructure(): MenuOption {
    const lang = this.server.settings.language;
    const children: MenuOption[] = COMMAND_ENTRIES.map((entry) => ({
      label: language(entry.labelKey as LanguageKey, lang),
      value: entry.value,
      description: language("tutorialCmdShortDesc", lang),
      getEmbed: () => this.buildCommandEmbed(entry.value, entry.explicationKey),
    }));

    return {
      label: language("tutorialCategoryCommands", lang),
      value: "commands",
      description: language("tutorialCategoryCommandsDesc", lang),
      placeholder: language("tutorialSubPlaceholder", lang),
      children,
    };
  }

  private buildCommandEmbed(
    value: string,
    explicationKey: string,
  ): EmbedBuilder {
    const lang = this.server.settings.language;
    const labelKey =
      COMMAND_ENTRIES.find((e) => e.value === value)?.labelKey ??
      "tutorialCmdCatch";
    return new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(language(labelKey as LanguageKey, lang))
      .setDescription(language(explicationKey as LanguageKey, lang));
  }

  handleAction(_selectionPath: SelectionPath[]): void {}
}

import { MenuOption } from "../../utils/menu";
import { Server } from "../../core/classes/Server";
import { EmbedBuilder } from "discord.js";
import language, { type LanguageKey } from "../../lang/language";

const PLACEHOLDER_KEY: LanguageKey = "tutorialSubPlaceholder";

export interface TutorialMenuConfig<T extends { value: string }> {
  categoryLabelKey: LanguageKey;
  categoryValue: string;
  categoryDescKey: LanguageKey;
  placeholderKey: LanguageKey;
  shortDescKey: LanguageKey;
  entries: T[];
  getLabel: (entry: T, lang: string) => string;
  color: number;
  buildEmbed: (entry: T, lang: string) => EmbedBuilder;
}

export function buildTutorialMenuStructure<T extends { value: string }>(
  server: Server,
  config: TutorialMenuConfig<T>,
): MenuOption {
  const lang = server.settings.language;
  const children: MenuOption[] = config.entries.map((entry) => ({
    label: config.getLabel(entry, lang),
    value: entry.value,
    description: language(config.shortDescKey, lang),
    getEmbed: () => config.buildEmbed(entry, lang),
  }));

  return {
    label: language(config.categoryLabelKey, lang),
    value: config.categoryValue,
    description: language(config.categoryDescKey, lang),
    placeholder: language(config.placeholderKey, lang),
    children,
  };
}

export interface CommandsTutorialEntry {
  value: string;
  labelKey: LanguageKey;
  explicationKey: LanguageKey;
}

export interface TitleDescTutorialEntry {
  value: string;
  labelKey: LanguageKey;
  titleKey: LanguageKey;
  descKey: LanguageKey;
}

export function buildCommandsTutorialMenu(
  server: Server,
  categoryLabelKey: LanguageKey,
  categoryValue: string,
  categoryDescKey: LanguageKey,
  shortDescKey: LanguageKey,
  entries: CommandsTutorialEntry[],
  color: number,
): MenuOption {
  return buildTutorialMenuStructure(server, {
    categoryLabelKey,
    categoryValue,
    categoryDescKey,
    placeholderKey: PLACEHOLDER_KEY,
    shortDescKey,
    entries,
    getLabel: (e, lang) => language(e.labelKey, lang),
    color,
    buildEmbed: (e, lang) =>
      new EmbedBuilder()
        .setColor(color)
        .setTitle(language(e.labelKey, lang))
        .setDescription(language(e.explicationKey, lang)),
  });
}

export function buildTitleDescTutorialMenu(
  server: Server,
  categoryLabelKey: LanguageKey,
  categoryValue: string,
  categoryDescKey: LanguageKey,
  shortDescKey: LanguageKey,
  entries: TitleDescTutorialEntry[],
  color: number,
): MenuOption {
  return buildTutorialMenuStructure(server, {
    categoryLabelKey,
    categoryValue,
    categoryDescKey,
    placeholderKey: PLACEHOLDER_KEY,
    shortDescKey,
    entries,
    getLabel: (e, lang) => language(e.labelKey, lang),
    color,
    buildEmbed: (e, lang) =>
      new EmbedBuilder()
        .setColor(color)
        .setTitle(language(e.titleKey, lang))
        .setDescription(language(e.descKey, lang)),
  });
}

import {
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} from "discord.js";
import { MenuOption, SelectionPath } from "./types";
import { findMenuOption } from "./utils";

/**
 * Options for building menu components.
 */
export interface MenuBuilderOptions {
  /** Placeholder text for sub-element select menus */
  subElementPlaceholder: string;
}

/**
 * Builds all menu components (select menus) based on the current selection path.
 * Creates a select menu for each level in the path and adds a menu for the next level if available.
 * @param selectionPath - The current path of selected menu options
 * @param menuOptions - The root menu options structure
 * @param options - Options for building the menus
 * @returns Array of action rows containing the menu components
 */
export function buildAllMenus(
  selectionPath: SelectionPath[],
  menuOptions: MenuOption[],
  options: MenuBuilderOptions,
): ActionRowBuilder<StringSelectMenuBuilder | ButtonBuilder>[] {
  const components: ActionRowBuilder<
    StringSelectMenuBuilder | ButtonBuilder
  >[] = [];

  let currentOptions = menuOptions;
  let currentPath: SelectionPath[] = [];

  for (let i = 0; i < selectionPath.length; i++) {
    const pathItem = selectionPath[i];
    const option = findMenuOption(currentOptions, pathItem.value);

    if (!option) break;

    currentPath.push(pathItem);

    const placeholder = option.placeholder || pathItem.label;

    const menu = new StringSelectMenuBuilder()
      .setCustomId(`menu_${i}_${currentPath.map((p) => p.value).join("_")}`)
      .setPlaceholder(placeholder)
      .addOptions(
        currentOptions.map((opt: MenuOption) => ({
          label: opt.label,
          value: opt.value,
          description: opt.description,
          default: opt.value === pathItem.value,
        })),
      );

    components.push(
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu),
    );

    if (option.children && option.children.length > 0) {
      currentOptions = option.children;
    } else {
      break;
    }
  }

  if (selectionPath.length > 0) {
    let lastParentOptions = menuOptions;
    for (let i = 0; i < selectionPath.length - 1; i++) {
      const option = findMenuOption(lastParentOptions, selectionPath[i].value);
      if (option?.children) {
        lastParentOptions = option.children;
      } else {
        break;
      }
    }

    const lastOption = findMenuOption(
      lastParentOptions,
      selectionPath[selectionPath.length - 1].value,
    );

    if (lastOption?.children && lastOption.children.length > 0) {
      // Use custom placeholder from the last option if available, otherwise use default subElementPlaceholder
      const placeholder =
        lastOption.placeholder || options.subElementPlaceholder;

      const nextMenu = new StringSelectMenuBuilder()
        .setCustomId(
          `menu_${selectionPath.length}_${selectionPath.map((p) => p.value).join("_")}`,
        )
        .setPlaceholder(placeholder)
        .addOptions(
          lastOption.children.map((child: MenuOption) => ({
            label: child.label,
            value: child.value,
            description: child.description,
          })),
        );
      components.push(
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(nextMenu),
      );
    }
  }

  return components;
}

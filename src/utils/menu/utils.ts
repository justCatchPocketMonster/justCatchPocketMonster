import { MenuOption, SelectionPath } from "./types";

/**
 * Recursively searches for a menu option by its value in a tree of menu options.
 * @param menuOptions - The array of menu options to search through
 * @param value - The value to search for
 * @returns The found menu option, or undefined if not found
 */
export function findMenuOption(
  menuOptions: MenuOption[],
  value: string,
): MenuOption | undefined {
  for (const option of menuOptions) {
    if (option.value === value) {
      return option;
    }
    if (option.children) {
      const found = findMenuOption(option.children, value);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * Builds a description string from a selection path with hierarchical formatting.
 * Uses mainMenuText for the first level and subElementText (repeated by depth) for nested levels.
 * @param selectionPath - The path of selected menu options
 * @param mainMenuText - Text prefix for the main menu level
 * @param subElementText - Text prefix for sub-menu levels (will be repeated based on depth)
 * @returns Formatted description string
 */
export function buildEmbedDescription(
  selectionPath: SelectionPath[],
  mainMenuText: string,
  subElementText: string,
): string {
  let description = "";
  selectionPath.forEach((selection, index) => {
    if (index === 0) {
      description += mainMenuText + `**${selection.label}**`;
    } else {
      const subElementPrefix = subElementText.repeat(index);
      description += `\n${subElementPrefix}**${selection.label}**`;
    }
  });
  return description;
}

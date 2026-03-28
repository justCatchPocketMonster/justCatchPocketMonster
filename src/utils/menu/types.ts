import { EmbedBuilder } from "discord.js";

/**
 * Represents a menu option that can be displayed in a select menu.
 */
export interface MenuOption {
  /** The display label for this option */
  label: string;
  /** The unique value identifier for this option */
  value: string;
  /** The description text shown when hovering over this option */
  description: string;
  /** Optional nested menu options (children) */
  children?: MenuOption[];
  /** Optional function to create a custom embed for this menu/sub-menu */
  getEmbed?: () => EmbedBuilder;
  /** Optional placeholder text for the select menu when this option is selected */
  placeholder?: string;
}

/**
 * Represents a path of selected menu options from root to current selection.
 */
export interface SelectionPath {
  /** The value of the selected option */
  value: string;
  /** The label of the selected option */
  label: string;
}

/**
 * Interface that menu handlers must implement to provide menu structure and handle actions.
 */
export interface MenuHandler<T = any> {
  /**
   * Returns the menu structure for this handler.
   * @returns The menu option structure with label, value, description, and optional children
   */
  getMenuStructure(): MenuOption;

  /**
   * Handles the action when a leaf option is selected.
   * @param selectionPath - The complete path from root to the selected leaf option
   */
  handleAction(selectionPath: SelectionPath[]): Promise<void> | void;
}

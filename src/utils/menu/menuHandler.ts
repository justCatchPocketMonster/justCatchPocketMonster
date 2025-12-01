import {
  StringSelectMenuInteraction,
  Message,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
} from "discord.js";
import { MenuOption, SelectionPath, MenuHandler } from "./types";
import { findMenuOption } from "./utils";
import { buildAllMenus, MenuBuilderOptions } from "./menuBuilder";

/**
 * Finds the appropriate embed to use based on the selection path.
 * Searches from the most recent selection to the oldest, using the first found custom embed,
 * or falls back to the default embed if none is found.
 * @param selectionPath - The path of selected menu options
 * @param menuOptions - The root menu options to search through
 * @param getDefaultEmbed - Function that returns the default embed to use as fallback
 * @returns The embed to display
 */
async function findEmbedInPath(
  selectionPath: SelectionPath[],
  menuOptions: MenuOption[],
  getDefaultEmbed: () => Promise<EmbedBuilder>
): Promise<EmbedBuilder> {
  let embed: EmbedBuilder | null = null;
  
  for (let i = selectionPath.length - 1; i >= 0; i--) {
    let currentOptions = menuOptions;
    
    for (let j = 0; j <= i; j++) {
      const option = findMenuOption(currentOptions, selectionPath[j].value);
      if (option) {
        if (j === i && option.getEmbed) {
          embed = option.getEmbed();
          break;
        }
        currentOptions = option.children || [];
      } else {
        break;
      }
    }
    if (embed !== null) break;
  }
  
  return embed !== null ? embed : await getDefaultEmbed();
}

/**
 * Configuration interface for menu selection handling.
 */
export interface MenuHandlerConfig<T extends MenuHandler> {
  /** Array of menu options to display */
  menuOptions: MenuOption[];
  /** Map of menu handlers keyed by their value identifier */
  menuHandlers: Map<string, MenuHandler>;
  /** Map storing current selection paths by message ID */
  currentSelectionPath: Map<string, SelectionPath[]>;
  /** Async function that creates the main embed (used as fallback) */
  getMainEmbed: () => Promise<EmbedBuilder>;
  /** Text prefix for main menu items in descriptions */
  mainMenuText: string;
  /** Text prefix for sub-menu items in descriptions */
  subElementText: string;
  /** Text to display when selecting a sub-element */
  selectSubElementText: string;
  /** Text to display when clicking the confirm button */
  clickButtonConfirmText: string;
  /** Placeholder text for sub-element selects */
  subElementPlaceholder: string;
  /** Language code for translations */
  lang: string;
  /** Optional function to create a custom confirm button */
  createConfirmButton?: (lang: string) => ButtonBuilder;
  /** Optional callback when a leaf node is reached */
  onLeafReached?: (
    selectionPath: SelectionPath[],
    message: Message,
  ) => Promise<void> | void;
}

/**
 * Handles menu selection interactions and updates the menu display accordingly.
 * @param selectInteraction - The select menu interaction from Discord
 * @param message - The message containing the menu
 * @param customId - The custom ID of the select menu that was interacted with
 * @param config - Configuration object for handling the menu selection
 */
export async function handleMenuSelection<T extends MenuHandler>(
  selectInteraction: StringSelectMenuInteraction,
  message: Message,
  customId: string,
  config: MenuHandlerConfig<T>,
): Promise<void> {
  if (selectInteraction.replied || selectInteraction.deferred) {
    return;
  }

  try {
    await selectInteraction.deferUpdate();
  } catch (error) {
    console.error("[ERROR] Failed to defer update:", error);
    return;
  }

  let menuLevel = 0;
  let pathValues: string[] = [];
  
  if (customId === "main_menu") {
    menuLevel = 0;
  } else {
    const customIdParts = customId.split('_');
    menuLevel = parseInt(customIdParts[1]) || 0;
    pathValues = customIdParts.slice(2);
  }
  
  let newSelectionPath: SelectionPath[] = [];
  let currentOptions = config.menuOptions;
  
  if (menuLevel === 0) {
    const selectedValue = selectInteraction.values[0];
    const selectedOption = findMenuOption(currentOptions, selectedValue);
    if (selectedOption) {
      newSelectionPath = [{ value: selectedOption.value, label: selectedOption.label }];
    }
  } else {
    for (let i = 0; i < menuLevel && i < pathValues.length; i++) {
      const option = findMenuOption(currentOptions, pathValues[i]);
      if (option) {
        newSelectionPath.push({ value: option.value, label: option.label });
        currentOptions = option.children || [];
      } else {
        break;
      }
    }
    
    const selectedValue = selectInteraction.values[0];
    const selectedOption = findMenuOption(currentOptions, selectedValue);
    if (selectedOption) {
      newSelectionPath.push({ value: selectedOption.value, label: selectedOption.label });
    }
  }

  if (newSelectionPath.length === 0) {
    return;
  }

  const lastOption = newSelectionPath.length > 0 
    ? findMenuOption(
        newSelectionPath.length > 1
          ? findMenuOption(config.menuOptions, newSelectionPath[newSelectionPath.length - 2].value)?.children || []
          : config.menuOptions,
        newSelectionPath[newSelectionPath.length - 1].value
      )
    : null;

  const builderOptions: MenuBuilderOptions = {
    subElementPlaceholder: config.subElementPlaceholder,
  };

  if (lastOption && lastOption.children && lastOption.children.length > 0) {
    const components = buildAllMenus(newSelectionPath, config.menuOptions, builderOptions);

    const embed = await findEmbedInPath(newSelectionPath, config.menuOptions, config.getMainEmbed);

    try {
      await selectInteraction.editReply({
        embeds: [embed],
        components: components,
      });
    } catch (error) {
      console.error("[ERROR] Failed to edit reply:", error);
      return;
    }
  } else {
    const components = buildAllMenus(newSelectionPath, config.menuOptions, builderOptions);
    
    if (config.createConfirmButton) {
      const button = config.createConfirmButton(config.lang);
      const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
      components.push(buttonRow);
    }

    const embed = await findEmbedInPath(newSelectionPath, config.menuOptions, config.getMainEmbed);

    try {
      await selectInteraction.editReply({
        embeds: [embed],
        components: components,
      });
    } catch (error) {
      console.error("[ERROR] Failed to edit reply:", error);
      return;
    }

    config.currentSelectionPath.set(message.id, newSelectionPath);

    if (config.onLeafReached) {
      await config.onLeafReached(newSelectionPath, message);
    }
  }
}


import {
  ChatInputCommandInteraction,
  Message,
  StringSelectMenuInteraction,
  ButtonInteraction,
  ComponentType,
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} from "discord.js";
import { MenuOption, SelectionPath, MenuHandler, handleMenuSelection, MenuHandlerConfig } from "./index";
import { buildAllMenus } from "./menuBuilder";
import { newLogger } from "../../middlewares/logger";

/**
 * Configuration interface for the MenuSystem.
 */
export interface MenuSystemConfig<T extends MenuHandler> {
  /** Function to generate/regenerate menu handlers (menuOptions will be generated automatically from handlers) */
  regenerateMenu: () => Promise<Map<string, MenuHandler>> | Map<string, MenuHandler>;
  /** Async function that creates the main embed (called on each reset) */
  getMainEmbed: () => Promise<EmbedBuilder>;
  /** Placeholder text for the main menu select */
  mainMenuPlaceholder: string;
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
  /** Optional callback when the confirm button is clicked */
  onButtonClick?: (
    buttonInteraction: ButtonInteraction,
    message: Message,
    selectionPath: SelectionPath[],
    lang: string,
  ) => Promise<void> | void;
  /** Timeout in milliseconds for the collectors (default: 60000) */
  timeout?: number;
  /** If true, resets the menu to main on button click; if false, disables the button */
  resetOnButtonClick?: boolean;
  /** Custom validation message when resetOnButtonClick is false */
  buttonValidationMessage?: string;
  /** Optional callback when the menu system ends (timeout or stop) */
  onEnd?: () => void;
}

/**
 * Main menu system class that handles interactive menu navigation and selection.
 */
export class MenuSystem<T extends MenuHandler> {
  private config: MenuSystemConfig<T>;
  private message: Message | null = null;
  private currentSelectionPath: Map<string, SelectionPath[]> = new Map();
  private mainCollector: any = null;
  private buttonCollector: any = null;
  private interaction: ChatInputCommandInteraction | null = null;
  private regenerateMenu: () => Promise<Map<string, MenuHandler>> | Map<string, MenuHandler>;
  private menuOptions: MenuOption[] = [];
  private menuHandlers: Map<string, MenuHandler> = new Map();

  /**
   * Helper function to generate menuOptions from menuHandlers
   */
  private generateMenuOptions(handlers: Map<string, MenuHandler>): MenuOption[] {
    const structure: MenuOption[] = [];
    handlers.forEach((handler) => {
      structure.push(handler.getMenuStructure());
    });
    return structure;
  }

  /**
   * Creates a new MenuSystem instance.
   * @param config - Configuration object for the menu system
   */
  constructor(config: MenuSystemConfig<T>) {
    this.config = config;
    this.regenerateMenu = config.regenerateMenu;
  }

  /**
   * Initializes the menu system and sends the initial message.
   * @param interaction - The Discord interaction that triggered the menu
   */
  async initialize(interaction: ChatInputCommandInteraction): Promise<void> {
    this.interaction = interaction;
    
    // Initialize menuHandlers from regenerateMenu and generate menuOptions automatically
    this.menuHandlers = await Promise.resolve(this.regenerateMenu());
    this.menuOptions = this.generateMenuOptions(this.menuHandlers);
    
    this.message = await interaction.reply({
      embeds: [await this.config.getMainEmbed()],
      fetchReply: true,
    });

    this.setupCollectors(interaction);
    this.setupMainMenu(interaction);
  }

  private setupCollectors(interaction: ChatInputCommandInteraction): void {
    if (!this.message) return;

    const timeout = this.config.timeout || 60000;

    this.mainCollector = this.message.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter: (i) => (i.customId === "main_menu" || i.customId.startsWith('menu_')) && i.user.id === interaction.user.id,
      time: timeout,
    });

    this.buttonCollector = this.message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: (i) => i.customId === "show_values" && i.user.id === interaction.user.id,
      time: timeout,
    });

    this.mainCollector.on("collect", async (selectInteraction: StringSelectMenuInteraction) => {
      try {
        const customId = selectInteraction.customId === "main_menu" ? "main_menu" : selectInteraction.customId;
        
        const handlerConfig: MenuHandlerConfig<MenuHandler> = {
          menuOptions: this.menuOptions,
          menuHandlers: this.menuHandlers,
          currentSelectionPath: this.currentSelectionPath,
          getMainEmbed: this.config.getMainEmbed,
          mainMenuText: this.config.mainMenuText,
          subElementText: this.config.subElementText,
          selectSubElementText: this.config.selectSubElementText,
          clickButtonConfirmText: this.config.clickButtonConfirmText,
          subElementPlaceholder: this.config.subElementPlaceholder,
          lang: this.config.lang,
          createConfirmButton: this.config.createConfirmButton,
        };
        
        await handleMenuSelection(selectInteraction, this.message!, customId, handlerConfig);
      } catch (error) {
        console.error("[ERROR] Error in mainCollector:", error);
      }
    });

    this.buttonCollector.on("collect", async (buttonInteraction: ButtonInteraction) => {
      try {
        console.log(`[MenuSystem] Button clicked: ${buttonInteraction.customId}`);
        newLogger("info", `[MenuSystem] Button clicked: ${buttonInteraction.customId}`);
        if (!this.message || !this.interaction) {
          console.log(`[MenuSystem] Message or interaction is null`);
          newLogger("warn", `[MenuSystem] Message or interaction is null`);
          return;
        }
        
        const selectionPath = this.currentSelectionPath.get(this.message.id) || [];
        console.log(`[MenuSystem] SelectionPath from cache: ${JSON.stringify(selectionPath.map(s => ({ value: s.value, label: s.label })))}`);
        newLogger("info", `[MenuSystem] SelectionPath from cache: ${JSON.stringify(selectionPath.map(s => ({ value: s.value, label: s.label })))}`);
        const mainMenuValue = selectionPath[0]?.value;
        console.log(`[MenuSystem] MainMenuValue: ${mainMenuValue}`);
        newLogger("info", `[MenuSystem] MainMenuValue: ${mainMenuValue}`);
        
        if (mainMenuValue) {
          const handler = this.menuHandlers.get(mainMenuValue);
          console.log(`[MenuSystem] Handler found: ${handler ? "yes" : "no"} for value ${mainMenuValue}`);
          newLogger("info", `[MenuSystem] Handler found: ${handler ? "yes" : "no"} for value ${mainMenuValue}`);
          if (handler) {
            console.log(`[MenuSystem] Calling handleAction on handler for ${mainMenuValue}`);
            newLogger("info", `[MenuSystem] Calling handleAction on handler for ${mainMenuValue}`);
            try {
              await handler.handleAction(selectionPath);
              console.log(`[MenuSystem] handleAction completed for ${mainMenuValue}`);
              newLogger("info", `[MenuSystem] handleAction completed for ${mainMenuValue}`);
            } catch (error) {
              console.error(`[MenuSystem] Error in handleAction:`, error);
              newLogger("error", `[MenuSystem] Error in handleAction: ${error}`, `Error calling handleAction for ${mainMenuValue}: ${error instanceof Error ? error.message : String(error)}`);
              if (error instanceof Error) {
                console.error(`[MenuSystem] Error stack:`, error.stack);
                newLogger("error", `[MenuSystem] Error stack: ${error.stack}`, error.stack || "");
              }
            }
          } else {
            console.log(`[MenuSystem] No handler found for mainMenuValue: ${mainMenuValue}`);
            console.log(`[MenuSystem] Available handlers: ${Array.from(this.menuHandlers.keys()).join(", ")}`);
            newLogger("warn", `[MenuSystem] No handler found for mainMenuValue: ${mainMenuValue}`);
            newLogger("info", `[MenuSystem] Available handlers: ${Array.from(this.menuHandlers.keys()).join(", ")}`);
          }
        } else {
          console.log(`[MenuSystem] No mainMenuValue found in selectionPath`);
          newLogger("warn", `[MenuSystem] No mainMenuValue found in selectionPath`);
        }

        if (this.config.onButtonClick) {
          console.log(`[MenuSystem] Calling onButtonClick`);
          await this.config.onButtonClick(buttonInteraction, this.message, selectionPath, this.config.lang);
          console.log(`[MenuSystem] onButtonClick completed`);
        }

        const resetOnButtonClick = this.config.resetOnButtonClick ?? false;
        
        if (resetOnButtonClick) {
          this.currentSelectionPath.delete(this.message.id);
          
          // Regenerate menu handlers and generate menuOptions automatically
          this.menuHandlers = await Promise.resolve(this.regenerateMenu());
          this.menuOptions = this.generateMenuOptions(this.menuHandlers);
          console.log(`[MenuSystem] Menu options and handlers regenerated`);
          
          // Use placeholder from first menu option if available, otherwise use config default
          const placeholder = this.menuOptions.length > 0 && this.menuOptions[0].placeholder 
            ? this.menuOptions[0].placeholder 
            : this.config.mainMenuPlaceholder;
          
          const mainMenu = new StringSelectMenuBuilder()
            .setCustomId("main_menu")
            .setPlaceholder(placeholder)
            .addOptions(
              this.menuOptions.map((option: MenuOption) => ({
                label: option.label,
                value: option.value,
                description: option.description,
              })),
            );
          
          const mainRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(mainMenu);
          
          await buttonInteraction.editReply({
            embeds: [await this.config.getMainEmbed()],
            components: [mainRow],
          });
        } else {
          const validationMessage = this.config.buttonValidationMessage || "Action confirmée !";
          
          const disabledButton = this.config.createConfirmButton 
            ? this.config.createConfirmButton(this.config.lang).setDisabled(true)
            : new ButtonBuilder()
                .setCustomId("show_values")
                .setLabel(validationMessage)
                .setStyle(1)
                .setDisabled(true);
          
          const disabledButtonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(disabledButton);
          
          const components = buildAllMenus(selectionPath, this.menuOptions, {
            subElementPlaceholder: this.config.subElementPlaceholder,
          });
          components.push(disabledButtonRow);
          
          await buttonInteraction.editReply({
            components: components,
          });
          
          this.buttonCollector?.stop();
        }
      } catch (error) {
        console.error("[ERROR] Error in buttonCollector:", error);
        newLogger("error", `[MenuSystem] Error in buttonCollector: ${error}`, `Error in buttonCollector: ${error instanceof Error ? error.message : String(error)}`);
        if (error instanceof Error) {
          console.error("[ERROR] Error stack:", error.stack);
          newLogger("error", `[MenuSystem] Error stack: ${error.stack}`, error.stack || "");
        }
      }
    });

    let ended = false;
    const handleEnd = () => {
      if (!ended && this.config.onEnd) {
        ended = true;
        this.config.onEnd();
      }
    };

    this.mainCollector.on("end", async (collected: any, reason: string) => {
      if (reason === "time" && collected.size === 0) {
        try {
          await interaction.editReply({
            components: [],
          });
        } catch (e) {
        }
      }
      handleEnd();
    });

    this.buttonCollector.on("end", async (collected: any, reason: string) => {
      if (reason === "time" && collected.size === 0) {
        try {
          await interaction.editReply({
            components: [],
          });
        } catch (e) {
        }
      }
      handleEnd();
    });
  }

  private async setupMainMenu(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!this.message) return;

    // Use placeholder from first menu option if available, otherwise use config default
    const placeholder = this.menuOptions.length > 0 && this.menuOptions[0].placeholder 
      ? this.menuOptions[0].placeholder 
      : this.config.mainMenuPlaceholder;

    const mainMenu = new StringSelectMenuBuilder()
      .setCustomId("main_menu")
      .setPlaceholder(placeholder)
      .addOptions(
        this.menuOptions.map((option: MenuOption) => ({
          label: option.label,
          value: option.value,
          description: option.description,
        })),
      );

    const mainRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(mainMenu);

    await interaction.editReply({
      embeds: [await this.config.getMainEmbed()],
      components: [mainRow],
    });
  }

  /**
   * Stops all active collectors.
   */
  stop(): void {
    this.mainCollector?.stop();
    this.buttonCollector?.stop();
    if (this.config.onEnd) {
      this.config.onEnd();
    }
  }
}


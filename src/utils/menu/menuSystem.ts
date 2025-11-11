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

/**
 * Configuration interface for the MenuSystem.
 */
export interface MenuSystemConfig<T extends MenuHandler> {
  /** Array of menu options to display in the main menu */
  menuOptions: MenuOption[];
  /** Map of menu handlers keyed by their value identifier */
  menuHandlers: Map<string, T>;
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

  /**
   * Creates a new MenuSystem instance.
   * @param config - Configuration object for the menu system
   */
  constructor(config: MenuSystemConfig<T>) {
    this.config = config;
  }

  /**
   * Initializes the menu system and sends the initial message.
   * @param interaction - The Discord interaction that triggered the menu
   */
  async initialize(interaction: ChatInputCommandInteraction): Promise<void> {
    this.interaction = interaction;
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
        
        const handlerConfig: MenuHandlerConfig<T> = {
          menuOptions: this.config.menuOptions,
          menuHandlers: this.config.menuHandlers,
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
        if (!this.message || !this.interaction) return;
        
        const selectionPath = this.currentSelectionPath.get(this.message.id) || [];
        const mainMenuValue = selectionPath[0]?.value;
        
        if (mainMenuValue) {
          const handler = this.config.menuHandlers.get(mainMenuValue);
          if (handler) {
            await handler.handleAction(selectionPath);
          }
        }

        if (this.config.onButtonClick) {
          await this.config.onButtonClick(buttonInteraction, this.message, selectionPath, this.config.lang);
        }

        const resetOnButtonClick = this.config.resetOnButtonClick ?? false;
        
        if (resetOnButtonClick) {
          this.currentSelectionPath.delete(this.message.id);
          
          const mainMenu = new StringSelectMenuBuilder()
            .setCustomId("main_menu")
            .setPlaceholder(this.config.mainMenuPlaceholder)
            .addOptions(
              this.config.menuOptions.map((option) => ({
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
          
          const components = buildAllMenus(selectionPath, this.config.menuOptions, {
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
      }
    });

    this.mainCollector.on("end", async (collected: any, reason: string) => {
      if (reason === "time" && collected.size === 0) {
        try {
          await interaction.editReply({
            components: [],
          });
        } catch (e) {
        }
      }
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
    });
  }

  private async setupMainMenu(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!this.message) return;

    const mainMenu = new StringSelectMenuBuilder()
      .setCustomId("main_menu")
      .setPlaceholder(this.config.mainMenuPlaceholder)
      .addOptions(
        this.config.menuOptions.map((option) => ({
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
  }
}


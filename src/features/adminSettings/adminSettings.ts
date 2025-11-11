import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Server } from "../../core/classes/Server";
import { MenuHandler, MenuSystem, MenuOption, SelectionPath } from "../../utils/menu";
import {
  createShowValuesButton,
  handleButtonClick,
} from "./utils";
import { minSpawnsHandler } from "./minSpawnsHandler";
import { maxSpawnsHandler } from "./maxSpawnsHandler";
import { languageHandler } from "./languageHandler";
import language from "../../lang/language";
import { getServerById } from "../../cache/ServerCache";

function createMenuHandlers(server: Server): Map<string, MenuHandler> {
  return new Map([
    ["minSpawns", new minSpawnsHandler(server)],
    ["maxSpawns", new maxSpawnsHandler(server)],
    ["language", new languageHandler(server)],
  ]);
}

function getMenuStructure(menuHandlers: Map<string, MenuHandler>): MenuOption[] {
  const structure: MenuOption[] = [];
  menuHandlers.forEach((handler) => {
    structure.push(handler.getMenuStructure());
  });
  return structure;
}

export async function adminSettings(
  interaction: ChatInputCommandInteraction,
  server: Server,
) {
  const menuHandlers = createMenuHandlers(server);
  const menuStructure = getMenuStructure(menuHandlers);
  const lang = server.settings.language;

  const getMainEmbed = async (): Promise<EmbedBuilder> => {

    const serverMain = await getServerById(server.discordId);

    return new EmbedBuilder()
      .setTitle(language("adminSettingsTitle", serverMain.settings.language))
      .setDescription(language("adminSettingsSelectMainOption", serverMain.settings.language))
      .setColor(0x0099ff);
  };

  const menuSystem = new MenuSystem({
    menuOptions: menuStructure,
    menuHandlers: menuHandlers,
    getMainEmbed: getMainEmbed,
    mainMenuPlaceholder: language("adminSettingsSelectMainMenuPlaceholder", lang),
    mainMenuText: language("adminSettingsMainMenu", lang),
    subElementText: language("adminSettingsSubElement", lang),
    selectSubElementText: language("adminSettingsSelectSubElement", lang),
    clickButtonConfirmText: language("adminSettingsClickButtonConfirm", lang),
    subElementPlaceholder: language("adminSettingsSelectSubElementPlaceholder", lang),
    lang: lang,
    createConfirmButton: createShowValuesButton,
    onButtonClick: handleButtonClick,
    resetOnButtonClick: true,
  });

  await menuSystem.initialize(interaction);
}

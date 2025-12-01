import {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  Message,
  ButtonInteraction,
} from "discord.js";
import { SelectionPath, MenuOption } from "../../utils/menu";
import language from "../../lang/language";

export function createShowValuesButton(lang: string): ButtonBuilder {
  const label = language("adminSettingsShowValues", lang);

  if (!label || typeof label !== "string" || label.trim().length === 0) {
    throw new Error(`Invalid label for adminSettingsShowValues: ${label}`);
  }

  return new ButtonBuilder()
    .setCustomId("show_values")
    .setLabel(label)
    .setStyle(ButtonStyle.Primary);
}

export function createDisabledButton(lang: string): ButtonBuilder {
  return new ButtonBuilder()
    .setCustomId("show_values")
    .setLabel(language("adminSettingsShowValuesAlreadyShown", lang))
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true);
}

export function logValues(selectionPath: SelectionPath[]) {}

export async function handleButtonClick(
  buttonInteraction: ButtonInteraction,
  message: Message,
  selectionPath: SelectionPath[],
  lang: string,
) {
  await buttonInteraction.deferUpdate();
  logValues(selectionPath);

  const disabledButton = createDisabledButton(lang);
  const disabledButtonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    disabledButton,
  );

  await buttonInteraction.editReply({
    components: [disabledButtonRow],
  });
}

export function buildEmbedDescription(
  selectionPath: SelectionPath[],
  lang: string,
): string {
  let description = "";
  selectionPath.forEach((selection, index) => {
    if (index === 0) {
      description +=
        language("adminSettingsMainMenu", lang) + `**${selection.label}**`;
    } else {
      const subElementPrefix = language("adminSettingsSubElement", lang).repeat(
        index,
      );
      description += `\n${subElementPrefix}**${selection.label}**`;
    }
  });
  return description;
}

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

import {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  Message,
  ButtonInteraction,
  BaseGuildTextChannel,
  PermissionFlagsBits,
  Guild,
  GuildMember,
  GuildChannelResolvable,
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

/**
 * Checks if a channel has the required permissions for the bot
 */
export function hasChannelPermissions(
  channel: BaseGuildTextChannel,
  botMember: GuildMember | null,
): boolean {
  if (!botMember) return false;
  const permissions = botMember.permissionsIn(channel as GuildChannelResolvable);
  return (
    permissions.has(PermissionFlagsBits.SendMessages) &&
    permissions.has(PermissionFlagsBits.ViewChannel)
  );
}

/**
 * Counts channels with good permissions from a list of channel IDs
 */
export function countChannelsWithPermissions(
  guild: Guild,
  channelIds: string[],
): { goodCount: number; totalCount: number } {
  let goodPermissionsCount = 0;
  let totalCount = 0;
  const botMember = guild.members.cache.get(guild.client.user?.id || "");

  channelIds.forEach((channelId: string) => {
    totalCount++;
    const channel = guild.channels.cache.get(channelId);

    if (!channel) {
      return;
    }

    if (
      !channel.isTextBased() ||
      !(channel instanceof BaseGuildTextChannel)
    ) {
      return;
    }

    if (hasChannelPermissions(channel, botMember || null)) {
      goodPermissionsCount++;
    }
  });

  return { goodCount: goodPermissionsCount, totalCount };
}

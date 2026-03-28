import {
  Client,
  StringSelectMenuInteraction,
  ComponentType,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  EmbedBuilder,
} from "discord.js";
import { MenuOption } from "../../utils/menu/types";
import { UserType } from "../../core/types/UserType";
import { ServerType } from "../../core/types/ServerType";
import { regenerateTradeMenu } from "./tradeMenu";
import { getCooldownDisplayText } from "./tradeUtils";
import language from "../../lang/language";
import { newLogger } from "../../middlewares/logger";
import { handlePokemonSelection } from "./tradeSelection";

function truncateText(
  text: string | undefined,
  maxLength: number,
): string | undefined {
  if (!text) return text;
  return text.length > maxLength
    ? text.substring(0, maxLength - 3) + "..."
    : text;
}

function buildChildrenMenus(
  tradeId: string,
  userId: string,
  menuOptions: MenuOption[],
  selectionPath: Array<{ value: string; label: string }>,
  selectedOption: MenuOption,
): ActionRowBuilder<StringSelectMenuBuilder>[] {
  const allMenus: ActionRowBuilder<StringSelectMenuBuilder>[] = [];
  let currentLevelOptions = menuOptions;

  for (let i = 0; i < selectionPath.length; i++) {
    const pathItem = selectionPath[i];
    const menu = new StringSelectMenuBuilder()
      .setCustomId(`tm_${tradeId}_${userId}_${i}`)
      .setPlaceholder(truncateText(pathItem.label, 150) || "")
      .addOptions(
        currentLevelOptions.slice(0, 25).map((opt: MenuOption) => ({
          label: truncateText(opt.label, 100) || "",
          value: truncateText(opt.value, 100) || "",
          description: truncateText(opt.description, 100),
          default: opt.value === pathItem.value,
        })),
      );
    allMenus.push(
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu),
    );
    const foundOption = currentLevelOptions.find(
      (opt) => opt.value === pathItem.value,
    );
    if (foundOption?.children) {
      currentLevelOptions = foundOption.children;
    }
  }

  const childrenOptions = (selectedOption.children ?? [])
    .slice(0, 25)
    .map((child: MenuOption) => ({
      label: truncateText(child.label, 100) || "",
      value: truncateText(child.value, 100) || "",
      description: truncateText(child.description, 100),
    }));

  if (childrenOptions.length === 0) return [];

  const nextMenu = new StringSelectMenuBuilder()
    .setCustomId(`tm_${tradeId}_${userId}_${selectionPath.length}`)
    .setPlaceholder(
      truncateText(selectedOption.placeholder ?? selectedOption.label, 150) ??
        "",
    )
    .addOptions(childrenOptions);
  allMenus.push(
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(nextMenu),
  );
  return allMenus;
}

export async function sendTradeMenuToUser(
  client: Client,
  userId: string,
  tradeId: string,
  user: UserType,
  server: ServerType,
): Promise<void> {
  try {
    const discordUser = await client.users.fetch(userId);
    const dm = await discordUser.createDM();

    const menuHandlers = regenerateTradeMenu(
      user,
      server,
      undefined,
      async (pokemonKey: string) => {
        await handlePokemonSelection(
          tradeId,
          userId,
          pokemonKey,
          server,
          client,
        );
      },
    );

    const menuStructure = Array.from(
      menuHandlers.values(),
    )[0]?.getMenuStructure();
    if (!menuStructure?.children) {
      await dm.send(
        language("tradeNoPokemonAvailable", server.settings.language),
      );
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(language("tradeSelectPokemonTitle", server.settings.language))
      .setDescription(
        language("tradeSelectPokemonDesc", server.settings.language),
      )
      .setColor(0x3498db);

    embed.addFields({
      name: language("tradeCooldownsTitle", server.settings.language),
      value: getCooldownDisplayText(userId, server.settings.language),
    });

    const mainMenu = new StringSelectMenuBuilder()
      .setCustomId(`tm_${tradeId}_${userId}_0`)
      .setPlaceholder(
        language("tradeSelectGeneration", server.settings.language),
      )
      .addOptions(
        menuStructure.children.map((opt: MenuOption) => ({
          label: truncateText(opt.label, 100) || "",
          value: truncateText(opt.value, 100) || "",
          description: truncateText(opt.description, 100),
        })),
      );

    const message = await dm.send({
      embeds: [embed],
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(mainMenu),
      ],
    });

    const selectionPath: Array<{ value: string; label: string }> = [];
    const menuOptions: MenuOption[] = menuStructure.children || [];

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter: (i: StringSelectMenuInteraction) =>
        i.user.id === userId &&
        i.customId.startsWith(`tm_${tradeId}_${userId}_`),
      time: 600000,
    });

    collector.on(
      "collect",
      async (selectInteraction: StringSelectMenuInteraction) => {
        try {
          await selectInteraction.deferUpdate();
          const selectedValue = selectInteraction.values[0];
          const lastUnderscore = selectInteraction.customId.lastIndexOf("_");
          const levelStr = selectInteraction.customId.substring(
            lastUnderscore + 1,
          );
          const menuLevel = Number.parseInt(levelStr, 10);
          const level = Number.isNaN(menuLevel) ? 0 : Math.max(0, menuLevel);

          selectionPath.length = level;

          let currentOptions = menuOptions;
          for (const pathItem of selectionPath) {
            const foundOption = currentOptions.find(
              (opt) => opt.value === pathItem.value,
            );
            if (foundOption?.children) {
              currentOptions = foundOption.children;
            } else {
              break;
            }
          }

          const selectedOption = currentOptions.find(
            (opt) => opt.value === selectedValue,
          );
          if (!selectedOption) return;

          selectionPath.push({
            value: selectedOption.value,
            label: selectedOption.label,
          });

          const hasChildren = (selectedOption.children?.length ?? 0) > 0;
          if (hasChildren) {
            const allMenus = buildChildrenMenus(
              tradeId,
              userId,
              menuOptions,
              selectionPath,
              selectedOption,
            );
            if (allMenus.length > 0) {
              await selectInteraction.editReply({
                embeds: [embed],
                components: allMenus,
              });
            }
          } else {
            await handlePokemonSelection(
              tradeId,
              userId,
              selectedValue,
              server,
              client,
            );
            await message.delete().catch(() => {});
            collector.stop();
          }
        } catch (error) {
          newLogger(
            "error",
            error instanceof Error ? error.message : String(error),
            "Error in menu collector",
          );
        }
      },
    );

    collector.on("end", async () => {
      try {
        await message.edit({ components: [] });
      } catch (editError) {
        newLogger(
          "warn",
          editError instanceof Error ? editError.message : String(editError),
          "Could not clear menu components (message may be deleted)",
        );
      }
    });
  } catch (error) {
    newLogger(
      "error",
      error instanceof Error ? error.message : String(error),
      `Failed to send menu to user ${userId}`,
    );
  }
}

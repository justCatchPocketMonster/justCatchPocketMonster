import {
  StringSelectMenuInteraction,
  ComponentType,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  EmbedBuilder,
} from "discord.js";
import { MenuOption } from "../../utils/menu/types";
import { regenerateTradeMenu } from "./tradeMenu";
import { calculateCooldownRemaining } from "./tradeUtils";
import { formatTimestamp } from "../../utils/helperFunction";
import language from "../../lang/language";
import { newLogger } from "../../middlewares/logger";
import { handlePokemonSelection } from "./tradeSelection";

function truncateText(text: string | undefined, maxLength: number): string | undefined {
  if (!text) return text;
  return text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text;
}

export async function sendTradeMenuToUser(
  client: any,
  userId: string,
  tradeId: string,
  user: any,
  server: any,
): Promise<void> {
  try {
    const discordUser = await client.users.fetch(userId);
    const dm = await discordUser.createDM();

    const menuHandlers = regenerateTradeMenu(user, server, undefined, async (pokemonKey: string) => {
      await handlePokemonSelection(tradeId, userId, pokemonKey, server, client);
    });

    const menuStructure = Array.from(menuHandlers.values())[0]?.getMenuStructure();
    if (!menuStructure?.children) {
      await dm.send(language("tradeNoPokemonAvailable", server.settings.language));
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(language("tradeSelectPokemonTitle", server.settings.language))
      .setDescription(language("tradeSelectPokemonDesc", server.settings.language))
      .setColor(0x3498db);

    const rarities = ["legendary", "fabulous", "ultraBeast"];
    const rarityNames: Record<string, string> = {
      legendary: language("statCategoryLegendary", server.settings.language),
      fabulous: language("statCategoryFabulous", server.settings.language),
      ultraBeast: language("statCategoryUltraBeast", server.settings.language),
    };

    const cooldownFields = rarities
      .map((rarity) => {
        const remaining = calculateCooldownRemaining(userId, rarity);
        if (remaining === null) return null;
        return `${rarityNames[rarity]}: ${formatTimestamp(Date.now() + remaining)}`;
      })
      .filter((field): field is string => field !== null);

    if (cooldownFields.length > 0) {
      embed.addFields({
        name: language("tradeCooldownsTitle", server.settings.language),
        value: cooldownFields.join("\n"),
      });
    }

    const mainMenu = new StringSelectMenuBuilder()
      .setCustomId(`tm_${tradeId}_${userId}_0`)
      .setPlaceholder(language("tradeSelectGeneration", server.settings.language))
      .addOptions(
        menuStructure.children.map((opt: MenuOption) => ({
          label: truncateText(opt.label, 100) || "",
          value: truncateText(opt.value, 100) || "",
          description: truncateText(opt.description, 100),
        })),
      );

    const message = await dm.send({
      embeds: [embed],
      components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(mainMenu)],
    });

    const selectionPath: Array<{ value: string; label: string }> = [];
    const menuOptions: MenuOption[] = menuStructure.children || [];

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter: (i: StringSelectMenuInteraction) =>
        i.user.id === userId && i.customId.startsWith(`tm_${tradeId}_${userId}_`),
      time: 600000,
    });

    collector.on("collect", async (selectInteraction: StringSelectMenuInteraction) => {
      try {
        await selectInteraction.deferUpdate();
        const selectedValue = selectInteraction.values[0];
        let currentOptions = menuOptions;

        for (const pathItem of selectionPath) {
          const foundOption = currentOptions.find((opt) => opt.value === pathItem.value);
          if (foundOption?.children) {
            currentOptions = foundOption.children;
          } else {
            break;
          }
        }

        const selectedOption = currentOptions.find((opt) => opt.value === selectedValue);
        if (!selectedOption) return;

        selectionPath.push({ value: selectedOption.value, label: selectedOption.label });

        if (selectedOption.children && selectedOption.children.length > 0) {
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

            allMenus.push(new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu));

            const foundOption = currentLevelOptions.find((opt) => opt.value === pathItem.value);
            if (foundOption?.children) {
              currentLevelOptions = foundOption.children;
            }
          }

          const childrenOptions = selectedOption.children.slice(0, 25).map((child: MenuOption) => ({
            label: truncateText(child.label, 100) || "",
            value: truncateText(child.value, 100) || "",
            description: truncateText(child.description, 100),
          }));

          if (childrenOptions.length === 0) return;

          const nextMenu = new StringSelectMenuBuilder()
            .setCustomId(`tm_${tradeId}_${userId}_${selectionPath.length}`)
            .setPlaceholder(
              truncateText(selectedOption.placeholder || selectedOption.label, 150) || "",
            )
            .addOptions(childrenOptions);

          allMenus.push(new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(nextMenu));
          await selectInteraction.editReply({ embeds: [embed], components: allMenus });
        } else {
          await handlePokemonSelection(tradeId, userId, selectedValue, server, client);
          await message.delete().catch(() => {});
          collector.stop();
        }
      } catch (error) {
        newLogger("error", error as string, "Error in menu collector");
      }
    });

    collector.on("end", async () => {
      try {
        await message.edit({ components: [] });
      } catch (error) {
        // Message might be deleted
      }
    });
  } catch (error) {
    newLogger("error", error as string, `Failed to send menu to user ${userId}`);
  }
}

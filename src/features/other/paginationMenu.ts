import {
  Interaction,
  StringSelectMenuOptionBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  APISelectMenuOption,
  Message,
  MessageComponentInteraction,
  EmbedBuilder,
  AttachmentBuilder,
  StringSelectMenuInteraction,
  ChatInputCommandInteraction,
  ComponentType,
} from "discord.js";

interface PageData {
  page: EmbedBuilder;
  imagePage?: AttachmentBuilder;
  information: PageInformation;
}
export function createPageForMenu(
  page: EmbedBuilder,
  image: AttachmentBuilder | null = null,
  nameSelection: string,
  descriptionSelection?: string,
): PageData {
  if(descriptionSelection === ""){
    descriptionSelection = undefined;
  }

  const info: PageInformation = {
    nameSelection,
    descriptionSelection,
  };

  if (image !== null) {
    return {
      page,
      imagePage: image,
      information: info,
    };
  } else {
    return {
      page,
      information: info,
    };
  }
}

interface PageInformation {
  nameSelection: string;
  descriptionSelection?: string;
}
export async function paginationMenu(
  interaction: ChatInputCommandInteraction,
  defaultText: string,
  pages: PageData[],
  pageParDefaut: number = 1,
  time: number = 60000,
): Promise<void> {
  if (pages.length === 0) return;
  let currentPage = pageParDefaut - 1;

  const menuOptions: APISelectMenuOption[] = pages.map((p, index) => ({
    label: p.information.nameSelection,
    description: p.information.descriptionSelection ?? undefined,
    value: index.toString(),
  }));
  const menu = new StringSelectMenuBuilder()
    .setCustomId("pagination_menu")
    .setPlaceholder(defaultText)
    .addOptions(menuOptions);

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    menu,
  );

  const replyPayload: Parameters<typeof interaction.reply>[0] = {
    embeds: [pages[currentPage].page],
    components: [row],
    fetchReply: true,
  };

  if (pages[currentPage].imagePage) {
    replyPayload.files = [pages[currentPage].imagePage!];
  }

  const message = await interaction.reply(replyPayload);

  const collector = message.createMessageComponentCollector({
    componentType: ComponentType.StringSelect,
    time,
  });

  collector.on(
    "collect",
    async (selectInteraction: StringSelectMenuInteraction) => {
      if (selectInteraction.user.id !== interaction.user.id) {
        return;
      }

      await selectInteraction.deferUpdate();
      let pageSelection = Number(selectInteraction.values[0]);
      let nbLoop = 0;
      while (!pages[pageSelection].page){
        nbLoop++;
        if (nbLoop >= 1000) {
          await interaction.editReply({
            components: [],
          });
          return
        }
        pageSelection++
        if( pageSelection >= pages.length) {
            pageSelection = 0;
            break;
        }
      }

      currentPage = pageSelection;

      const newPayload: Parameters<typeof selectInteraction.editReply>[0] = {
        embeds: [pages[currentPage].page],
      };

      if (pages[currentPage].imagePage) {
        newPayload.files = [pages[currentPage].imagePage!];
      }

      await selectInteraction.editReply(newPayload);
    },
  );

  collector.on("end", async () => {
    await interaction.editReply({
      components: [],
    });
  });
}

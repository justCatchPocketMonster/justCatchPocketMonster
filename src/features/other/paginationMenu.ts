import {
  StringSelectMenuBuilder,
  ActionRowBuilder,
  APISelectMenuOption,
  EmbedBuilder,
  AttachmentBuilder,
  StringSelectMenuInteraction,
  ChatInputCommandInteraction,
  ComponentType,
} from "discord.js";

export interface PageData {
  page: EmbedBuilder | null;
  imagePage?: AttachmentBuilder;
  information: PageInformation;
}
export function createPageForMenu(
  page: EmbedBuilder | null,
  image: AttachmentBuilder | null,
  nameSelection: string,
  descriptionSelection?: string,
): PageData {
  if (descriptionSelection === "") {
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
const MAX_OPTIONS = 25;
const GROUP_SIZE = 23;

function buildGroupOptions(
  pages: PageData[],
  groupStart: number,
): APISelectMenuOption[] {
  const groupEnd = Math.min(groupStart + GROUP_SIZE, pages.length);
  const hasPrev = groupStart > 0;
  const hasNext = groupEnd < pages.length;

  const options: APISelectMenuOption[] = [];

  if (hasPrev) {
    options.push({ label: "⬆ Pages précédentes", value: "__prev__" });
  }

  for (let i = groupStart; i < groupEnd; i++) {
    const p = pages[i];
    if (
      p.page !== null &&
      p.information.nameSelection.length > 0 &&
      p.information.nameSelection.length <= 100
    ) {
      options.push({
        label: p.information.nameSelection,
        description: p.information.descriptionSelection ?? undefined,
        value: i.toString(),
      });
    }
  }

  if (hasNext) {
    options.push({ label: "⬇ Pages suivantes", value: "__next__" });
  }

  return options;
}

function buildMenuRow(
  pages: PageData[],
  groupStart: number,
  defaultText: string,
): ActionRowBuilder<StringSelectMenuBuilder> {
  const options = buildGroupOptions(pages, groupStart);
  const menu = new StringSelectMenuBuilder()
    .setCustomId("pagination_menu")
    .setPlaceholder(defaultText)
    .addOptions(options);
  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
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
  if (
    currentPage < 0 ||
    currentPage >= pages.length ||
    !pages[currentPage].page
  ) {
    currentPage = pages.findIndex((p) => p.page !== null);
    if (currentPage === -1) return;
  }

  let groupStart =
    pages.length <= MAX_OPTIONS
      ? 0
      : Math.floor(currentPage / GROUP_SIZE) * GROUP_SIZE;

  const currentPageData = pages[currentPage];
  if (!currentPageData.page) return;

  const replyPayload: Parameters<typeof interaction.reply>[0] = {
    embeds: [currentPageData.page],
    components: [buildMenuRow(pages, groupStart, defaultText)],
    fetchReply: true,
  };
  if (currentPageData.imagePage) {
    replyPayload.files = [currentPageData.imagePage];
  }

  const message = await interaction.reply(replyPayload);

  const collector = message.createMessageComponentCollector({
    componentType: ComponentType.StringSelect,
    time,
  });

  collector.on(
    "collect",
    async (selectInteraction: StringSelectMenuInteraction) => {
      if (selectInteraction.user.id !== interaction.user.id) return;

      await selectInteraction.deferUpdate();

      const value = selectInteraction.values[0];

      if (value === "__prev__") {
        groupStart = Math.max(0, groupStart - GROUP_SIZE);
        const firstInGroup = pages
          .slice(groupStart, groupStart + GROUP_SIZE)
          .findIndex((p) => p.page !== null);
        if (firstInGroup >= 0) currentPage = groupStart + firstInGroup;
      } else if (value === "__next__") {
        const nextStart = Math.min(groupStart + GROUP_SIZE, pages.length - 1);
        groupStart = nextStart;
        const firstInGroup = pages
          .slice(groupStart, groupStart + GROUP_SIZE)
          .findIndex((p) => p.page !== null);
        if (firstInGroup >= 0) currentPage = groupStart + firstInGroup;
      } else {
        let pageSelection = Number(value);
        let nbLoop = 0;
        while (!pages[pageSelection]?.page) {
          if (++nbLoop >= 1000) {
            await interaction.editReply({ components: [] });
            return;
          }
          pageSelection = (pageSelection + 1) % pages.length;
        }
        currentPage = pageSelection;
        groupStart = Math.floor(currentPage / GROUP_SIZE) * GROUP_SIZE;
      }

      const pageData = pages[currentPage];
      if (!pageData?.page) return;

      const newPayload: Parameters<typeof selectInteraction.editReply>[0] = {
        embeds: [pageData.page],
        components: [buildMenuRow(pages, groupStart, defaultText)],
      };
      if (pageData.imagePage) {
        newPayload.files = [pageData.imagePage];
      }

      await selectInteraction.editReply(newPayload);
    },
  );

  collector.on("end", async () => {
    await interaction.editReply({ components: [] });
  });
}

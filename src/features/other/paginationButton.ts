import {
  ActionRowBuilder, AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
} from "discord.js";

export interface pageType {
  page: EmbedBuilder;
  imagePage?: AttachmentBuilder;
}

export const paginationButton = async (
  interactionSlash: ChatInputCommandInteraction,
  pages: pageType[],
  pageParDefaut: number = 1,
  time: number = 60000,
) => {
  if (pages.length === 0) return;
  let currentPage = pageParDefaut - 1;

  const backButton = new ButtonBuilder()
      .setCustomId("previous")
      .setLabel("<")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(pages.length === 1)

  const stopButton =                 new ButtonBuilder()
      .setCustomId("stop")
      .setLabel("X")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(pages.length === 1)

  const nextButton = new ButtonBuilder()
      .setCustomId("next")
      .setLabel(">")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(pages.length === 1)

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    backButton,
    stopButton,
    nextButton,
  );

  const image = pages[currentPage].imagePage;
  console.log("bjr")
  const message = await interactionSlash.reply({
    embeds: [pages[currentPage].page],
    components: [row],
    fetchReply: true,
    files : image ? [image] : [],
  });
  const collector = message.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time,
  });

  collector.on("collect", async (interaction) => {
    if (interaction.user.id !== interactionSlash.user.id) {
      return;
    }

    await interaction.deferUpdate();

    if (interaction.customId === "previous") {
      currentPage = currentPage > 0 ? currentPage - 1 : pages.length - 1;
    } else if (interaction.customId === "next") {
      currentPage = currentPage < pages.length - 1 ? currentPage + 1 : 0;
    } else if (interaction.customId === "stop") {
      return collector.stop();
    }

    const image = pages[currentPage].imagePage;
    await interaction.editReply({
      embeds: [pages[currentPage].page],
      components: [row],
      files : image ? [image] : [],
    });
  });

  collector.on("end", async () => {
    await interactionSlash.editReply({ components: [] });
  });
};

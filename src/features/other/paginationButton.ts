import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    EmbedBuilder
} from "discord.js";

export interface pageType {
    page: EmbedBuilder;
    imagePage?: string;
}

export const paginationButton = async (
    interactionSlash: ChatInputCommandInteraction,
    pages: pageType[],
    pageParDefaut: number = 1,
    time: number = 60000
) => {
    if (pages.length === 0) return;
    let currentPage = pageParDefaut - 1;

    const backButton = new ButtonBuilder()
        .setCustomId("previous")
        .setLabel("◀️")
        .setStyle(ButtonStyle.Primary);

    const nextButton = new ButtonBuilder()
        .setCustomId("next")
        .setLabel("▶️")
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(backButton, nextButton);

    const message = await interactionSlash.reply({
        embeds: [pages[currentPage].page],
        components: [row],
        fetchReply: true
    });

    const collector = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time
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
        }

        await interaction.editReply({
            embeds: [pages[currentPage].page]
        });
    });

    collector.on("end", async () => {
        await interactionSlash.editReply({ components: [] });
    });
};

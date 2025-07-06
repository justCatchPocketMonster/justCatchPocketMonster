import {
    Interaction,
    StringSelectMenuOptionBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    APISelectMenuOption,
    Message,
    MessageComponentInteraction,
    EmbedBuilder,
    AttachmentBuilder, StringSelectMenuInteraction
} from 'discord.js';

interface PageInformation {
    nameSelection: string;
    descriptionSelection?: string;
}

interface PageData {
    page: EmbedBuilder;
    imagePage?: AttachmentBuilder;
    information: PageInformation;
}
export function createPageForMenu(
    page: EmbedBuilder,
    image: AttachmentBuilder | null = null,
    nameSelection: string,
    descriptionSelection?: string
): PageData {
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

export async function paginationMenu(
    interaction: Interaction,
    defaultText: string,
    pages: PageData[],
    pageParDefaut: number = 1,
    time: number = 60000
): Promise<void> {
    try {
        const components: StringSelectMenuOptionBuilder[] = [];
        let count = 0;

        for (const element of pages) {
            const selectMenuCreation = new StringSelectMenuOptionBuilder()
                .setLabel(element.information.nameSelection)
                .setValue(count.toString());

            if (element.information.descriptionSelection) {
                selectMenuCreation.setDescription(element.information.descriptionSelection);
            }

            components.push(selectMenuCreation);
            count++;
        }

        const menuSelect = new StringSelectMenuBuilder()
            .setCustomId('menu')
            .setPlaceholder(defaultText)
            .addOptions(components.map((e) => e as unknown as APISelectMenuOption)); // cast pour compenser le typage parfois strict

        const menu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menuSelect);

        const data: any = {
            fetchReply: true,
            components: [menu],
            embeds: [pages[pageParDefaut - 1].page]
        };

        if (pages[pageParDefaut - 1].imagePage) {
            data.files = [pages[pageParDefaut - 1].imagePage];
        }

        const msg = await (interaction.channel as any).send(data) as Message;

        const col = msg.createMessageComponentCollector({
            filter: (i: MessageComponentInteraction) => i.user.id === (interaction as any).user.id,
            time
        });

        col.on('collect', async (i) => {
            let selectedOption = parseInt((i as StringSelectMenuInteraction).values[0]);

            while (!pages[selectedOption]?.page) {
                selectedOption++;
            }

            menu.components[0].setPlaceholder(pages[selectedOption].information.nameSelection);

            const updateData: any = {
                embeds: [pages[selectedOption].page],
                components: [menu]
            };

            if (pages[selectedOption].imagePage) {
                updateData.files = [pages[selectedOption].imagePage];
            }

            await i.update(updateData);
            col.resetTimer({ time });
        });

        col.on('end', async () => {
            await msg.edit({ components: [] });
        });

    } catch (error) {
        console.error(error);
    }
}

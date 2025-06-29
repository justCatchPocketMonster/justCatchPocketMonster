import {
    ActionRowBuilder, APIInteractionGuildMember, ButtonInteraction, ChatInputCommandInteraction, Embed, GuildMember,
    Message, MessageCreateOptions, StringSelectMenuBuilder, StringSelectMenuInteraction,
    StringSelectMenuOptionBuilder
} from "discord.js";
import fs from "fs";
import UserClass from "../../core/types/UserType";
import {getUser, updateUser} from "../../cache/UserCache";

interface MenuPage {
    page: Embed;
    imagePage?: string;
    nameSelection: string;
    descriptionSelection: string;
}

async function paginationMenu(interactionSlash: ChatInputCommandInteraction, defaultText: string, pages: MenuPage[], pageParDefaut: number = 1, time: number = 60000) {
    try {
        const interaction = validateInteraction(interactionSlash, defaultText, pages, pageParDefaut, time);

        const idUser: string = (interactionSlash.member as GuildMember | APIInteractionGuildMember).user.id;
        const user: UserClass = await getUser(idUser);

        const menuOptions = createMenuOptions(pages);
        const menu = createSelectMenu(defaultText, menuOptions);

        let msg: Message | undefined;
        msg = await interaction.channel?.send(getMessageData(pages, pageParDefaut - 1, menu));
        if (!msg) return;

        user.countPagination++;
        updateUser(user.id, user);

        const col = msg.createMessageComponentCollector({
            filter: (i) => i.user.id === interaction.user.id,
            time: time
        });

        col.on('collect', async (i: StringSelectMenuInteraction) => {
            let selectedOption = Number(i.values[0]);
            if (isNaN(selectedOption)) return;

            (menu.components[0] as StringSelectMenuBuilder).setPlaceholder(pages[selectedOption].nameSelection);

            // @ts-ignore
            await i.update(getMessageData(pages, selectedOption, menu));
            col.resetTimer({ time: time });
        });

        col.on('end', async () => {
            await msg.edit({ components: [] });
            user.countPagination--;
            updateUser(user.id, user);
        });

    } catch (error) {
        console.error(error);
    }
}

function validateInteraction(interactionSlash: ChatInputCommandInteraction, defaultText: string, pages: MenuPage[], pageParDefaut: number, time: number): ButtonInteraction {
    if (pageParDefaut < 1 || pageParDefaut > pages.length) pageParDefaut = 1;
    if (!interactionSlash.channel) throw new Error("Invalid channel");
    if (!pages.length || time <= 10000) throw new Error("Invalid parameters");
    if (!defaultText) throw new Error("Invalid default text");

    return interactionSlash as unknown as ButtonInteraction;
}

function createMenuOptions(pages: MenuPage[]): StringSelectMenuOptionBuilder[] {
    return pages.map((element, index) => {
        const option = new StringSelectMenuOptionBuilder()
            .setLabel(element.nameSelection)
            .setValue(index.toString());

        if (element.descriptionSelection) {
            option.setDescription(element.descriptionSelection);
        }

        return option;
    });
}

function createSelectMenu(defaultText: string, options: StringSelectMenuOptionBuilder[]): ActionRowBuilder<StringSelectMenuBuilder> {
    const menuSelect = new StringSelectMenuBuilder()
        .setCustomId('menu')
        .setPlaceholder(defaultText)
        .addOptions(options.map((e) => e.toJSON()));

    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menuSelect);
}

function getMessageData(pages: MenuPage[], index: number, menu: ActionRowBuilder<StringSelectMenuBuilder>): MessageCreateOptions {
    const data: MessageCreateOptions = {
        embeds: [pages[index].page],
        components: [menu]
    };

    if (pages[index].imagePage) {
        const imageBuffer = fs.readFileSync(pages[index].imagePage);
        data.files = [imageBuffer];
    }

    return data;
}

export default paginationMenu;
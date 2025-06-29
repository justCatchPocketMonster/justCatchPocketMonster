import {
    ActionRowBuilder,
    APIInteractionGuildMember,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    CacheType,
    ChatInputCommandInteraction,
    Collection,
    CollectorFilter,
    Embed,
    GuildMember,
    InteractionCollector,
    InteractionUpdateOptions,
    MappedInteractionTypes,
    Message,
    MessageComponentType,
    MessageCreateOptions
} from "discord.js";
import {getUser, updateUser} from "../../cache/UserCache";
const fs = require('fs');
import {exceptions} from "winston";
import UserClass from "../../core/types/UserType";

interface pageType {
    page: Embed,
    imagePage?: String
}

const paginationButton = async (interactionSlash: ChatInputCommandInteraction, pages: pageType[], pageParDefaut:number = 1, time:number = 60000) => {
    try {

        const idUser: string = (interactionSlash.member as GuildMember | APIInteractionGuildMember).user.id;
        const user: UserClass = await getUser(idUser);

        if (user.countPagination >= 10) {
            interactionSlash.channel?.send("Trop de page");
            return;
        }

        const interaction = validateInteraction(interactionSlash, pages, pageParDefaut, time);

        if (!interaction) return;

        let index = pageParDefaut-1
        const row = createActionRow();

        await sendInitialPage(interactionSlash, pages, index, user, row, time);

    } catch(error) {

        console.error(error)
    }
}

const sendInitialPage = async (
    interactionSlash: ChatInputCommandInteraction,
    pages: pageType[],
    index: number,
    user: UserClass,
    row: ActionRowBuilder<ButtonBuilder>,
    time: number
) => {
    await interactionSlash.channel?.send(getData(pages, index))
        .then(messageSendBot => {
            user.countPagination++;
            updateUser(user.id, user);
            const col = createCollector(messageSendBot, interactionSlash, pages, row, time);

            col.on('collect', (i: ButtonInteraction) => {
                // @ts-ignore
                handleButtonPress(i, pages, index, row, col, time);

            });

            col.on('end', (collected) => {
                endCollector(collected);
                user.countPagination--;
                updateUser(user.id, user);
            });
        });
};


const handleButtonPress = (
    i: ButtonInteraction,
    pages: pageType[],
    index: number,
    row: ActionRowBuilder<ButtonBuilder>,
    col: InteractionCollector<ButtonInteraction>,
    time: number
) => {
    if (i.customId === "1") {
        index = (index - 1 + pages.length) % pages.length;
    } else if (i.customId === "2") {
        index = (index + 1) % pages.length;
    } else {
        return col.stop();
    }

    i.update(getData(pages, index) as InteractionUpdateOptions);
    col.resetTimer({ time });
};

// @ts-ignore
const endCollector = (collected: Collection<MappedInteractionTypes<boolean>[MessageComponentType]>) => {
    collected.first()?.message.edit({
        components: []
    });
};
const validateInteraction = (
    interactionSlash: ChatInputCommandInteraction,
    pages: pageType[],
    pageParDefaut: number,
    time: number
): ButtonInteraction | null => {
    if (pageParDefaut < 1 || pageParDefaut > pages.length) pageParDefaut = 1;
    if (interactionSlash.channel === null) throw new Error("Invalid channel");
    if (!pages.length || time <= 10000) throw new Error("Invalid parameters");

    return interactionSlash as unknown as ButtonInteraction;
};

const createCollector = (
    messageSendBot: Message,
    interactionSlash: ChatInputCommandInteraction,
    pages: pageType[],
    row: ActionRowBuilder<ButtonBuilder>,
    time: number
) => {
    const filter: CollectorFilter<[ButtonInteraction]> = (interaction) => {
        return interaction.user.id === interactionSlash.user.id;
    };

    return messageSendBot.createMessageComponentCollector({
        // @ts-ignore
        filter,
        time
    });
};

const createActionRow = (): ActionRowBuilder<ButtonBuilder> => {
    const row = new ActionRowBuilder<ButtonBuilder>();
    row.addComponents(getButton());
    return row;
};

function getButton(pages: pageType[] = []) : ButtonBuilder[] {
    let arrayButton: ButtonBuilder[] = [];
    arrayButton.push(
        new ButtonBuilder()
            .setCustomId("1")
            .setLabel("<")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(pages.length<=1),
        new ButtonBuilder()
            .setCustomId("3")
            .setLabel("X")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(false),
        new ButtonBuilder()
            .setCustomId("2")
            .setLabel(">")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(pages.length<=1)
    )

    return arrayButton;
}

const getData = (pages: pageType[], index:number) : MessageCreateOptions => {
    let data:MessageCreateOptions;

    if(pages[index].imagePage !== undefined){
        const imageBuffer = fs.readFileSync(pages[index].imagePage);
        data = {
            embeds: [pages[index].page],
            files: [imageBuffer]
        };
    } else {
        data = {
            embeds: [pages[index].page]
        };
    }
    return data;
}

export default paginationButton;
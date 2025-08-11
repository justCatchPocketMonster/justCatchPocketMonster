import {
    ChatInputCommandInteraction,
    Client,
    CommandInteractionOptionResolver,
    Guild,
    GuildMember,
    Message,
    User,
} from "discord.js";

export function createMockInteraction(): ChatInputCommandInteraction {
    const mockMessage = {
        createMessageComponentCollector: jest.fn().mockReturnValue({
            on: jest.fn().mockReturnThis(),
            stop: jest.fn(),
        }),
    } as unknown as Message;

    const mock = {
        client: {} as Client,
        user: {
            username: "TestUser",
            id: "123456",
            avatarURL: jest.fn().mockReturnValue("https://cdn.discordapp.com/embed/avatars/0.png"),
        } as unknown as User,
        guild: { name: "TestGuild", id: "654321" } as Guild,
        channel: {
            id: "1234567890",
        },
        member: {} as GuildMember,
        guildId: "654321",
        options: {
            getString: jest.fn(),
            getNumber: jest.fn(),
            getChannel: jest.fn(),
            getBoolean: jest.fn(),
            getUser: jest.fn(),
            getSubcommand: jest.fn(),
        } as unknown as CommandInteractionOptionResolver,
        isChatInputCommand: () => true,
        reply: jest.fn().mockResolvedValue(mockMessage), // fetchReply:true => retourne un Message
        deferReply: jest.fn().mockResolvedValue(undefined),
        editReply: jest.fn().mockResolvedValue(undefined),
        followUp: jest.fn().mockResolvedValue(undefined),
    };

    return mock as unknown as ChatInputCommandInteraction;
}

// src/__tests__/utils/test-utils.ts
import { ChatInputCommandInteraction, Client, CommandInteractionOptionResolver, Guild, GuildMember, User } from 'discord.js';
import { mockDeep, mockReset } from 'jest-mock-extended';

export function createMockClient() {
    return new Client({ intents: [] });
}

export function createMockInteraction(): ChatInputCommandInteraction {

    const mock = {
        client: {} as Client,
        user: {
            username: 'TestUser',
            id: '123456',
            avatarURL: jest.fn().mockReturnValue('https://cdn.discordapp.com/embed/avatars/0.png'),
        } as unknown as User,
        guild: { name: 'TestGuild', id: '654321' } as Guild,
        member: {} as GuildMember,
        guildId: '654321',
        options: {
            getString: jest.fn(),
            getNumber: jest.fn(),
            getChannel: jest.fn(),
            getUser: jest.fn(),
            getSubcommand: jest.fn(),
        } as unknown as CommandInteractionOptionResolver,
        isChatInputCommand: () => true,
        reply: jest.fn().mockResolvedValue(undefined),
        deferReply: jest.fn().mockResolvedValue(undefined),
        editReply: jest.fn().mockResolvedValue(undefined),
        followUp: jest.fn().mockResolvedValue(undefined),
    };

    return mock as unknown as ChatInputCommandInteraction;
}

export function createMockGuild() {
    // Créer un faux serveur pour les tests
}
import {
    Guild,
    GuildMember,
    Message,
} from "discord.js";

export function createMockMessage(): Message {
    const mockMessage = {
        createMessageComponentCollector: jest.fn().mockReturnValue({
            on: jest.fn().mockReturnThis(),
            stop: jest.fn(),
        }),
        guild: { name: "TestGuild", id: "654321" } as Guild,
        guildId: "654321",
        channel: {
            id: "1234567890",
        },
        channelId: "1234567890",
        member: {
            displayName: "Test Member",
            nickname: "TestNick",
        } as GuildMember,
    }
    return mockMessage as unknown as Message;
}

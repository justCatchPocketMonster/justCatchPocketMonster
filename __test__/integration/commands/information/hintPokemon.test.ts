import mongoose from "mongoose";
import hintPokemon from "../../../../src/commands/information/hintPokemon";
import {createMockInteraction} from "../../../utils/mock/mockInteraction";
import {getServerById, updateServer} from "../../../../src/cache/ServerCache";
import {Pokemon} from "../../../../src/core/classes/Pokemon";

describe('hint command', () => {
    let interaction: any;
    beforeEach(async () => {
        const collections = mongoose.connection.collections;
        for (const name of Object.keys(collections)) {
            await collections[name].deleteMany({});
        }
        interaction = createMockInteraction();
        (interaction.options.getSubcommand as jest.Mock).mockReturnValue('hint');
    });

    afterAll(async () => {
    });

    test('Should reply a message because it\'s a success', async () => {
        // given
        const server = await getServerById(interaction.guildId);
        server.pokemonPresent[interaction.channel.id] = new Pokemon(
            "399",
            {
                "nameEng": ["Bidoof"],
                "nameFr": ["Keunotor"]
            },
        ["normal"],
            "ordinary",
            "0399-000",
            4,
            "ordinary",
            1,
            false,
            ""
        )
        await updateServer(server.discordId, server);
        // when
        await hintPokemon.execute(interaction);

        // then
        const replyMock = interaction.reply as jest.Mock;

        expect(replyMock).toHaveBeenCalledTimes(1);
    });
});
import {createMockInteraction} from "../../../utils/mock/mockInteraction";
import mongoose from "mongoose";
import pokedex from "../../../../src/commands/save/pokedex";

describe('Pokedex command', () => {
    let interaction: any;
    beforeEach(async () => {
        const collections = mongoose.connection.collections;
        for (const name of Object.keys(collections)) {
            await collections[name].deleteMany({});
        }
        interaction = createMockInteraction();
        (interaction.options.getSubcommand as jest.Mock).mockReturnValue('pokedex');
    });

    afterAll(async () => {
    });

    test('Should reply a message because it\'s a success', async () => {
        // given

        // when
        await pokedex.execute(interaction);

        // then
        const replyMock = interaction.reply as jest.Mock;

        expect(replyMock).toHaveBeenCalledTimes(1);
    });
});
import mongoose from "mongoose";
import {createMockInteraction} from "../../../utils/mock/mockInteraction";
import catchPokemon from "../../../../src/commands/user/catchPokemon";

describe('code command', () => {
    let interaction: any;
    beforeEach(async () => {
        const collections = mongoose.connection.collections;
        for (const name of Object.keys(collections)) {
            await collections[name].deleteMany({});
        }

        interaction = createMockInteraction();
        (interaction.options.getSubcommand as jest.Mock).mockReturnValue('code');
    });

    afterAll(async () => {
    });

    test('Should reply a message because it\'s a success', async () => {
        // given


        // when
        await catchPokemon.execute(interaction);

        // then
        const replyMock = interaction.reply as jest.Mock;

        expect(replyMock).toHaveBeenCalledTimes(1);
    });
});
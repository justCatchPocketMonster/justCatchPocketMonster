// src/__tests__/integration/commands/save.test.ts
import {createMockInteraction} from "../../../utils/test-utils";
import mongoose from "mongoose";
import hintPokemon from "../../../../src/commands/information/hintPokemon";

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
        // TODO: fix we dont have pokemon yet
        // when
        await hintPokemon.execute(interaction);

        // then
        const replyMock = interaction.reply as jest.Mock;

        expect(replyMock).toHaveBeenCalledTimes(1);
    });
});
// src/__tests__/integration/commands/save.test.ts
import {createMockInteraction} from "../../../utils/test-utils";
import mongoose from "mongoose";
import hintPokemon from "../../../../src/commands/information/hintPokemon";
import information from "../../../../src/commands/information/information";
import stat from "../../../../src/commands/information/stat";
import tutorial from "../../../../src/commands/information/tutorial";
import effect from "../../../../src/commands/server/effect";

describe('effect command', () => {
    let interaction: any;
    beforeEach(async () => {
        const collections = mongoose.connection.collections;
        for (const name of Object.keys(collections)) {
            await collections[name].deleteMany({});
        }

        interaction = createMockInteraction();
        (interaction.options.getSubcommand as jest.Mock).mockReturnValue('language');
    });

    afterAll(async () => {
    });

    test('Should reply a message because it\'s a success', async () => {
        // given


        // when
        await effect.execute(interaction);

        // then
        const replyMock = interaction.reply as jest.Mock;

        expect(replyMock).toHaveBeenCalledTimes(1);
    });
});
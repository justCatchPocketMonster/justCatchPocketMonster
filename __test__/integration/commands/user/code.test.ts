// src/__tests__/integration/commands/save.test.ts
import {createMockInteraction} from "../../../utils/test-utils";
import mongoose from "mongoose";
import hintPokemon from "../../../../src/commands/information/hintPokemon";
import information from "../../../../src/commands/information/information";
import stat from "../../../../src/commands/information/stat";
import tutorial from "../../../../src/commands/information/tutorial";
import effect from "../../../../src/commands/server/effect";
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
// src/__tests__/integration/commands/save.test.ts
import { Client } from 'discord.js';
import {createMockInteraction} from "../../../utils/test-utils";
import howMuchThisPokemon from "../../../../src/commands/save/howMuchThisPokemon";
import mongoose from "mongoose";
import language from "../../../../src/lang/language";
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
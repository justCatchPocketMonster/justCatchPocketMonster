import {createMockInteraction} from "../../../utils/mock/mockInteraction";
import howMuchThisPokemon from "../../../../src/commands/save/howMuchThisPokemon";
import mongoose from "mongoose";
import language from "../../../../src/lang/language";

describe('how much command', () => {

    let interaction: any;
    beforeEach(async () => {
        const collections = mongoose.connection.collections;
        for (const name of Object.keys(collections)) {
            await collections[name].deleteMany({});
        }

        interaction = createMockInteraction();
        (interaction.options.getSubcommand as jest.Mock).mockReturnValue('how-much');
    });

    afterAll(async () => {
    });

    test('Should reply a message because it\'s a success', async () => {
        // given
        (interaction.options.getString as jest.Mock).mockImplementation((name: string) => {
            if (name === language("commandHowOptionNameStringPokemonName", "eng")) return 'pikachu';
            if (name === language("commandHowOptionNameStringNumber", "eng")) return '25';
            return null;
        });

        // when
        await howMuchThisPokemon.execute(interaction);

        // then
        const replyMock = interaction.reply as jest.Mock;

        expect(replyMock).toHaveBeenCalledTimes(1);
    });
});
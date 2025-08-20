import mongoose from "mongoose";
import {createMockInteraction} from "../../../utils/mock/mockInteraction";
import information from "../../../../src/commands/information/information";
import {getCode} from "../../../../src/features/code/code";
import {getUserById, updateUser} from "../../../../src/cache/UserCache";

describe('information command', () => {
    let interaction: any;
    beforeEach(async () => {
        const collections = mongoose.connection.collections;
        for (const name of Object.keys(collections)) {
            await collections[name].deleteMany({});
        }
        interaction = createMockInteraction();
        (interaction.options.getSubcommand as jest.Mock).mockReturnValue('information');
    });

    afterAll(async () => {
    });

    test('Should reply a message because it\'s a success', async () => {
        // given
        getCode().shiny.push("testForShiny");
        getCode().shiny.push("testForShiny2");
        const userGiven = await getUserById(interaction.user.id);
        userGiven.enteredCode.push("testForShiny");
        await updateUser(userGiven.discordId, userGiven);

        // when
        await information.execute(interaction);

        // then
        const replyMock = interaction.reply as jest.Mock;

        expect(replyMock).toHaveBeenCalledTimes(1);
    });
});
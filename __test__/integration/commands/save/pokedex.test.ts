import {createMockInteraction} from "../../../utils/mock/mockInteraction";
import mongoose from "mongoose";
import pokedex from "../../../../src/commands/save/pokedex";
import language from "../../../../src/lang/language";
import {getUserById, updateUser} from "../../../../src/cache/UserCache";
import {Pokemon} from "../../../../src/core/classes/Pokemon";
import {initHint} from "../../../../src/features/hint/initHint";
import {resetTestEnv} from "../../../utils/resetTestEnv";

describe('Pokedex command', () => {
    let interaction: any;
    beforeEach(async () => {
        await resetTestEnv();
        interaction = createMockInteraction();
        (interaction.options.getSubcommand as jest.Mock).mockReturnValue('pokedex');
    });

    afterAll(async () => {
    });

    test('Success send Pokedex', async () => {
        // given
        const userGiven = await getUserById(interaction.user.id);
        userGiven.savePokemon.addOneCatch(defaultPokemonNoShiny())
        userGiven.savePokemon.addOneCatch(defaultPokemonShiny());
        await updateUser(userGiven.discordId, userGiven);
        // when
        await pokedex.execute(interaction);

        // then
        const replyMock = interaction.reply as jest.Mock;

        expect(replyMock).toHaveBeenCalledTimes(1);
    });

    test('Success but with value is too much high', async () => {
        // given
        (interaction.options.getNumber as jest.Mock).mockImplementation((name: string) => {
            if (name === language("pokedexNameOptionStringPage", "eng")) return 2458794;
            return null;
        });
        // when
        await pokedex.execute(interaction);

        // then
        const replyMock = interaction.reply as jest.Mock;

        expect(replyMock).toHaveBeenCalledTimes(2);
        expect(replyMock.mock.calls[0][0]).toEqual(language("valeurTropHaute", "eng"));
    });
});

function defaultPokemonNoShiny(): Pokemon {
    return new Pokemon(
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
        initHint("Bidoof")
    );
}

function defaultPokemonShiny(): Pokemon {
    return new Pokemon(
        "400",
        {
            "nameEng": ["Bibarel"],
            "nameFr": ["Castorno"]
        },
        ["normal", "water"],
        "ordinary",
        "0400-000",
        4,
        "ordinary",
        1,
        true,
        initHint("Castorno")
    );
}
// src/__tests__/integration/commands/save.test.ts
import { Client } from 'discord.js';
import {createMockInteraction} from "../../../utils/test-utils";
import howMuchThisPokemon from "../../../../src/commands/save/howMuchThisPokemon";

describe('how much Command Integration', () => {

    beforeAll(async () => {
    });

    afterAll(async () => {
    });

    test('Should return a defined result when executed with a valid interaction ', async () => {
        // when
        const interaction = createMockInteraction();

        // when
        const result = await howMuchThisPokemon.execute(interaction);

        // then
        expect(result).toBeDefined();
    });
});
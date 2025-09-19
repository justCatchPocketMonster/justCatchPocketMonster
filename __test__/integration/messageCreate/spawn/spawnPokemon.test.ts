import { resetTestEnv } from "../../../utils/resetTestEnv";
import { getServerById, updateServer } from "../../../../src/cache/ServerCache";
import { Message } from "discord.js";
import { createMockMessage } from "../../../utils/mock/mockMessage";
import { spawn } from "../../../../src/features/spawn/spawn";
import {
  valuePerGen,
  valuePerType,
  valuePerRarity,
} from "../../../../src/config/default/spawn";
import { __deps } from "../../../../src/features/pokemon/selectPokemon";
import { pokemonDb } from "../../../../src/core/types/pokemonDb";
import allPokemon from "../../../../src/data/pokemon.json";

const mockGenerationSelect = jest.fn();
const mockRaritySelect = jest.fn();
const mockTypeSelect = jest.fn();

describe("Spawn Pokemon", () => {
  let message: Message;
  beforeEach(async () => {
    await resetTestEnv();
    message = createMockMessage();

    const serverBeforeAll = await getServerById(message.guildId!);
    serverBeforeAll.countMessage = 19;
    serverBeforeAll.maxCountMessage = 20;
    serverBeforeAll.channelAllowed.push(message.channelId);
    await updateServer(serverBeforeAll.discordId, serverBeforeAll);

    __deps.generationSelect = mockGenerationSelect;
    __deps.raritySelect = mockRaritySelect;
    __deps.typeSelect = mockTypeSelect;
  });
  afterEach(() => {
    jest.clearAllMocks();
    // on “remet” les vraies fonctions pour les autres tests
    // (si tu veux être carré)
    const { generationSelect, raritySelect, typeSelect } = jest.requireActual(
      "../../../../src/features/pokemon/selectPokemon",
    );
    __deps.generationSelect = generationSelect;
    __deps.raritySelect = raritySelect;
    __deps.typeSelect = typeSelect;
  });
  const generationPossibility = Object.keys(valuePerGen).map((key) => {
    return key;
  });
  describe.each(generationPossibility)(`%s`, (generation) => {
    const typePossibility = Object.keys(valuePerType).map((key) => {
      return key;
    });
    describe.each(typePossibility)(`%s`, (type) => {
      const rarityPossibility = Object.keys(valuePerRarity).map((key) => {
        return key;
      });
      test.each(rarityPossibility)(`%s`, async (rarity) => {
        // given
        mockGenerationSelect.mockReturnValue(generation);
        mockRaritySelect.mockReturnValue(rarity);
        mockTypeSelect.mockReturnValue(type);
        jest
          .spyOn(Math, "random")
          .mockImplementationOnce(() => 0.9)
          .mockImplementationOnce(() => 0.9);

        const pokemonWithSameData: pokemonDb[] = allPokemon.filter(
          (p) =>
            p.gen.toString() === generation &&
            p.arrayType.includes(type) &&
            p.rarity === rarity,
        );

        if (pokemonWithSameData.length === 0) {
          return;
        }
        // when
        const data = await spawn(message.guildId!, message.channelId);
        // then
        // TODO: jsp pourquoi des fois undefined
        expect(data?.embed.data.title).toBe("Wild Pokémon appeared!");
        expect(data?.embed.data.description).toBe(
          'To catch it, do "/catch [Pokémon\'s name]".',
        );

        const serverThen = await getServerById(message.guildId!);
        expect(
          serverThen.pokemonPresent[message.channelId].gen.toString(),
        ).toBe(generation);
        expect(serverThen.pokemonPresent[message.channelId].rarity).toBe(
          rarity,
        );
        expect(
          serverThen.pokemonPresent[message.channelId].arrayType,
        ).toContain(type);
      });
    });
  });
});

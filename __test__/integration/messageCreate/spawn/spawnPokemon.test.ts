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
import * as helperFunction from "../../../../src/utils/helperFunction";

const mockGenerationSelect = jest.fn();
const mockRaritySelect = jest.fn();
const mockTypeSelect = jest.fn();

function getValidCombinations() {
  const generations = Object.keys(valuePerGen);
  const types = Object.keys(valuePerType);
  const rarities = Object.keys(valuePerRarity);

  const validCombinations: Array<[string, string, string]> = [];

  for (const generation of generations) {
    for (const type of types) {
      for (const rarity of rarities) {
        const pokemonExists = allPokemon.some(
          (p) =>
            p.gen.toString() === generation &&
            p.arrayType.includes(type) &&
            p.rarity === rarity,
        );
        if (pokemonExists) {
          validCombinations.push([generation, type, rarity]);
        }
      }
    }
  }

  return validCombinations;
}

function sampleCombinations(
  combinations: Array<[string, string, string]>,
  sampleSize: number,
): Array<[string, string, string]> {
  if (combinations.length <= sampleSize) {
    return combinations;
  }

  const sampled: Array<[string, string, string]> = [];
  const step = Math.floor(combinations.length / sampleSize);

  for (let i = 0; i < combinations.length; i += step) {
    sampled.push(combinations[i]);
    if (sampled.length >= sampleSize) break;
  }

  return sampled;
}

describe("Spawn Pokemon", () => {
  let message: Message;

  beforeAll(async () => {
    await resetTestEnv();
  });

  beforeEach(async () => {
    message = createMockMessage();

    const server = await getServerById(message.guildId!);
    server.countMessage = 19;
    server.maxCountMessage = 20;
    server.channelAllowed = [message.channelId];
    await updateServer(server.discordId, server);

    __deps.generationSelect = mockGenerationSelect;
    __deps.raritySelect = mockRaritySelect;
    __deps.typeSelect = mockTypeSelect;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    const { generationSelect, raritySelect, typeSelect } = jest.requireActual(
      "../../../../src/features/pokemon/selectPokemon",
    );
    __deps.generationSelect = generationSelect;
    __deps.raritySelect = raritySelect;
    __deps.typeSelect = typeSelect;
  });

  const validCombinations = getValidCombinations();
  const sampledCombinations = sampleCombinations(validCombinations, 50);

  test.each(sampledCombinations)(
    `generation %s, type %s, rarity %s`,
    async (generation, type, rarity) => {
      const server = await getServerById(message.guildId!);
      server.countMessage = 19;
      server.maxCountMessage = 20;
      server.channelAllowed = [message.channelId];
      await updateServer(server.discordId, server);

      mockGenerationSelect.mockReturnValue(generation);
      mockRaritySelect.mockReturnValue(rarity);
      mockTypeSelect.mockReturnValue(type);
      const randomSpy = jest.spyOn(helperFunction, "random");
      randomSpy.mockImplementation((max: number, min: number = 0) => {
        if (max === 100 && min === 0) return 2;
        if (max === 300 && min === 0) return 1;
        if (min > 0) return Math.floor((max + min) / 2);
        return 0;
      });

      const data = await spawn(message.guildId!, message.channelId);

      expect(data).toBeDefined();
      expect(data).not.toBeNull();
      expect(data?.embed.data.title).toBe("Wild Pokémon appeared!");
      expect(data?.embed.data.footer?.text).toContain(
        'To catch it, do "/catch [Pokémon\'s name]".',
      );

      const serverThen = await getServerById(message.guildId!);
      expect(serverThen.pokemonPresent[message.channelId].gen.toString()).toBe(
        generation,
      );
      expect(serverThen.pokemonPresent[message.channelId].rarity).toBe(rarity);
      expect(serverThen.pokemonPresent[message.channelId].arrayType).toContain(
        type,
      );

      randomSpy.mockRestore();
    },
  );
});

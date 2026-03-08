import { resetTestEnv } from "../../utils/resetTestEnv";
import {
  cache as serverCache,
  getServerById,
  updateServer,
} from "../../../src/cache/ServerCache";
import { Server } from "../../../src/core/classes/Server";
import { Pokemon } from "../../../src/core/classes/Pokemon";
import { initHint } from "../../../src/features/hint/initHint";

describe("Server cache", () => {
  beforeEach(async () => {
    await resetTestEnv();
  });

  afterAll(async () => {});

  test("Get server", async () => {
    // given

    // when
    const getServer = await getServerById("0123456789");

    // then
    expect(getServer).toBeDefined();
    expect(getServer.discordId).toBe("0123456789");
  });
  test("Get server from cache", async () => {
    // given
    await getServerById("0123456789");
    // when

    const getServer = await getServerById("0123456789");

    // then
    expect(getServer).toBeDefined();
    expect(getServer.discordId).toBe("0123456789");
  });

  test("Get server from mongo", async () => {
    // given
    await getServerById("0123456789");
    serverCache.flushAll();

    // when
    const getServer = await getServerById("0123456789");

    // then
    expect(getServer).toBeDefined();
    expect(getServer.discordId).toBe("0123456789");
  });

  test("getPokemonByIdChannel should return pokemon when present", async () => {
    const server = await getServerById("0123456789");
    const pokemon = new Pokemon(
      "399",
      {
        nameEng: ["Bidoof"],
        nameFr: ["Keunotor"],
      },
      ["normal"],
      "ordinary",
      "0399-000",
      4,
      "ordinary",
      1,
      false,
      initHint("Bidoof"),
    );

    server.pokemonPresent["channel123"] = pokemon;
    await updateServer(server.discordId, server);

    const retrievedServer = await getServerById("0123456789");
    const retrievedPokemon =
      retrievedServer.getPokemonByIdChannel("channel123");

    expect(retrievedPokemon).not.toBeNull();
    expect(retrievedPokemon?.id).toBe("399");
  });

  test("getPokemonByIdChannel should return null when pokemon not present", async () => {
    const server = await getServerById("0123456789");
    const retrievedPokemon = server.getPokemonByIdChannel(
      "nonexistent-channel",
    );

    expect(retrievedPokemon).toBeNull();
  });

  test("removePokemonByIdChannel should remove pokemon when present", async () => {
    const server = await getServerById("0123456789");
    const pokemon = new Pokemon(
      "399",
      {
        nameEng: ["Bidoof"],
        nameFr: ["Keunotor"],
      },
      ["normal"],
      "ordinary",
      "0399-000",
      4,
      "ordinary",
      1,
      false,
      initHint("Bidoof"),
    );

    server.pokemonPresent["channel123"] = pokemon;
    await updateServer(server.discordId, server);

    const retrievedServer = await getServerById("0123456789");
    retrievedServer.removePokemonByIdChannel("channel123");
    await updateServer(retrievedServer.discordId, retrievedServer);

    const finalServer = await getServerById("0123456789");
    expect(finalServer.pokemonPresent["channel123"]).toBeUndefined();
  });

  test("removePokemonByIdChannel should not throw when pokemon not present", async () => {
    const server = await getServerById("0123456789");
    expect(() => {
      server.removePokemonByIdChannel("nonexistent-channel");
    }).not.toThrow();
  });
});

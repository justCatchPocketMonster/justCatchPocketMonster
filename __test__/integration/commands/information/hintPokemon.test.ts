import mongoose from "mongoose";
import hintPokemon from "../../../../src/commands/information/hintPokemon";
import { createMockInteraction } from "../../../utils/mock/mockInteraction";
import { getServerById, updateServer } from "../../../../src/cache/ServerCache";
import { Pokemon } from "../../../../src/core/classes/Pokemon";
import { initHint } from "../../../../src/features/hint/initHint";
import language from "../../../../src/lang/language";

describe("hint command", () => {
  let interaction: any;
  beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const name of Object.keys(collections)) {
      await collections[name].deleteMany({});
    }
    interaction = createMockInteraction();
    (interaction.options.getSubcommand as jest.Mock).mockReturnValue("hint");
  });

  afterAll(async () => {});

  test("Should reply a message with no fail", async () => {
    // given
    const server = await getServerById(interaction.guildId);
    server.pokemonPresent[interaction.channel.id] = defaultPokemon();
    await updateServer(server.discordId, server);
    // when
    await hintPokemon.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;
    const serverThen = await getServerById(interaction.guild.id);

    expect(replyMock).toHaveBeenCalledTimes(1);
    expect(replyMock).not.toHaveBeenCalledWith({
      content: language("noHint", serverThen.language),
    });
  });

  test("Failed because no hint", async () => {
    // given
    const server = await getServerById(interaction.guildId);
    const pokemon = defaultPokemon();
    pokemon.hint = "";
    server.pokemonPresent[interaction.channel.id] = pokemon;
    await updateServer(server.discordId, server);
    // when
    await hintPokemon.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;
    const serverThen = await getServerById(interaction.guild.id);

    expect(replyMock).toHaveBeenCalledTimes(1);
    expect(replyMock).toHaveBeenCalledWith({
      content: language("noHint", serverThen.language),
      ephemeral: true,
    });
  });
});

function defaultPokemon(): Pokemon {
  return new Pokemon(
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
}

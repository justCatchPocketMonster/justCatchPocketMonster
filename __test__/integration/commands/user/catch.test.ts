import { createMockInteraction } from "../../../utils/mock/mockInteraction";
import { resetTestEnv } from "../../../utils/resetTestEnv";
import language from "../../../../src/lang/language";
import { getUserById } from "../../../../src/cache/UserCache";
import { getStatById } from "../../../../src/cache/StatCache";
import { nameStatGeneral, version } from "../../../../src/config/default/misc";
import { getServerById, updateServer } from "../../../../src/cache/ServerCache";
import catchPokemon from "../../../../src/commands/user/catchPokemon";
import { Pokemon } from "../../../../src/core/classes/Pokemon";
import { initHint } from "../../../../src/features/hint/initHint";
import { ChatInputCommandInteraction } from "discord.js";

describe("catch command", () => {
  let interaction: any;
  beforeEach(async () => {
    await resetTestEnv();

    interaction = createMockInteraction();
    (interaction.options.getSubcommand as jest.Mock).mockReturnValue("code");
  });

  afterAll(async () => {});

  test("Catch present pokemon", async () => {
    // given
    const serverGiven = await getServerById(interaction.guildId);
    serverGiven.pokemonPresent[interaction.channel.id] = defaultPokemon(false);
    await updateServer(serverGiven.discordId, serverGiven);
    (interaction.options.getString as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("commandCatchOptionName", "eng")) return "Bidoof";
        return null;
      },
    );

    // when
    await catchPokemon.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;

    expect(replyMock).toHaveBeenCalledTimes(1);
    expect(replyMock).toHaveBeenCalledWith(
      "Congratulations TestNick, you caught one Keunotor/Bidoof. ",
    );
    await checkCatchForAllSavePokemon(interaction, 1, 0);
  });

  test("Catch present pokemon shiny", async () => {
    // given
    const serverGiven = await getServerById(interaction.guildId);
    serverGiven.pokemonPresent[interaction.channel.id] = defaultPokemon(true);
    await updateServer(serverGiven.discordId, serverGiven);
    (interaction.options.getString as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("commandCatchOptionName", "eng")) return "Bidoof";
        return null;
      },
    );

    // when
    await catchPokemon.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;

    expect(replyMock).toHaveBeenCalledTimes(1);
    expect(replyMock).toHaveBeenCalledWith(
      "Congratulations TestNick, you caught one Keunotor/Bidoof:star:. ",
    );
    await checkCatchForAllSavePokemon(interaction, 1, 1);
  });

  test("Catch present pokemon but shiny event", async () => {
    // given
    jest.spyOn(Math, "random").mockReturnValue(0.00001);
    const serverGiven = await getServerById(interaction.guildId);
    serverGiven.pokemonPresent[interaction.channel.id] = defaultPokemon(false);
    await updateServer(serverGiven.discordId, serverGiven);
    (interaction.options.getString as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("commandCatchOptionName", "eng")) return "Bidoof";
        return null;
      },
    );

    // when
    await catchPokemon.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;

    expect(replyMock).toHaveBeenCalledTimes(2);
    expect(replyMock).toHaveBeenNthCalledWith(
      1,
      "Wait... But the Pokémon is painted! It is shiny!!!",
    );
    expect(replyMock).toHaveBeenNthCalledWith(
      2,
      "Congratulations TestNick, you caught one Keunotor/Bidoof:star:. ",
    );
    await checkCatchForAllSavePokemon(interaction, 1, 1);
  });

  test("Catch present pokemon shiny but not shiny event", async () => {
    // given
    jest.spyOn(Math, "random").mockReturnValue(0.00001);
    const serverGiven = await getServerById(interaction.guildId);
    serverGiven.pokemonPresent[interaction.channel.id] = defaultPokemon(true);
    await updateServer(serverGiven.discordId, serverGiven);
    (interaction.options.getString as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("commandCatchOptionName", "eng")) return "Bidoof";
        return null;
      },
    );

    // when
    await catchPokemon.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;

    expect(replyMock).toHaveBeenCalledTimes(2);
    expect(replyMock).toHaveBeenNthCalledWith(
      1,
      "Wait... But the Pokémon is painted! It is not shiny! What a desappointment...",
    );
    expect(replyMock).toHaveBeenNthCalledWith(
      2,
      "Congratulations TestNick, you caught one Keunotor/Bidoof. ",
    );
    await checkCatchForAllSavePokemon(interaction, 1, 0);
  });

  test("Failed no pokemon", async () => {
    // given
    (interaction.options.getString as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("commandCatchOptionName", "eng")) return "Bidoof";
        return null;
      },
    );

    // when
    await catchPokemon.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;

    expect(replyMock).toHaveBeenCalledTimes(1);
    expect(replyMock).toHaveBeenCalledWith("No Pokémon is currently present.");
    await checkCatchForAllSavePokemon(interaction, 0, 0);
  });

  test("Failed catch name is wrong", async () => {
    // given
    const serverGiven = await getServerById(interaction.guildId);
    serverGiven.pokemonPresent[interaction.channel.id] = defaultPokemon(false);
    await updateServer(serverGiven.discordId, serverGiven);
    (interaction.options.getString as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("commandCatchOptionName", "eng")) return "Badoof";
        return null;
      },
    );

    // when
    await catchPokemon.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;

    expect(replyMock).toHaveBeenCalledTimes(1);
    expect(replyMock).toHaveBeenCalledWith(
      "Sorry TestNick. The current Pokémon is not Badoof.",
    );
    await checkCatchForAllSavePokemon(interaction, 0, 0);
  });
});

async function checkCatchForAllSavePokemon(
  interaction: ChatInputCommandInteraction,
  countNormal: number,
  countShiny: number,
) {
  const userThen = await getUserById(interaction.user.id);
  const serverThen = await getServerById(interaction.guildId!);
  const statNowThen = await getStatById(version);
  const statGeneralThen = await getStatById(nameStatGeneral);

  expect(
    userThen.savePokemon.getSaveOnePokemonFusedForm("399").normalCount,
  ).toBe(countNormal);
  expect(
    userThen.savePokemon.getSaveOnePokemonFusedForm("399").shinyCount,
  ).toBe(countShiny);
  expect(
    serverThen.savePokemon.getSaveOnePokemonFusedForm("399").normalCount,
  ).toBe(countNormal);
  expect(
    serverThen.savePokemon.getSaveOnePokemonFusedForm("399").shinyCount,
  ).toBe(countShiny);
  expect(
    statNowThen.savePokemonCatch.getSaveOnePokemonFusedForm("399").normalCount,
  ).toBe(countNormal);
  expect(
    statNowThen.savePokemonCatch.getSaveOnePokemonFusedForm("399").shinyCount,
  ).toBe(countShiny);
  expect(
    statGeneralThen.savePokemonCatch.getSaveOnePokemonFusedForm("399")
      .normalCount,
  ).toBe(countNormal);
  expect(
    statGeneralThen.savePokemonCatch.getSaveOnePokemonFusedForm("399")
      .shinyCount,
  ).toBe(countShiny);
}

function defaultPokemon(isShiny: boolean): Pokemon {
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
    isShiny,
    initHint("Bidoof"),
  );
}

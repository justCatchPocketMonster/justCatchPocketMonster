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
import { generateCatchMessage } from "../../../../src/features/catch/catch";
import * as helperFunction from "../../../../src/utils/helperFunction";

describe("catch command", () => {
  let interaction: any;
  beforeEach(async () => {
    await resetTestEnv();

    interaction = createMockInteraction();
    (interaction.options.getSubcommand as jest.Mock).mockReturnValue("code");
  });

  afterEach(() => {
    jest.restoreAllMocks();
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
    expect(interaction.deferReply).toHaveBeenCalledTimes(1);
    expect(interaction.deleteReply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).not.toHaveBeenCalled();
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
    expect(interaction.deferReply).toHaveBeenCalledTimes(1);
    expect(interaction.deleteReply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).not.toHaveBeenCalled();
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
    expect(interaction.deferReply).toHaveBeenCalledTimes(1);
    expect(interaction.followUp).toHaveBeenCalledWith(
      expect.stringContaining("shiny"),
    );
    expect(interaction.deleteReply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).not.toHaveBeenCalled();
    await checkCatchForAllSavePokemon(interaction, 1, 1);
    jest.spyOn(Math, "random").mockRestore();
  });

  test("Catch present pokemon shiny but not shiny event", async () => {
    // given
    const mathRandomSpy = jest.spyOn(Math, "random").mockReturnValue(0.00005);
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
    expect(interaction.deferReply).toHaveBeenCalledTimes(1);
    expect(interaction.followUp).toHaveBeenCalledWith(
      expect.stringContaining("not shiny"),
    );
    expect(interaction.deleteReply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).not.toHaveBeenCalled();
    await checkCatchForAllSavePokemon(interaction, 1, 0);
    mathRandomSpy.mockRestore();
  });

  test("Failed no pokemon", async () => {
    // given
    const serverGiven = await getServerById(interaction.guildId);
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
      language("noPokemonDisponible", serverGiven.settings.language),
    );
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
    const expectedMessage =
      language("failCatchGoodPokemonPart1", serverGiven.settings.language) +
      " " +
      "TestNick" +
      " " +
      language("failCatchGoodPokemonPart2", serverGiven.settings.language) +
      " " +
      "Badoof" +
      ".";
    expect(replyMock).toHaveBeenCalledWith(expectedMessage);
    await checkCatchForAllSavePokemon(interaction, 0, 0);
  });

  test("Catch pokemon with null nickname uses displayName", async () => {
    // given
    jest.spyOn(helperFunction, "random").mockReturnValue(2);
    const serverGiven = await getServerById(interaction.guildId);
    serverGiven.pokemonPresent[interaction.channel.id] = defaultPokemon(false);
    await updateServer(serverGiven.discordId, serverGiven);
    (interaction.member as any).nickname = null;
    (interaction.options.getString as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("commandCatchOptionName", "eng")) return "Bidoof";
        return null;
      },
    );

    // when
    await catchPokemon.execute(interaction);

    // then
    expect(interaction.deferReply).toHaveBeenCalledTimes(1);
    expect(interaction.deleteReply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).not.toHaveBeenCalled();
    jest.spyOn(helperFunction, "random").mockRestore();
  });

  test("Catch pokemon handles error when updating caches", async () => {
    // given
    jest.spyOn(helperFunction, "random").mockReturnValue(2);
    const serverGiven = await getServerById(interaction.guildId);
    serverGiven.pokemonPresent[interaction.channel.id] = defaultPokemon(false);
    await updateServer(serverGiven.discordId, serverGiven);
    (interaction.options.getString as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("commandCatchOptionName", "eng")) return "Bidoof";
        return null;
      },
    );

    const updateUserSpy = jest
      .spyOn(require("../../../../src/cache/UserCache"), "updateUser")
      .mockRejectedValueOnce(new Error("Update error"));

    // when
    await catchPokemon.execute(interaction);

    // then
    expect(interaction.deferReply).toHaveBeenCalledTimes(1);
    expect(interaction.deleteReply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).not.toHaveBeenCalled();

    updateUserSpy.mockRestore();
    jest.spyOn(helperFunction, "random").mockRestore();
  });

  test("generateCatchMessage should handle same name in both languages", async () => {
    const user = await getUserById(interaction.user.id);
    const server = await getServerById(interaction.guildId!);

    const pokemon = {
      name: {
        nameFr: ["Pikachu"],
        nameEng: ["Pikachu"],
      },
      isShiny: false,
    };

    const message = generateCatchMessage(pokemon, "TestNick", user, server);

    expect(message).toContain("Pikachu");
    expect(message).not.toContain("/");
  });

  test("generateCatchMessage should handle different names in both languages", async () => {
    const user = await getUserById(interaction.user.id);
    const server = await getServerById(interaction.guildId!);

    const pokemon = {
      name: {
        nameFr: ["Keunotor"],
        nameEng: ["Bidoof"],
      },
      isShiny: false,
    };

    const message = generateCatchMessage(pokemon, "TestNick", user, server);

    expect(message).toContain("Keunotor/Bidoof");
  });

  test("Catch pokemon with canSosBattle triggers SOS and followUp with new pokemon", async () => {
    jest
      .spyOn(helperFunction, "random")
      .mockImplementation((n: number) => (n === 2 ? 1 : 0));
    const serverGiven = await getServerById(interaction.guildId);
    serverGiven.pokemonPresent[interaction.channel.id] = defaultPokemon(
      false,
      true,
    );
    await updateServer(serverGiven.discordId, serverGiven);
    (interaction.options.getString as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("commandCatchOptionName", "eng")) return "Bidoof";
        return null;
      },
    );

    await catchPokemon.execute(interaction);

    expect(interaction.deferReply).toHaveBeenCalledTimes(1);
    expect(interaction.followUp).toHaveBeenCalledTimes(1);
    expect(interaction.deleteReply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).not.toHaveBeenCalled();
    const serverThen = await getServerById(interaction.guildId!);
    const sosPokemon = serverThen.pokemonPresent[interaction.channel.id];
    expect(sosPokemon).toBeDefined();
    expect(sosPokemon.id).toBe("399");
    expect(sosPokemon.canSosBattle).toBe(true);
    expect(sosPokemon.sosChainLvl).toBe(1);
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

function defaultPokemon(
  isShiny: boolean,
  canSosBattle: boolean = false,
): Pokemon {
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
    canSosBattle,
  );
}

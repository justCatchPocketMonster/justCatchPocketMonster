import { createMockInteraction } from "../../../utils/mock/mockInteraction";
import howMuchThisPokemon from "../../../../src/commands/save/howMuchThisPokemon";
import language from "../../../../src/lang/language";
import { resetTestEnv } from "../../../utils/resetTestEnv";
import { getUserById, updateUser } from "../../../../src/cache/UserCache";

describe("how much command", () => {
  let interaction: any;
  beforeEach(async () => {
    await resetTestEnv();

    interaction = createMockInteraction();
    (interaction.options.getSubcommand as jest.Mock).mockReturnValue(
      "how-much",
    );
  });

  afterAll(async () => {});

  test("Sucess with pokemon's name ", async () => {
    // given
    (interaction.options.getString as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("commandHowOptionNameStringPokemonName", "eng"))
          return "pikachu";
        return null;
      },
    );

    // when
    await howMuchThisPokemon.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;

    expect(replyMock).toHaveBeenCalledTimes(1);
  });

  test("Sucess with pokemon's id ", async () => {
    // given
    (interaction.options.getString as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("commandHowOptionNameStringNumber", "eng"))
          return "25";
        return null;
      },
    );

    // when
    await howMuchThisPokemon.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;

    expect(replyMock).toHaveBeenCalledTimes(1);
  });

  test("Failed with unknow name ", async () => {
    // given
    (interaction.options.getString as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("commandHowOptionNameStringPokemonName", "eng"))
          return "spaghetti";
        return null;
      },
    );

    // when
    await howMuchThisPokemon.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;

    expect(replyMock).toHaveBeenCalledTimes(1);
    expect(replyMock).toHaveBeenCalledWith(language("notExist", "eng"));
  });

  test("Failed with unknow id ", async () => {
    // given
    (interaction.options.getString as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("commandHowOptionNameStringNumber", "eng"))
          return "2458794";
        return null;
      },
    );

    // when
    await howMuchThisPokemon.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;

    expect(replyMock).toHaveBeenCalledTimes(1);
    expect(replyMock).toHaveBeenCalledWith(language("notExist", "eng"));
  });

  test("Success with caught pokemon shows normalCount embed", async () => {
    const userGiven = await getUserById(interaction.user.id);
    const pikaKey = Object.keys(userGiven.savePokemon.data).find((k) =>
      k.startsWith("25-"),
    );
    if (pikaKey) {
      userGiven.savePokemon.data[pikaKey].normalCount = 3;
    }
    await updateUser(userGiven.discordId, userGiven);

    (interaction.options.getString as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("commandHowOptionNameStringPokemonName", "eng"))
          return "pikachu";
        return null;
      },
    );

    await howMuchThisPokemon.execute(interaction);

    expect(interaction.reply).toHaveBeenCalledTimes(1);
  });

  test("Success with caught shiny pokemon shows shiny embed", async () => {
    const userGiven = await getUserById(interaction.user.id);
    const pikaKey = Object.keys(userGiven.savePokemon.data).find((k) =>
      k.startsWith("25-"),
    );
    if (pikaKey) {
      userGiven.savePokemon.data[pikaKey].normalCount = 2;
      userGiven.savePokemon.data[pikaKey].shinyCount = 1;
    }
    await updateUser(userGiven.discordId, userGiven);

    (interaction.options.getString as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("commandHowOptionNameStringPokemonName", "eng"))
          return "pikachu";
        return null;
      },
    );

    await howMuchThisPokemon.execute(interaction);

    expect(interaction.reply).toHaveBeenCalledTimes(1);
  });

  test("Failed with no option", async () => {
    // given

    // when
    await howMuchThisPokemon.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;

    expect(replyMock).toHaveBeenCalledTimes(1);
    expect(replyMock).toHaveBeenCalledWith(language("noArgument", "eng"));
  });
});

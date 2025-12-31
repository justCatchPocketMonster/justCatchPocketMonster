import { createMockInteraction } from "../../../utils/mock/mockInteraction";
import code from "../../../../src/commands/user/code";
import { getCode } from "../../../../src/features/code/code";
import { resetTestEnv } from "../../../utils/resetTestEnv";
import language from "../../../../src/lang/language";
import { getUserById, updateUser } from "../../../../src/cache/UserCache";
import { getStatById, updateStat } from "../../../../src/cache/StatCache";
import { nameStatGeneral } from "../../../../src/config/default/misc";

describe("code command", () => {
  let interaction: any;
  beforeEach(async () => {
    await resetTestEnv();

    interaction = createMockInteraction();
    (interaction.options.getSubcommand as jest.Mock).mockReturnValue("code");
  });

  afterAll(async () => {});

  test("Activate shiny code", async () => {
    // given
    getCode().shiny.push("testForShiny");
    (interaction.options.getString as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("codeNameOptionString", "eng"))
          return "testForShiny";
        return null;
      },
    );

    // when
    await code.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;

    expect(replyMock).toHaveBeenCalledTimes(1);
    let numberShiny = 0;
    const userThen = await getUserById(interaction.user.id);
    expect(userThen.enteredCode).toContain("testForShiny");
    userThen.savePokemon.data;
    Object.values(userThen.savePokemon.data).forEach((value) => {
      if (value.shinyCount == 1) {
        numberShiny++;
      }
    });
    expect(numberShiny).toBe(1);
  });

  test("Auto generated code spawn", async () => {
    // given
    const statGiven = await getStatById(nameStatGeneral);
    statGiven.pokemonSpawned = 14233;
    await updateStat(statGiven.version, statGiven);
    (interaction.options.getString as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("codeNameOptionString", "eng"))
          return "SPAWNS10000";
        return null;
      },
    );

    // when
    await code.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;

    expect(replyMock).toHaveBeenCalledTimes(1);
    let numberShiny = 0;
    const userThen = await getUserById(interaction.user.id);
    expect(userThen.enteredCode).toContain("SPAWNS10000");
    userThen.savePokemon.data;
    Object.values(userThen.savePokemon.data).forEach((value) => {
      if (value.shinyCount == 1) {
        numberShiny++;
      }
    });
    expect(numberShiny).toBe(1);
  });

  test("Auto generated code catch", async () => {
    // given
    const statGiven = await getStatById(nameStatGeneral);
    statGiven.pokemonSpawned = 6485;
    statGiven.pokemonCaught = 0; // Ensure pokemonCaught is initialized
    await updateStat(statGiven.version, statGiven);
    (interaction.options.getString as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("codeNameOptionString", "eng"))
          return "SPAWNS5000";
        return null;
      },
    );

    // when
    await code.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;

    expect(replyMock).toHaveBeenCalledTimes(1);
    let numberShiny = 0;
    const userThen = await getUserById(interaction.user.id);
    expect(userThen.enteredCode).toContain("SPAWNS5000");
    userThen.savePokemon.data;
    Object.values(userThen.savePokemon.data).forEach((value) => {
      if (value.shinyCount == 1) {
        numberShiny++;
      }
    });
    expect(numberShiny).toBe(1);
  });

  test("Code already used", async () => {
    // given
    getCode().shiny.push("testForShiny");
    const userGiven = await getUserById(interaction.user.id);
    userGiven.enteredCode.push("testForShiny");
    await updateUser(userGiven.discordId, userGiven);
    (interaction.options.getString as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("codeNameOptionString", "eng"))
          return "testForShiny";
        return null;
      },
    );

    // when
    await code.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;

    expect(replyMock).toHaveBeenCalledTimes(1);
    let numberShiny = 0;
    const userThen = await getUserById(interaction.user.id);
    expect(userThen.enteredCode).toContain("testForShiny");
    userThen.savePokemon.data;
    Object.values(userThen.savePokemon.data).forEach((value) => {
      if (value.shinyCount == 1) {
        numberShiny++;
      }
    });
    expect(numberShiny).toBe(0);
    expect(replyMock.mock.calls[0][0].content).toBe(
      language("codeAlreadyUsed", "eng"),
    );
  });

  test("Code unknowed", async () => {
    // given
    (interaction.options.getString as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === language("codeNameOptionString", "eng"))
          return "unknownCode";
        return null;
      },
    );

    // when
    await code.execute(interaction);

    // then
    const replyMock = interaction.reply as jest.Mock;

    expect(replyMock).toHaveBeenCalledTimes(1);
    let numberShiny = 0;
    const userThen = await getUserById(interaction.user.id);
    expect(userThen.enteredCode).not.toContain("unknownCode");
    userThen.savePokemon.data;
    Object.values(userThen.savePokemon.data).forEach((value) => {
      if (value.shinyCount == 1) {
        numberShiny++;
      }
    });
    expect(numberShiny).toBe(0);
  });
});

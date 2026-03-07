import {
  codeListEmbed,
  getCode,
  setCode,
  updateArrayCode,
} from "../../../../src/features/code/code";
import { resetTestEnv } from "../../../utils/resetTestEnv";
import { getUserById, updateUser } from "../../../../src/cache/UserCache";
import { getServerById } from "../../../../src/cache/ServerCache";
import { getStatById, updateStat } from "../../../../src/cache/StatCache";
import { nameStatGeneral } from "../../../../src/config/default/misc";
import { createMockInteraction } from "../../../utils/mock/mockInteraction";

describe("code", () => {
  beforeEach(async () => {
    await resetTestEnv();
  });

  describe("codeListEmbed", () => {
    it("should show checkmark for entered codes", async () => {
      const interaction = createMockInteraction();
      const stat = await getStatById(nameStatGeneral);
      stat.pokemonSpawned = 15000;
      await updateStat(stat.version, stat);
      getCode().shiny.push("SPAWNS10000");
      const user = await getUserById(interaction.user.id);
      user.enteredCode.push("SPAWNS10000");
      await updateUser(user.discordId, user);
      const server = await getServerById(interaction.guildId!);

      const embed = codeListEmbed(user, server, stat);

      const enteredField = embed.data.fields?.find(
        (f) => f.name === "SPAWNS10000",
      );
      expect(enteredField?.value).toBe(":white_check_mark:");
    });

    it("should show x for non-entered codes", async () => {
      const interaction = createMockInteraction();
      setCode({ shiny: ["notEnteredCode"] });
      const user = await getUserById(interaction.user.id);
      const server = await getServerById(interaction.guildId!);
      const stat = await getStatById(nameStatGeneral);

      const embed = codeListEmbed(user, server, stat);

      const notEnteredField = embed.data.fields?.find(
        (f) => f.name === "notEnteredCode",
      );
      expect(notEnteredField?.value).toBe(":x:");
    });
  });

  describe("updateArrayCode", () => {
    it("should add palier codes based on stat", async () => {
      setCode({ shiny: [] });
      const stat = await getStatById(nameStatGeneral);
      stat.pokemonSpawned = 15000;
      stat.pokemonCaught = 6000;
      await updateStat(stat.version, stat);

      updateArrayCode(stat);

      expect(getCode().shiny).toContain("SPAWNS15000");
      expect(getCode().shiny).toContain("CATCHS5000");
    });
  });

  describe("setCode", () => {
    it("should replace code object", () => {
      setCode({ shiny: ["code1"], other: ["code2"] });

      expect(getCode().shiny).toEqual(["code1"]);
      expect(getCode().other).toEqual(["code2"]);
    });
  });
});

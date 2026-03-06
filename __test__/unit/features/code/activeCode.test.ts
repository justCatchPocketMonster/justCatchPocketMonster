import { activeCode } from "../../../../src/features/code/activeCode";
import { createMockInteraction } from "../../../utils/mock/mockInteraction";
import { resetTestEnv } from "../../../utils/resetTestEnv";
import { getUserById } from "../../../../src/cache/UserCache";
import { getServerById } from "../../../../src/cache/ServerCache";

jest.mock("../../../../src/features/catch/catch", () => ({
  generateCatchMessage: jest.fn().mockReturnValue("Caught!"),
}));

describe("activeCode", () => {
  beforeEach(async () => {
    await resetTestEnv();
  });

  it("should use nickname when member has nickname", async () => {
    const interaction = createMockInteraction();
    (interaction.member as any).nickname = "CustomNick";
    (interaction.member as any).displayName = "DisplayName";

    const user = await getUserById(interaction.user.id);
    const server = await getServerById(interaction.guildId!);

    const result = await activeCode(interaction as any, "shiny", user, server);

    expect(result).toBe(true);
    expect(interaction.reply).toHaveBeenCalledWith("Caught!");
  });

  it("should use displayName when member has no nickname", async () => {
    const interaction = createMockInteraction();
    (interaction.member as any).nickname = null;
    (interaction.member as any).displayName = "DisplayName";

    const user = await getUserById(interaction.user.id);
    const server = await getServerById(interaction.guildId!);

    const result = await activeCode(interaction as any, "shiny", user, server);

    expect(result).toBe(true);
    expect(interaction.reply).toHaveBeenCalledWith("Caught!");
  });
});

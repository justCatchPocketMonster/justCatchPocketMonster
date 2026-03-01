import mongoose from "mongoose";
import { createMockInteraction } from "../../../utils/mock/mockInteraction";
import tutorial from "../../../../src/commands/information/tutorial";

describe("tutorial command", () => {
  let interaction: any;
  beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const name of Object.keys(collections)) {
      await collections[name].deleteMany({});
    }
    interaction = createMockInteraction();
    (interaction.options.getSubcommand as jest.Mock).mockReturnValue(
      "tutorial",
    );
  });

  test("Should reply a message because it's a success", async () => {
    await tutorial.execute(interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);
  });

  test("Should return early when guildId is null without replying", async () => {
    interaction.guildId = null;
    await tutorial.execute(interaction);
    expect(interaction.reply).not.toHaveBeenCalled();
  });

  test("Should log and reply error when execute throws", async () => {
    const serverCache = require("../../../../src/cache/ServerCache");
    const getServerByIdSpy = jest
      .spyOn(serverCache, "getServerById")
      .mockRejectedValue(new Error("db error"));
    const newLoggerSpy = jest.spyOn(
      require("../../../../src/middlewares/logger"),
      "newLogger",
    );

    await tutorial.execute(interaction);

    expect(newLoggerSpy).toHaveBeenCalledWith(
      "error",
      expect.anything(),
      expect.stringContaining("tutorial"),
    );
    expect(interaction.reply).toHaveBeenCalledWith(expect.any(String));

    getServerByIdSpy.mockRestore();
    newLoggerSpy.mockRestore();
  });
});

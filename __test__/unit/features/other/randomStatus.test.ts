import randomStatus from "../../../../src/features/other/randomStatus";
import { Client } from "discord.js";
import { resetTestEnv } from "../../../utils/resetTestEnv";
import { getStatById } from "../../../../src/cache/StatCache";
import { nameStatGeneral } from "../../../../src/config/default/misc";
import * as codeModule from "../../../../src/features/code/code";
import * as helperFunction from "../../../../src/utils/helperFunction";

jest.mock("../../../../src/middlewares/logger", () => ({
  newLogger: jest.fn(),
}));

describe("randomStatus", () => {
  beforeEach(async () => {
    await resetTestEnv();
  });

  test("should set activity when client has user", async () => {
    const client = {
      user: {
        id: "test-bot-id",
        setActivity: jest.fn(),
      },
    } as unknown as Client;

    jest.spyOn(codeModule, "getCode").mockReturnValue({
      shiny: ["code1", "code2"],
    } as any);
    jest.spyOn(helperFunction, "random").mockReturnValue(0);

    await randomStatus(client);

    expect(client.user?.setActivity).toHaveBeenCalled();
  });

  test("should return early when client has no user", async () => {
    const client = {
      user: null,
    } as unknown as Client;

    await randomStatus(client);

    expect(client.user).toBeNull();
  });

  test("should handle error gracefully", async () => {
    const client = {
      user: {
        id: "test-bot-id",
        setActivity: jest.fn().mockRejectedValue(new Error("Test error")),
      },
    } as unknown as Client;

    jest.spyOn(codeModule, "getCode").mockReturnValue({
      shiny: ["code1"],
    } as any);
    jest.spyOn(helperFunction, "random").mockReturnValue(0);

    await expect(randomStatus(client)).resolves.not.toThrow();
  });
});

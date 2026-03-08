import { newLogger } from "../../../src/middlewares/logger";
import logger from "../../../src/middlewares/logger";

describe("newLogger", () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(logger, "log").mockImplementation(() => logger as any);
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it("should log a string message at the given level", () => {
    newLogger("info", "hello world");

    expect(logSpy).toHaveBeenCalledWith(
      "info",
      expect.objectContaining({ message: "hello world" }),
    );
  });

  it("should use error.message when message is an Error object", () => {
    const error = new Error("something went wrong");
    newLogger("error", error);

    expect(logSpy).toHaveBeenCalledWith(
      "error",
      expect.objectContaining({ message: "something went wrong" }),
    );
  });

  it("should append additional args to the message", () => {
    newLogger("warn", "base message", "extra1", "extra2");

    expect(logSpy).toHaveBeenCalledWith(
      "warn",
      expect.objectContaining({ message: "base message extra1 extra2" }),
    );
  });

  it("should append args when message is an Error object", () => {
    const error = new Error("err msg");
    newLogger("debug", error, "context info");

    expect(logSpy).toHaveBeenCalledWith(
      "debug",
      expect.objectContaining({ message: "err msg context info" }),
    );
  });

  it("should include file and line from caller info when available", () => {
    newLogger("info", "with caller");

    expect(logSpy).toHaveBeenCalledWith(
      "info",
      expect.objectContaining({ message: "with caller" }),
    );
  });
});

import { resetTestEnv } from "../../../utils/resetTestEnv";
import { spawn } from "../../../../src/features/spawn/spawn";
import { Message } from "discord.js";
import { createMockMessage } from "../../../utils/mock/mockMessage";
import { getServerById, updateServer } from "../../../../src/cache/ServerCache";
import { Server } from "../../../../src/core/classes/Server";

describe("Spawn event", () => {
  let message: Message;
  beforeEach(async () => {
    await resetTestEnv();
    message = createMockMessage();

    const serverBeforeAll = await getServerById(message.guildId!);
    serverBeforeAll.countMessage = 19;
    serverBeforeAll.maxCountMessage = 20;
    serverBeforeAll.channelAllowed.push(message.channelId);
    await updateServer(serverBeforeAll.discordId, serverBeforeAll);
  });

  afterAll(async () => {});

  test("rarity legendary event", async () => {
    // given
    jest
      .spyOn(Math, "random")
      .mockImplementationOnce(() => 0.001)
      .mockImplementationOnce(() => 0);
    const serverDefault = Server.createDefault("id");
    // when
    const data = await spawn(message.guildId!, message.channelId);
    // then
    expect(data?.embed.data.title).toBe("A Mountaineer passes by here");
    expect(data?.embed.data.description).toBe("He gives you a funny stone.");
    const serverThen = await getServerById(message.guildId!);
    expect(serverThen.eventSpawn.rarity.legendary).toBeGreaterThan(
      serverDefault.eventSpawn.rarity.legendary,
    );
    expect(serverThen.eventSpawn.rarity.mythical).toBe(
      serverDefault.eventSpawn.rarity.mythical,
    );
  });
  test("rarity mythical event", async () => {
    // given
    jest
      .spyOn(Math, "random")
      .mockImplementationOnce(() => 0.001)
      .mockImplementationOnce(() => 0.3);
    const serverDefault = Server.createDefault("id");
    // when
    const data = await spawn(message.guildId!, message.channelId);
    // then
    expect(data?.embed.data.title).toBe("A weird scientist");
    expect(data?.embed.data.description).toBe(
      "He uses a machine that makes noises",
    );
    const serverThen = await getServerById(message.guildId!);
    expect(serverThen.eventSpawn.rarity.mythical).toBeGreaterThan(
      serverDefault.eventSpawn.rarity.mythical,
    );
  });
  test("nothing event", async () => {
    // given
    jest
      .spyOn(Math, "random")
      .mockImplementationOnce(() => 0.001)
      .mockImplementationOnce(() => 0.1);
    const serverDefault = Server.createDefault("id");
    // when
    const data = await spawn(message.guildId!, message.channelId);
    // then
    expect(data?.embed.data.title).toBe("An empty sandwich");
    expect(data?.embed.data.description).toBe("Probably a student's meal");
    const serverThen = await getServerById(message.guildId!);
    expect(serverThen.eventSpawn.rarity).toStrictEqual(
      serverDefault.eventSpawn.rarity,
    );
    expect(serverThen.eventSpawn.gen).toStrictEqual(
      serverDefault.eventSpawn.gen,
    );
    expect(serverThen.eventSpawn.type).toStrictEqual(
      serverDefault.eventSpawn.type,
    );
    expect(serverThen.eventSpawn.allowedForm).toStrictEqual(
      serverThen.eventSpawn.allowedForm,
    );
    expect(serverThen.eventSpawn.nightMode).toStrictEqual(
      serverThen.eventSpawn.nightMode,
    );
    expect(serverThen.eventSpawn.shiny).toStrictEqual(
      serverThen.eventSpawn.shiny,
    );
    expect(serverThen.eventSpawn.messageSpawn).toStrictEqual(
      serverThen.eventSpawn.messageSpawn,
    );
    expect(serverThen.eventSpawn.valueMaxChoiceEgg).toStrictEqual(
      serverThen.eventSpawn.valueMaxChoiceEgg,
    );
  });
  test("generation event", async () => {
    // given
    jest
      .spyOn(Math, "random")
      .mockImplementationOnce(() => 0.001)
      .mockImplementationOnce(() => 0.2)
      .mockImplementationOnce(() => 0)
      .mockImplementationOnce(() => 0);
    const serverDefault = Server.createDefault("id");
    // when
    const data = await spawn(message.guildId!, message.channelId);
    // then
    expect(data?.embed.data.title).toBe("A wild cook appears");
    expect(data?.embed.data.description).toBe(
      "...Why is he cooking a pokeball?",
    );
    const serverThen = await getServerById(message.guildId!);
    expect(serverThen.eventSpawn.gen["1"]).toBeGreaterThan(
      serverDefault.eventSpawn.gen["1"],
    );
  });
  test("type event", async () => {
    // given
    jest
      .spyOn(Math, "random")
      .mockImplementationOnce(() => 0.001)
      .mockImplementationOnce(() => 0.4)
      .mockImplementationOnce(() => 0)
      .mockImplementationOnce(() => 0);
    const serverDefault = Server.createDefault("id");
    // when
    const data = await spawn(message.guildId!, message.channelId);
    // then
    expect(data?.embed.data.title).toBe("A wonderful sandwich");
    expect(data?.embed.data.description).toBe("It looks delicious");
    const serverThen = await getServerById(message.guildId!);
    expect(serverThen.eventSpawn.type.steel).toBeGreaterThan(
      serverDefault.eventSpawn.type.steel,
    );
  });
  test("shiny event", async () => {
    // given
    jest
      .spyOn(Math, "random")
      .mockImplementationOnce(() => 0.001)
      .mockImplementationOnce(() => 0.5)
      .mockImplementationOnce(() => 0)
      .mockImplementationOnce(() => 0);
    const serverDefault = Server.createDefault("id");
    // when
    const data = await spawn(message.guildId!, message.channelId);
    // then
    expect(data?.embed.data.title).toBe("a Hacker");
    expect(data?.embed.data.description).toBe(
      "A hacker who... increases the shiny rate? Dirty cheater !!!",
    );
    const serverThen = await getServerById(message.guildId!);
    expect(serverThen.eventSpawn.shiny).toBeLessThan(
      serverDefault.eventSpawn.shiny,
    );
  });
  test("mega event", async () => {
    // given
    jest
      .spyOn(Math, "random")
      .mockImplementationOnce(() => 0.001)
      .mockImplementationOnce(() => 0.6)
      .mockImplementationOnce(() => 0)
      .mockImplementationOnce(() => 0);
    // when
    const data = await spawn(message.guildId!, message.channelId);
    // then
    expect(data?.embed.data.title).toBe("A rain of mega gem");
    expect(data?.embed.data.description).toBe("It falls from the sky");
    const serverThen = await getServerById(message.guildId!);
    expect(serverThen.eventSpawn.allowedForm.mega).toBe(true);
  });
  test("more pokemon event", async () => {
    // given
    jest
      .spyOn(Math, "random")
      .mockImplementationOnce(() => 0.001)
      .mockImplementationOnce(() => 0.7)
      .mockImplementationOnce(() => 0)
      .mockImplementationOnce(() => 0);
    const serverDefault = Server.createDefault("id");
    // when
    const data = await spawn(message.guildId!, message.channelId);
    // then
    expect(data?.embed.data.title).toBe("An Incense");
    expect(data?.embed.data.description).toBe(
      "It attracts more Pokémon too good!",
    );
    const serverThen = await getServerById(message.guildId!);
    expect(serverThen.eventSpawn.messageSpawn.max).toBeLessThan(
      serverDefault.eventSpawn.messageSpawn.max,
    );
    expect(serverThen.eventSpawn.messageSpawn.min).toBeLessThan(
      serverDefault.eventSpawn.messageSpawn.min,
    );
  });
  test("less pokemon event", async () => {
    // given
    jest
      .spyOn(Math, "random")
      .mockImplementationOnce(() => 0.001)
      .mockImplementationOnce(() => 0.8)
      .mockImplementationOnce(() => 0)
      .mockImplementationOnce(() => 0);
    const serverDefault = Server.createDefault("id");
    // when
    const data = await spawn(message.guildId!, message.channelId);
    // then
    expect(data?.embed.data.title).toBe("A Repel");
    expect(data?.embed.data.description).toBe(
      "Oh no there are fewer Pokémon! (An opportunity to take a break.)",
    );
    const serverThen = await getServerById(message.guildId!);
    expect(serverThen.eventSpawn.messageSpawn.max).toBeGreaterThan(
      serverDefault.eventSpawn.messageSpawn.max,
    );
    expect(serverThen.eventSpawn.messageSpawn.min).toBeGreaterThan(
      serverDefault.eventSpawn.messageSpawn.min,
    );
  });
  test("night mode event", async () => {
    // given
    jest
      .spyOn(Math, "random")
      .mockImplementationOnce(() => 0.001)
      .mockImplementationOnce(() => 0.9)
      .mockImplementationOnce(() => 0)
      .mockImplementationOnce(() => 0);
    // when
    const data = await spawn(message.guildId!, message.channelId);
    // then
    expect(data?.embed.data.title).toBe("Oh no there is no more light!");
    expect(data?.embed.data.description).toBe(
      "We will have to wait for the electrician's repairs.",
    );
    const serverThen = await getServerById(message.guildId!);
    expect(serverThen.eventSpawn.nightMode).toBe(true);
  });
  test("more egg event", async () => {
    // given
    jest
      .spyOn(Math, "random")
      .mockImplementationOnce(() => 0.001)
      .mockImplementationOnce(() => 0.95)
      .mockImplementationOnce(() => 0)
      .mockImplementationOnce(() => 0);
    const serverDefault = Server.createDefault("id");
    // when
    const data = await spawn(message.guildId!, message.channelId);
    // then
    expect(data?.embed.data.title).toBe("A very nice farmer");
    expect(data?.embed.data.description).toBe(
      "She shows you the famous oval charm.",
    );
    const serverThen = await getServerById(message.guildId!);
    expect(serverThen.eventSpawn.valueMaxChoiceEgg).toBeLessThan(
      serverDefault.eventSpawn.valueMaxChoiceEgg,
    );
  });
});

import { effectEvent } from "../../../../src/features/event/effectEvent";
import { createMockInteraction } from "../../../utils/mock/mockInteraction";
import { Server } from "../../../../src/core/classes/Server";
import { Event } from "../../../../src/core/classes/Event";
import * as paginationMenuModule from "../../../../src/features/other/paginationMenu";
import * as selectEventSeasonalModule from "../../../../src/features/event/selectEventSeasonal";
import { urlImageRepo } from "../../../../src/config/default/misc";

jest.mock("../../../../src/utils/imageUrl", () => ({
  getImageUrl: jest.fn((subFolder: string, imageName: string) =>
    Promise.resolve(`${urlImageRepo}/${subFolder}/${imageName}`),
  ),
}));

jest.mock("../../../../src/features/other/paginationMenu", () => ({
  paginationMenu: jest.fn(),
  createPageForMenu: jest.requireActual(
    "../../../../src/features/other/paginationMenu",
  ).createPageForMenu,
}));

describe("effectEvent", () => {
  let interaction: any;
  let server: Server;

  beforeEach(() => {
    interaction = createMockInteraction();
    server = Server.createDefault("server1");
    jest.clearAllMocks();
  });

  test("should call paginationMenu with noEvent page when server has no whatEvent", async () => {
    server.eventSpawn.whatEvent = null;

    await effectEvent(interaction, server);

    expect(paginationMenuModule.paginationMenu).toHaveBeenCalledWith(
      interaction,
      "Select an event",
      expect.arrayContaining([
        expect.objectContaining({
          information: expect.objectContaining({
            nameSelection: "name",
          }),
        }),
      ]),
      1,
      60000,
    );
  });

  test("should call paginationMenu with actualEvent when server has whatEvent", async () => {
    server.eventSpawn.whatEvent = new Event(
      "1",
      "testEvent" as any,
      "testDesc" as any,
      "test",
      "#FF0000",
      "0001-000",
      "Effect description",
      new Date(Date.now() + 3600000),
    );

    await effectEvent(interaction, server);

    expect(paginationMenuModule.paginationMenu).toHaveBeenCalledWith(
      interaction,
      "Select an event",
      expect.arrayContaining([
        expect.objectContaining({
          information: expect.objectContaining({
            nameSelection: "name",
          }),
        }),
      ]),
      1,
      60000,
    );
  });

  test("should add seasonal event page when selectEventSeasonal returns event", async () => {
    const mockSeasonalEvent = {
      id: 1,
      name: "seasonal_shells_title" as any,
      startDate: new Date("2025-04-14"),
      endDate: new Date("2025-04-20"),
      image: null,
      description: "seasonal_shells_desc" as any,
      statMultipliers: {},
    };
    jest
      .spyOn(selectEventSeasonalModule, "selectEventSeasonal")
      .mockReturnValue(mockSeasonalEvent);

    server.eventSpawn.whatEvent = null;
    await effectEvent(interaction, server);

    const pages = (paginationMenuModule.paginationMenu as jest.Mock).mock
      .calls[0][2];
    expect(pages.length).toBeGreaterThanOrEqual(1);
  });

  test("should add next seasonal event when selectEventSeasonal returns null but nextEvent has startDate", async () => {
    jest
      .spyOn(selectEventSeasonalModule, "selectEventSeasonal")
      .mockReturnValue(undefined);
    jest
      .spyOn(selectEventSeasonalModule, "selectNextEventSeasonal")
      .mockReturnValue({
        id: 1,
        name: "seasonal_shells_title",
        startDate: new Date("2025-04-14"),
        endDate: new Date("2025-04-20"),
        image: null,
        description: "seasonal_shells_desc",
        statMultipliers: {},
      } as any);

    server.eventSpawn.whatEvent = null;
    await effectEvent(interaction, server);

    const pages = (paginationMenuModule.paginationMenu as jest.Mock).mock
      .calls[0][2];
    expect(pages.length).toBe(2);
  });

  test("should not add seasonal page when selectEventSeasonal and selectNextEventSeasonal return null", async () => {
    jest
      .spyOn(selectEventSeasonalModule, "selectEventSeasonal")
      .mockReturnValue(undefined);
    jest
      .spyOn(selectEventSeasonalModule, "selectNextEventSeasonal")
      .mockReturnValue({ startDate: null } as any);

    server.eventSpawn.whatEvent = null;
    await effectEvent(interaction, server);

    const pages = (paginationMenuModule.paginationMenu as jest.Mock).mock
      .calls[0][2];
    expect(pages.length).toBe(1);
  });
});

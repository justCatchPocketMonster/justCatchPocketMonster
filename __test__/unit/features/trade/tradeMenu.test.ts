import {
  TradeMenuHandler,
  regenerateTradeMenu,
} from "../../../../src/features/trade/tradeMenu";
import { UserType } from "../../../../src/core/types/UserType";
import { ServerType } from "../../../../src/core/types/ServerType";
import { resetTestEnv } from "../../../utils/resetTestEnv";

describe("TradeMenu", () => {
  beforeAll(async () => {
    await resetTestEnv();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("TradeMenuHandler", () => {
    it("should create handler", () => {
      const user: UserType = {
        discordId: "user1",
        savePokemon: {
          data: {},
        },
      } as any;

      const server: ServerType = {
        discordId: "server1",
        settings: { language: "eng" },
      } as any;

      const handler = new TradeMenuHandler(user, server, undefined, jest.fn());
      expect(handler).toBeDefined();
    });

    it("should return no pokemon option when no eligible pokemon", () => {
      const user: UserType = {
        discordId: "user2",
        savePokemon: {
          data: {},
        },
      } as any;

      const server: ServerType = {
        discordId: "server1",
        settings: { language: "eng" },
      } as any;

      const handler = new TradeMenuHandler(user, server, undefined, jest.fn());
      const structure = handler.getMenuStructure();
      expect(structure.value).toBe("no_pokemon");
    });

    it("should return menu structure with eligible pokemon", () => {
      const user: UserType = {
        discordId: "user3",
        savePokemon: {
          data: {
            "25-ordinary-1": {
              idPokemon: "25",
              rarity: "ordinary",
              form: "ordinary",
              versionForm: 1,
              normalCount: 3,
              shinyCount: 0,
            },
          },
        },
      } as any;

      const server: ServerType = {
        discordId: "server1",
        settings: { language: "eng" },
      } as any;

      const handler = new TradeMenuHandler(user, server, undefined, jest.fn());
      const structure = handler.getMenuStructure();
      expect(structure.value).toBe("generation");
      expect(structure.children).toBeDefined();
      expect(structure.children!.length).toBeGreaterThan(0);
    });

    it("should filter by required rarity", () => {
      const user: UserType = {
        discordId: "user4",
        savePokemon: {
          data: {
            "25-ordinary-1": {
              idPokemon: "25",
              rarity: "ordinary",
              form: "ordinary",
              versionForm: 1,
              normalCount: 3,
              shinyCount: 0,
            },
            "144-ordinary-1": {
              idPokemon: "144",
              rarity: "legendary",
              form: "ordinary",
              versionForm: 1,
              normalCount: 2,
              shinyCount: 0,
            },
          },
        },
      } as any;

      const server: ServerType = {
        discordId: "server1",
        settings: { language: "eng" },
      } as any;

      const handler = new TradeMenuHandler(
        user,
        server,
        "legendary",
        jest.fn(),
      );
      const structure = handler.getMenuStructure();
      expect(structure.children).toBeDefined();
    });

    it("should handle action with pokemon selection", () => {
      const onPokemonSelected = jest.fn();
      const user: UserType = {
        discordId: "user5",
        savePokemon: {
          data: {},
        },
      } as any;

      const server: ServerType = {
        discordId: "server1",
        settings: { language: "eng" },
      } as any;

      const handler = new TradeMenuHandler(
        user,
        server,
        undefined,
        onPokemonSelected,
      );
      handler.handleAction([{ value: "25-ordinary-1" }]);
      expect(onPokemonSelected).toHaveBeenCalledWith("25-ordinary-1");
    });

    it("should not call callback for non-pokemon values", () => {
      const onPokemonSelected = jest.fn();
      const user: UserType = {
        discordId: "user6",
        savePokemon: {
          data: {},
        },
      } as any;

      const server: ServerType = {
        discordId: "server1",
        settings: { language: "eng" },
      } as any;

      const handler = new TradeMenuHandler(
        user,
        server,
        undefined,
        onPokemonSelected,
      );
      handler.handleAction([{ value: "gen_1" }]);
      expect(onPokemonSelected).not.toHaveBeenCalled();
    });
  });

  describe("regenerateTradeMenu", () => {
    it("should return map with handler", () => {
      const user: UserType = {
        discordId: "user7",
        savePokemon: {
          data: {},
        },
      } as any;

      const server: ServerType = {
        discordId: "server1",
        settings: { language: "eng" },
      } as any;

      const menuMap = regenerateTradeMenu(user, server, undefined, jest.fn());
      expect(menuMap).toBeInstanceOf(Map);
      expect(menuMap.has("generation")).toBe(true);
    });
  });
});

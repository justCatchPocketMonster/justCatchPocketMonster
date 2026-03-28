import { SaveAllPokemon } from "../../../src/core/classes/SaveAllPokemon";
import { SaveOnePokemon } from "../../../src/core/classes/SaveOnePokemon";
import { Pokemon } from "../../../src/core/classes/Pokemon";

describe("SaveAllPokemon", () => {
  describe("getCatchByOnlyId", () => {
    it("should sum normalCount for matching idPokemon", () => {
      const save = new SaveAllPokemon({
        "25-ordinary-1": new SaveOnePokemon(
          "25",
          "ordinary",
          "ordinary",
          1,
          0,
          5,
        ),
        "25-ordinary-2": new SaveOnePokemon(
          "25",
          "ordinary",
          "ordinary",
          2,
          1,
          3,
        ),
        "1-ordinary-1": new SaveOnePokemon(
          "1",
          "ordinary",
          "ordinary",
          1,
          0,
          2,
        ),
      });

      expect(save.getCatchByOnlyId("25")).toBe(8);
      expect(save.getCatchByOnlyId("1")).toBe(2);
      expect(save.getCatchByOnlyId("999")).toBe(0);
    });
  });

  describe("getThisSaveUniqueId", () => {
    it("should merge multiple forms into unique id", () => {
      const save = new SaveAllPokemon({
        "25-ordinary-1": new SaveOnePokemon(
          "25",
          "ordinary",
          "ordinary",
          1,
          1,
          3,
        ),
        "25-ordinary-2": new SaveOnePokemon(
          "25",
          "ordinary",
          "ordinary",
          2,
          0,
          2,
        ),
      });

      const result = save.getThisSaveUniqueId();

      expect(result.data["25"]).toBeDefined();
      expect(result.data["25"].normalCount).toBe(5);
      expect(result.data["25"].shinyCount).toBe(1);
    });
  });

  describe("getSaveOnePokemonFusedForm", () => {
    it("should fuse all forms of a pokemon", () => {
      const save = new SaveAllPokemon({
        "25-ordinary-1": new SaveOnePokemon(
          "25",
          "ordinary",
          "ordinary",
          1,
          1,
          2,
        ),
        "25-ordinary-2": new SaveOnePokemon(
          "25",
          "ordinary",
          "ordinary",
          2,
          0,
          1,
        ),
      });

      const result = save.getSaveOnePokemonFusedForm("25");

      expect(result.normalCount).toBe(3);
      expect(result.shinyCount).toBe(1);
      expect(result.form).toBe("fused");
    });

    it("should return empty when pokemon not in data", () => {
      const save = new SaveAllPokemon({});

      const result = save.getSaveOnePokemonFusedForm("999");

      expect(result.normalCount).toBe(0);
      expect(result.shinyCount).toBe(0);
    });
  });

  describe("getAllSaveOfOnePokemon", () => {
    it("should return all saves for idPokemon", () => {
      const save = new SaveAllPokemon({
        "25-ordinary-1": new SaveOnePokemon(
          "25",
          "ordinary",
          "ordinary",
          1,
          2,
          0,
        ),
        "25-ordinary-2": new SaveOnePokemon(
          "25",
          "ordinary",
          "ordinary",
          2,
          1,
          0,
        ),
      });

      const result = save.getAllSaveOfOnePokemon("25");

      expect(result).toHaveLength(2);
    });
  });

  describe("getThisSaveUniqueIdWithByIdRange", () => {
    it("should exclude pokemon outside range", () => {
      const save = new SaveAllPokemon({
        "1-ordinary-1": new SaveOnePokemon(
          "1",
          "ordinary",
          "ordinary",
          1,
          0,
          2,
        ),
        "25-ordinary-1": new SaveOnePokemon(
          "25",
          "ordinary",
          "ordinary",
          1,
          0,
          3,
        ),
        "150-ordinary-1": new SaveOnePokemon(
          "150",
          "legendary",
          "ordinary",
          1,
          0,
          1,
        ),
      });

      const result = save.getThisSaveUniqueIdWithByIdRange(5, 100);

      expect(result.data["25"]).toBeDefined();
      expect(result.data["25"].normalCount).toBe(3);
      expect(result.data["1"]).toBeUndefined();
      expect(result.data["150"]).toBeUndefined();
    });

    it("should include pokemon exactly on min and max boundaries", () => {
      const save = new SaveAllPokemon({
        "1-ordinary-1": new SaveOnePokemon(
          "1",
          "ordinary",
          "ordinary",
          1,
          0,
          1,
        ),
        "151-ordinary-1": new SaveOnePokemon(
          "151",
          "ordinary",
          "ordinary",
          1,
          0,
          1,
        ),
        "152-ordinary-1": new SaveOnePokemon(
          "152",
          "ordinary",
          "ordinary",
          1,
          0,
          1,
        ),
      });

      const result = save.getThisSaveUniqueIdWithByIdRange(1, 151);

      expect(result.data["1"]).toBeDefined();
      expect(result.data["151"]).toBeDefined();
      expect(result.data["152"]).toBeUndefined();
    });
  });

  describe("getSavesById", () => {
    it("should filter by idPokemon", () => {
      const save = new SaveAllPokemon({
        "25-ordinary-1": new SaveOnePokemon(
          "25",
          "ordinary",
          "ordinary",
          1,
          2,
          0,
        ),
        "25-ordinary-2": new SaveOnePokemon(
          "25",
          "ordinary",
          "ordinary",
          2,
          1,
          0,
        ),
      });

      const result = save.getSavesById("25");

      expect(result).toHaveLength(2);
    });
  });

  describe("countUniquePokemonsCaught", () => {
    it("should count unique pokemon with normalCount > 0", () => {
      const save = new SaveAllPokemon({
        "25-ordinary-1": new SaveOnePokemon(
          "25",
          "ordinary",
          "ordinary",
          1,
          0,
          2,
        ),
        "25-ordinary-2": new SaveOnePokemon(
          "25",
          "ordinary",
          "ordinary",
          2,
          0,
          1,
        ),
        "1-ordinary-1": new SaveOnePokemon(
          "1",
          "ordinary",
          "ordinary",
          1,
          0,
          0,
        ),
      });

      expect(save.countUniquePokemonsCaught()).toBe(1);
    });
  });

  describe("countUniquePokemonsShinyCaught", () => {
    it("should count unique pokemon with shinyCount > 0", () => {
      const save = new SaveAllPokemon({
        "25-ordinary-1": new SaveOnePokemon(
          "25",
          "ordinary",
          "ordinary",
          1,
          1,
          2,
        ),
        "1-ordinary-1": new SaveOnePokemon(
          "1",
          "ordinary",
          "ordinary",
          1,
          0,
          5,
        ),
      });

      expect(save.countUniquePokemonsShinyCaught()).toBe(1);
    });
  });

  describe("sortPokemonsByCount", () => {
    it("should sort by rarity filter ascending", () => {
      const save = new SaveAllPokemon({
        "25-ordinary-1": new SaveOnePokemon(
          "25",
          "ordinary",
          "ordinary",
          1,
          0,
          5,
        ),
        "26-ordinary-1": new SaveOnePokemon(
          "26",
          "ordinary",
          "ordinary",
          1,
          0,
          3,
        ),
        "144-ordinary-1": new SaveOnePokemon(
          "144",
          "legendary",
          "ordinary",
          1,
          0,
          1,
        ),
      });

      const result = save.sortPokemonsByCount({
        rarity: "ordinary",
        useShiny: false,
        ascending: true,
      });

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].maxCount).toBeLessThanOrEqual(
        result[result.length - 1]?.maxCount ?? 0,
      );
    });

    it("should sort descending when ascending is false", () => {
      const save = new SaveAllPokemon({
        "25-ordinary-1": new SaveOnePokemon(
          "25",
          "ordinary",
          "ordinary",
          1,
          0,
          2,
        ),
        "26-ordinary-1": new SaveOnePokemon(
          "26",
          "ordinary",
          "ordinary",
          1,
          0,
          5,
        ),
      });

      const result = save.sortPokemonsByCount({
        rarity: "ordinary",
        useShiny: false,
        ascending: false,
      });

      expect(result[0].maxCount).toBeGreaterThanOrEqual(
        result[1]?.maxCount ?? 0,
      );
    });

    it("should use shiny count when useShiny is true", () => {
      const save = new SaveAllPokemon({
        "25-ordinary-1": new SaveOnePokemon(
          "25",
          "ordinary",
          "ordinary",
          1,
          3,
          5,
        ),
        "26-ordinary-1": new SaveOnePokemon(
          "26",
          "ordinary",
          "ordinary",
          1,
          1,
          2,
        ),
      });

      const result = save.sortPokemonsByCount({
        rarity: "ordinary",
        useShiny: true,
        ascending: false,
      });

      expect(result.length).toBeGreaterThan(0);
    });

    it("should filter by form", () => {
      const save = new SaveAllPokemon({
        "25-ordinary-1": new SaveOnePokemon(
          "25",
          "ordinary",
          "ordinary",
          1,
          0,
          5,
        ),
        "25-mega-1": new SaveOnePokemon("25", "ordinary", "mega", 1, 0, 2),
      });

      const result = save.sortPokemonsByCount({
        form: "mega",
        useShiny: false,
        ascending: true,
      });

      expect(result.length).toBe(1);
      expect(result[0].who).toContain("25");
    });
  });

  describe("addOneCatch", () => {
    it("should increment shinyCount when pokemon is shiny", () => {
      const save = new SaveAllPokemon({
        "25-ordinary-1": new SaveOnePokemon(
          "25",
          "ordinary",
          "ordinary",
          1,
          0,
          0,
        ),
      });

      const pokemon = Pokemon.from({
        id: "25",
        name: { nameEng: ["Pikachu"], nameFr: ["Pikachu"] },
        arrayType: ["electric"],
        rarity: "ordinary",
        imgName: "025",
        gen: 1,
        form: "ordinary",
        versionForm: 1,
        isShiny: true,
        hint: "P___",
      });

      save.addOneCatch(pokemon);

      expect(save.data["25-ordinary-1"].normalCount).toBe(1);
      expect(save.data["25-ordinary-1"].shinyCount).toBe(1);
    });

    it("should auto-initialize and increment when pokemon not in data", () => {
      const save = new SaveAllPokemon({});
      const pokemon = Pokemon.from({
        id: "999",
        name: { nameEng: ["Unknown"], nameFr: ["Unknown"] },
        arrayType: ["normal"],
        rarity: "ordinary",
        imgName: "999",
        gen: 1,
        form: "ordinary",
        versionForm: 1,
        isShiny: false,
        hint: "U___",
      });

      save.addOneCatch(pokemon);
      expect(save.data["999-ordinary-1"].normalCount).toBe(1);
      expect(save.data["999-ordinary-1"].shinyCount).toBe(0);
    });
  });

  describe("fromMongo", () => {
    it("should create from mongo data", () => {
      const data = {
        data: {
          "25-ordinary-1": {
            idPokemon: "25",
            rarity: "ordinary",
            form: "ordinary",
            versionForm: 1,
            normalCount: 2,
            shinyCount: 0,
          },
        },
      };

      const result = SaveAllPokemon.fromMongo(data as any);

      expect(result.data["25-ordinary-1"]).toBeDefined();
      expect(result.data["25-ordinary-1"].normalCount).toBe(2);
    });

    it("should handle empty data", () => {
      const result = SaveAllPokemon.fromMongo({} as any);

      expect(Object.keys(result.data).length).toBeGreaterThan(0);
    });
  });
});

import { Pokemon } from "../../../src/core/classes/Pokemon";

describe("Pokemon", () => {
  describe("from", () => {
    it("should create Pokemon with full data", () => {
      const raw = {
        id: "1",
        name: { nameEng: ["Bulbasaur"], nameFr: ["Bulbizarre"] },
        arrayType: ["grass", "poison"],
        rarity: "ordinary",
        imgName: "001",
        gen: 1,
        form: "normal",
        versionForm: 0,
        isShiny: false,
        hint: "B___",
        canSosBattle: false,
      };

      const result = Pokemon.from(raw);

      expect(result.id).toBe("1");
      expect(result.name).toEqual({
        nameEng: ["Bulbasaur"],
        nameFr: ["Bulbizarre"],
      });
      expect(result.arrayType).toEqual(["grass", "poison"]);
      expect(result.rarity).toBe("ordinary");
      expect(result.imgName).toBe("001");
      expect(result.gen).toBe(1);
      expect(result.form).toBe("normal");
      expect(result.versionForm).toBe(0);
      expect(result.isShiny).toBe(false);
      expect(result.hint).toBe("B___");
      expect(result.canSosBattle).toBe(false);
    });

    it("should use defaults for missing fields", () => {
      const result = Pokemon.from({});

      expect(result.id).toBe("");
      expect(result.name).toEqual({ nameEng: [], nameFr: [] });
      expect(result.arrayType).toEqual([]);
      expect(result.rarity).toBe("");
      expect(result.imgName).toBe("");
      expect(result.gen).toBe(0);
      expect(result.form).toBe("");
      expect(result.versionForm).toBe(0);
      expect(result.isShiny).toBe(false);
      expect(result.hint).toBe("");
      expect(result.canSosBattle).toBe(false);
    });

    it("should handle partial name", () => {
      const result = Pokemon.from({ id: "1", name: { nameEng: ["Pikachu"] } });

      expect(result.name).toEqual({ nameEng: ["Pikachu"] });
    });

    it("should handle sosChainLvl", () => {
      const result = Pokemon.from({
        id: "1",
        name: { nameEng: ["Pikachu"], nameFr: ["Pikachu"] },
        arrayType: ["electric"],
        rarity: "ordinary",
        imgName: "025",
        gen: 1,
        form: "normal",
        versionForm: 0,
        isShiny: false,
        hint: "P___",
        canSosBattle: true,
        sosChainLvl: 3,
      });

      expect(result.sosChainLvl).toBe(3);
    });
  });

  describe("nameIsSame", () => {
    it("should return true when name matches English", () => {
      const pokemon = Pokemon.from({
        id: "1",
        name: { nameEng: ["Bulbasaur"], nameFr: ["Bulbizarre"] },
        arrayType: ["grass"],
        rarity: "ordinary",
        imgName: "001",
        gen: 1,
        form: "normal",
        versionForm: 0,
        isShiny: false,
        hint: "B___",
      });

      expect(pokemon.nameIsSame("bulbasaur")).toBe(true);
      expect(pokemon.nameIsSame("bulba")).toBe(true);
    });

    it("should return true when name matches French", () => {
      const pokemon = Pokemon.from({
        id: "1",
        name: { nameEng: ["Bulbasaur"], nameFr: ["Bulbizarre"] },
        arrayType: ["grass"],
        rarity: "ordinary",
        imgName: "001",
        gen: 1,
        form: "normal",
        versionForm: 0,
        isShiny: false,
        hint: "B___",
      });

      expect(pokemon.nameIsSame("bulbizarre")).toBe(true);
      expect(pokemon.nameIsSame("bulbi")).toBe(true);
    });

    it("should return false when name does not match", () => {
      const pokemon = Pokemon.from({
        id: "1",
        name: { nameEng: ["Bulbasaur"], nameFr: ["Bulbizarre"] },
        arrayType: ["grass"],
        rarity: "ordinary",
        imgName: "001",
        gen: 1,
        form: "normal",
        versionForm: 0,
        isShiny: false,
        hint: "B___",
      });

      expect(pokemon.nameIsSame("pikachu")).toBe(false);
    });
  });
});

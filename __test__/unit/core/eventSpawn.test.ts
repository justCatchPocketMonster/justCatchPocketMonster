import { EventSpawn } from "../../../src/core/classes/EventSpawn";
import {
  valuePerGen,
  valuePerType,
  valuePerRarity,
} from "../../../src/config/default/spawn";
import type { LanguageKey } from "../../../src/lang/language";

describe("EventSpawn.applyModifiersInPlace", () => {
  it("applies numeric, boolean and tag modifiers correctly", () => {
    const spawn = new EventSpawn(
      { ...valuePerGen },
      { ...valuePerType },
      { ...valuePerRarity },
      1000,
      null,
      { mega: false, giga: false },
      { min: 5, max: 10 },
      false,
      100,
    );

    const dummyEvent = {
      id: "e1",
      name: "pokedexOf" as LanguageKey,
      description: "pokedexOf" as LanguageKey,
      type: "test",
      color: "#fff",
      image: "img",
      effectDescription: "eff",
      endTime: new Date(),
    };

    spawn.applyModifiersInPlace({
      // per-category numeric stats
      "1": 100, // gen 1 doubled
      fire: -50, // type fire halved
      legendary: 100, // rarity legendary doubled
      // scalar numeric fields
      shiny: 10, // +10%
      valueMaxChoiceEgg: -20, // -20%
      min: 50, // +50%
      max: -10, // -10%
      // booleans
      mega: true,
      giga: true,
      nightMode: true,
      // tag
      whatEvent: dummyEvent,
    });

    // Numeric updates (with floor to 2 decimals)
    expect(spawn.gen["1"]).toBe(Math.floor(100 * 2 * 100) / 100);
    expect(spawn.type.fire).toBe(Math.floor(100 * 0.5 * 100) / 100);
    expect(spawn.rarity.legendary).toBe(Math.floor(9 * 2 * 100) / 100);

    expect(spawn.shiny).toBe(Math.floor(1000 * 1.1 * 100) / 100);
    expect(spawn.valueMaxChoiceEgg).toBe(Math.floor(100 * 0.8 * 100) / 100);
    expect(spawn.messageSpawn.min).toBe(Math.floor(5 * 1.5 * 100) / 100);
    expect(spawn.messageSpawn.max).toBe(Math.floor(10 * 0.9 * 100) / 100);

    // Booleans and tag
    expect(spawn.allowedForm.mega).toBe(true);
    expect(spawn.allowedForm.giga).toBe(true);
    expect(spawn.nightMode).toBe(true);
    expect(spawn.whatEvent).toBe(dummyEvent);
  });
});

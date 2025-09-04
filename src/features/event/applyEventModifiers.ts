import { EventSpawnType } from "./EventSpawnType";

export function applyEventModifiers(
  base: EventSpawnType,
  modifiers: Partial<EventSpawnType>,
): EventSpawnType {
  const clone: EventSpawnType = structuredClone(base); // copie pour éviter de muter

  function apply(target: any, source: any) {
    for (const key in source) {
      const value = source[key];

      if (value === null || value === undefined) {
        continue; // on ignore les null/undefined
      }

      if (typeof value === "number") {
        if (typeof target[key] === "number") {
          // pourcentage appliqué
          target[key] = Math.floor(target[key] * (1 + value / 100));
        } else {
          // si la base n'est pas un nombre → on écrase
          target[key] = value;
        }
      } else if (typeof value === "object" && !Array.isArray(value)) {
        // descente récursive
        if (!target[key]) target[key] = {};
        apply(target[key], value);
      } else {
        // écrasement direct (string, bool, etc.)
        target[key] = value;
      }
    }
  }

  apply(clone, modifiers);
  return clone;
}

import allPokemon from "../../../src/data/pokemon.json";
import { urlImageRepo } from "../../../src/config/default/misc";

describe("test all data pokemon", () => {
  const cases = allPokemon.filter((p) => p.id !== 0);

  test.each(cases.map((p) => [p.name.nameEng[0], p]))(
    "Check pokemon %s",
    async (_name, pokemon) => {
      expect(pokemon.id).toBeDefined();
      expect(pokemon.name?.nameEng).toBeDefined();
      expect(pokemon.name?.nameFr).toBeDefined();
      expect(pokemon.name?.nameCompletFr).toBeDefined();
      expect(pokemon.name?.nameCompletEng).toBeDefined();
      expect(pokemon.name?.nameCompletFr).toHaveLength(1);
      expect(pokemon.name?.nameCompletEng).toHaveLength(1);
      expect(pokemon.name?.nameCompletFr?.[0]).toBeTruthy();
      expect(pokemon.name?.nameCompletEng?.[0]).toBeTruthy();
      expect(pokemon.arrayType).toBeDefined();
      expect(pokemon.rarity).toBeDefined();
      expect(pokemon.gen).toBeDefined();
      expect(pokemon.imgName).toBeDefined();
      expect(pokemon.form).toBeDefined();
      expect(pokemon.versionForm).toBeDefined();

      const pokemonWithSameData = allPokemon.filter(
        (p) =>
          p.id === pokemon.id &&
          p.form === pokemon.form &&
          p.versionForm === pokemon.versionForm,
      );
      expect(pokemonWithSameData).toHaveLength(1);
    },
  );
});

function pLimit(concurrency: number) {
  const queue: Array<() => void> = [];
  let active = 0;
  const next = () => {
    active--;
    queue.shift()?.();
  };
  return <T>(fn: () => Promise<T>) =>
    new Promise<T>((resolve, reject) => {
      const run = () => {
        active++;
        fn()
          .then((v) => {
            resolve(v);
            next();
          })
          .catch((e) => {
            reject(e);
            next();
          });
      };
      active < concurrency ? run() : queue.push(run);
    });
}

const limitNet = pLimit(4);

async function imageExists(url: string): Promise<boolean> {
  const response = await fetch(url);
  return response.ok;
}

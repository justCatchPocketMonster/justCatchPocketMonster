import { PokemonType } from "../../core/types/PokemonType";
import { ServerType } from "../../core/types/ServerType";
import allPokemon from "../../data/json/pokemon.json";
import { pokemonDb } from "../../core/types/pokemonDb";
import { initHint } from "../hint/initHint";
import { capitalizeFirstLetter, random } from "../../utils/helperFunction";

const RAID_SHINY_DIVISOR = 4;

export function selectRaidPokemon(server: ServerType): PokemonType {
  const gigaPokemons: pokemonDb[] = (allPokemon as pokemonDb[]).filter(
    (p) => p.form === "giga",
  );

  const chosen = gigaPokemons[random(gigaPokemons.length)];

  const tauxShiny = Math.max(
    1,
    Math.floor(server.eventSpawn.shiny / RAID_SHINY_DIVISOR),
  );
  const isShiny = random(tauxShiny) === 1;

  const hint = initHint(
    chosen.name["name" + capitalizeFirstLetter(server.settings.language)][0],
  );

  return {
    id: chosen.id.toString(),
    name: {
      nameEng: chosen.name["nameEng"],
      nameFr: chosen.name["nameFr"],
    },
    arrayType: chosen.arrayType,
    rarity: chosen.rarity,
    imgName: chosen.imgName,
    gen: chosen.gen,
    form: chosen.form,
    versionForm: chosen.versionForm,
    isShiny,
    hint,
    canSosBattle: false,
  };
}

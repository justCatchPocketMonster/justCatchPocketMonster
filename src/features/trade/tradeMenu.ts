import { MenuHandler, MenuOption } from "../../utils/menu/types";
import { UserType } from "../../core/types/UserType";
import { getEligiblePokemon } from "./tradeUtils";
import allPokemon from "../../data/pokemon.json";
import { pokemonDb } from "../../core/types/pokemonDb";
import language from "../../lang/language";
import { ServerType } from "../../core/types/ServerType";

export class TradeMenuHandler implements MenuHandler {
  private user: UserType;
  private server: ServerType;
  private requiredRarity?: string;
  private onPokemonSelected: (pokemonKey: string) => void;

  constructor(
    user: UserType,
    server: ServerType,
    requiredRarity: string | undefined,
    onPokemonSelected: (pokemonKey: string) => void,
  ) {
    this.user = user;
    this.server = server;
    this.requiredRarity = requiredRarity;
    this.onPokemonSelected = onPokemonSelected;
  }

  getMenuStructure(): MenuOption {
    const eligible = getEligiblePokemon(this.user, this.requiredRarity);
    const lang = this.server.settings.language;

    if (eligible.length === 0) {
      return {
        label: language("tradeNoPokemonAvailable", lang),
        value: "no_pokemon",
        description: language("tradeNoPokemonAvailableDesc", lang),
      };
    }

    const byGen = new Map<number, typeof eligible>();
    for (const item of eligible) {
      const gen = item.data.gen;
      if (!byGen.has(gen)) {
        byGen.set(gen, []);
      }
      byGen.get(gen)!.push(item);
    }

    const genOptions: MenuOption[] = Array.from(byGen.keys())
      .sort((a, b) => a - b)
      .map((gen) => {
        const genPokemon = byGen.get(gen)!;
        const typeMap = new Map<string, typeof genPokemon>();

        for (const item of genPokemon) {
          for (const type of item.data.arrayType) {
            if (type && type !== "") {
              if (!typeMap.has(type)) {
                typeMap.set(type, []);
              }
              if (!typeMap.get(type)!.some((i) => i.key === item.key)) {
                typeMap.get(type)!.push(item);
              }
            }
          }
        }

        const typeOptions: MenuOption[] = Array.from(typeMap.keys())
          .sort()
          .map((type) => {
            const typePokemon = typeMap.get(type)!;
            const pokemonOptions: MenuOption[] = typePokemon.map((item) => {
              const langKey =
                `name${lang.charAt(0).toUpperCase() + lang.slice(1)}` as
                  | "nameFr"
                  | "nameEng";
              const pokemonName = item.data.name[langKey][0];
              const totalCount =
                item.pokemon.normalCount + item.pokemon.shinyCount;
              return {
                label: `${pokemonName} (${totalCount})`,
                value: item.key,
                description: `${language("tradePokemonCount", lang)}: ${totalCount}`,
              };
            });

            return {
              label: this.getTypeLabel(type, lang),
              value: `gen_${gen}_type_${type}`,
              description: `${typePokemon.length} ${language("tradePokemonAvailable", lang)}`,
              children: pokemonOptions,
            };
          });

        return {
          label: `Gen ${gen}`,
          value: `gen_${gen}`,
          description: `${genPokemon.length} ${language("tradePokemonAvailable", lang)}`,
          children: typeOptions,
        };
      });

    return {
      label: language("tradeSelectGeneration", lang),
      value: "generation",
      description: language("tradeSelectGenerationDesc", lang),
      children: genOptions,
    };
  }

  private getTypeLabel(type: string, lang: string): string {
    const typeKey = `type${type.charAt(0).toUpperCase() + type.slice(1)}`;
    const translated = language(typeKey as any, lang);
    if (translated && !translated.includes("Error")) {
      return translated;
    }
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  handleAction(selectionPath: any[]): void {
    const pokemonValue = selectionPath[selectionPath.length - 1]?.value;
    if (
      pokemonValue &&
      !pokemonValue.startsWith("gen_") &&
      !pokemonValue.startsWith("type_")
    ) {
      this.onPokemonSelected(pokemonValue);
    }
  }
}

export function regenerateTradeMenu(
  user: UserType,
  server: ServerType,
  requiredRarity: string | undefined,
  onPokemonSelected: (pokemonKey: string) => void,
): Map<string, MenuHandler> {
  const handler = new TradeMenuHandler(
    user,
    server,
    requiredRarity,
    onPokemonSelected,
  );
  return new Map([["generation", handler]]);
}

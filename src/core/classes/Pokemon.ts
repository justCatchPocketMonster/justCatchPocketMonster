import { PokemonType } from "../types/PokemonType";

export class Pokemon implements PokemonType {
  constructor(
    public id: string,
    public name: {
      [key: string]: string[];
    },
    public arrayType: string[],
    public rarity: string,
    public imgName: string,
    public gen: number,
    public form: string,
    public versionForm: number,
    public isShiny: boolean | undefined,
    public hint: string,
  ) {}

  nameIsSame(name: string): boolean {
    const lowerName = name.toLowerCase();
    return (
      this.name.nameEng.some((n) => n.toLowerCase().includes(lowerName)) ||
      this.name.nameFr.some((n) => n.toLowerCase().includes(lowerName))
    );
  }
  static from(raw: Partial<PokemonType>): Pokemon {
    return new Pokemon(
      raw.id ?? "",
      raw.name ?? { nameEng: [], nameFr: [] },
      raw.arrayType ?? [],
      raw.rarity ?? "",
      raw.imgName ?? "",
      raw.gen ?? 0,
      raw.form ?? "",
      raw.versionForm ?? 0,
      raw.isShiny ?? false,
      raw.hint ?? "",
    );
  }
}

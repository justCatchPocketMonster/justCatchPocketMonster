export interface PokemonType {
  id: string;
  name: {
    [key: string]: string[];
  };
  arrayType: string[];
  rarity: string;
  imgName: string;
  gen: number;
  form: string;
  versionForm: number;
  isShiny: boolean | undefined;
  hint: string;
  canSosBattle?: boolean;
  sosChainLvl?: number;
}

export interface pokemonDb {
  id: number;
  name: {
    [key: string]: string[];
  };
  arrayType: string[];
  rarity: string;
  gen: number;
  imgName: string;
  form: string;
  versionForm: number;
}

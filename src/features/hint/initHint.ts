export function initHint(pokemonName: string): string {
  const hintArray = pokemonName.split("").map(() => "_");
  return hintArray.join("");
}

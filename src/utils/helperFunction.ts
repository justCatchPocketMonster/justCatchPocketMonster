import { ColorResolvable } from "discord.js";

export const colorByType = (type: string): ColorResolvable => {
  switch (type) {
    case "Steel":
      return "B7B7CE" as ColorResolvable;
    case "Fighting":
      return "C22E28" as ColorResolvable;
    case "Dragon":
      return "6F35FC" as ColorResolvable;
    case "Water":
      return "6390F0" as ColorResolvable;
    case "Fire":
      return "EE8130" as ColorResolvable;
    case "Fairy":
      return "D685AD" as ColorResolvable;
    case "Ice":
      return "96D9D6" as ColorResolvable;
    case "Bug":
      return "A6B91A" as ColorResolvable;
    case "Normal":
      return "A8A77A" as ColorResolvable;
    case "Grass":
      return "7AC74C" as ColorResolvable;
    case "Poison":
      return "A33EA1" as ColorResolvable;
    case "Psychic":
      return "F95587" as ColorResolvable;
    case "Rock":
      return "B6A136" as ColorResolvable;
    case "Ground":
      return "E2BF65" as ColorResolvable;
    case "Ghost":
      return "735797" as ColorResolvable;
    case "Flying":
      return "A98FF3" as ColorResolvable;
    case "Electric":
      return "F7D02C" as ColorResolvable;
    case "Dark":
      return "705746" as ColorResolvable;
    default:
      return "FFFFFF" as ColorResolvable;
  }
};


export function getPercentage(partialValue: number, totalValue: number): number {
  return (partialValue / totalValue) * 100;
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
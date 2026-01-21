import { ColorResolvable } from "discord.js";

export const colorByType = (type: string): ColorResolvable => {
  switch (type) {
    case "steel":
      return "B7B7CE" as ColorResolvable;
    case "fighting":
      return "C22E28" as ColorResolvable;
    case "dragon":
      return "6F35FC" as ColorResolvable;
    case "water":
      return "6390F0" as ColorResolvable;
    case "fire":
      return "EE8130" as ColorResolvable;
    case "fairy":
      return "D685AD" as ColorResolvable;
    case "ice":
      return "96D9D6" as ColorResolvable;
    case "bug":
      return "A6B91A" as ColorResolvable;
    case "normal":
      return "A8A77A" as ColorResolvable;
    case "grass":
      return "7AC74C" as ColorResolvable;
    case "poison":
      return "A33EA1" as ColorResolvable;
    case "psychic":
      return "F95587" as ColorResolvable;
    case "rock":
      return "B6A136" as ColorResolvable;
    case "ground":
      return "E2BF65" as ColorResolvable;
    case "ghost":
      return "735797" as ColorResolvable;
    case "flying":
      return "A98FF3" as ColorResolvable;
    case "electric":
      return "F7D02C" as ColorResolvable;
    case "dark":
      return "705746" as ColorResolvable;
    default:
      return "FFFFFF" as ColorResolvable;
  }
};

export function getPercentage(
  partialValue: number,
  totalValue: number,
): number {
  const percentage = (partialValue / totalValue) * 100;
  return parseFloat(percentage.toFixed(1));
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function deepCloneObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function random(max: number, min: number = 0): number {
  return Math.floor(Math.random() * (max - min) + min);
}

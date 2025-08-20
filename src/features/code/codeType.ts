import { getCode } from "./code";

export const codeType = (codeEntered: string): string | null => {
  for (let key in getCode()) {
    if (getCode()[key].includes(codeEntered)) {
      return key;
    }
  }
  return null;
};


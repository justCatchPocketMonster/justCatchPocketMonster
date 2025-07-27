import { code } from "./code";

export const codeType = (codeEntered: string): string | null => {
  for (let key in code) {
    if (code[key].includes(codeEntered)) {
      return key;
    }
  }
  return null;
};


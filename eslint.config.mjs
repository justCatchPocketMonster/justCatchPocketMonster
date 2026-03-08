import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import jsdocPlugin from "eslint-plugin-jsdoc";
import eslintPluginJest from "eslint-plugin-jest";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
      },
      globals: {
        ...eslintPluginJest.environments.globals.globals,
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      prettier: prettierPlugin,
      jsdoc: jsdocPlugin,
      jest: eslintPluginJest,
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
      camelcase: ["error", { properties: "always" }],
      "prettier/prettier": "error",
      "jsdoc/check-tag-names": "error",
      "jsdoc/require-description": "error",
    },
  },
];

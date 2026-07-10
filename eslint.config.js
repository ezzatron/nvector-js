import js from "@eslint/js";
import node from "eslint-plugin-n";
import promise from "eslint-plugin-promise";
import globals from "globals";
import ts from "typescript-eslint";

export default ts.config(
  {
    ignores: [".makefiles", "artifacts"],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  node.configs["flat/recommended-module"],
  promise.configs["flat/recommended"],
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.es2022,
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          // allow unused args if they start with _
          argsIgnorePattern: "^_",
        },
      ],
      // handled by typescript-eslint
      "n/no-missing-import": "off",
      // don't check for unsupported features - too much config to make this work
      "n/no-unsupported-features/es-builtins": "off",
      "n/no-unsupported-features/es-syntax": "off",
      "n/no-unsupported-features/node-builtins": "off",
    },
  },
);

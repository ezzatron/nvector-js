import js from "@eslint/js";
import import_ from "eslint-plugin-import";
import node from "eslint-plugin-n";
import promise from "eslint-plugin-promise";
import globals from "globals";
import ts from "typescript-eslint";

export default ts.config(
  {
    ignores: [".makefiles", "artifacts"],
  },
  js.configs.recommended,
  // eslint-disable-next-line import/no-named-as-default-member
  ...ts.configs.recommended,
  node.configs["flat/recommended-module"],
  import_.flatConfigs.recommended,
  import_.flatConfigs.typescript,
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
    settings: {
      "import/resolver": {
        typescript: true,
        node: true,
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
      // handled by import/no-unresolved
      "n/no-missing-import": "off",
      // don't check for unsupported features - too much config to make this work
      "n/no-unsupported-features/es-builtins": "off",
      "n/no-unsupported-features/es-syntax": "off",
      "n/no-unsupported-features/node-builtins": "off",
    },
  },
);

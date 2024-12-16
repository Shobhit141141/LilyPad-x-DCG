import globals from "globals";
import pluginJs from "@eslint/js";
import prettier from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.Config} */
export default {
  files: ["**/*.{js,mjs,cjs}"],
  languageOptions: {
    sourceType: "module",
    globals: {
      ...globals.node,
      ...globals.browser,
    },
  },
  plugins: {
    prettier,
  },
  rules: {
    ...pluginJs.configs.recommended.rules,
    "prettier/prettier": "error",
  },
};

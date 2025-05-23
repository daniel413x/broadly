import {
  dirname,
} from "path";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginReactHooks from "eslint-plugin-react-hooks";
import {
  defineConfig,
} from "eslint/config";
import {
  FlatCompat,
} from "@eslint/eslintrc";
import {
  fileURLToPath,
} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript", "plugin:@next/next/recommended"),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: {
      js,
    }, extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], languageOptions: {
      globals: globals.browser,
    },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      "react-hooks": pluginReactHooks,
      "jsx-a11y": pluginJsxA11y,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-props-no-spreading": "off",
      "react/jsx-indent": ["error", 2],

      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

      "comma-dangle": ["error", {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "never",
      }],
      eqeqeq: ["error", "always"],
      "no-undef": "warn",

      "no-multiple-empty-lines": ["error", {
        max: 1,
        maxBOF: 0,
        maxEOF: 0,
      }],
      "eol-last": ["error", "always"],
      "no-multi-spaces": ["error", {
        ignoreEOLComments: false,
      }],
      indent: ["error", 2],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "max-len": "off",
      "linebreak-style": ["error", "unix"],
    },
  },
]);

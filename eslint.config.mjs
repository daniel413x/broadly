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
  globalIgnores,
} from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";
import {
  FlatCompat,
} from "@eslint/eslintrc";
import {
  fileURLToPath,
} from "url";
import vitest from "eslint-plugin-vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default defineConfig([
  globalIgnores([
    "src/app/(payload)/**/*",
  ]),
  ...compat.extends("next/core-web-vitals", "next/typescript", "plugin:@next/next/recommended"),
  // vitest block
  {
    files: ["**/*.test.{js,ts,jsx,tsx}", "**/__tests__/**/*.{js,ts,jsx,tsx}"],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      "vitest/max-nested-describe": ["error", { max: 3 }],
    },
    languageOptions: {
      globals: {
        // prevent no-undef warning spam in lint output
        ...vitest.environments.env.globals,
      },
    },
  },
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
      "@stylistic": stylistic,
    },
    rules: {
    // stylistic replacements
      "@stylistic/indent": ["error", 2, { SwitchCase: 1 }],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/jsx-quotes": ["error", "prefer-double"],
      "@stylistic/no-multiple-empty-lines": ["error", {
        max: 1,
        maxBOF: 0,
        maxEOF: 0,
      }],
      "@stylistic/array-bracket-spacing": ["error", "never"],
      "@stylistic/block-spacing": ["error", "always"],
      "@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "@stylistic/comma-spacing": ["error", { before: false, after: true }],
      "@stylistic/key-spacing": ["error", { beforeColon: false, afterColon: true }],
      "@stylistic/keyword-spacing": ["error", { before: true, after: true }],
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/padded-blocks": ["error", "never"],
      "@stylistic/quote-props": ["error", "as-needed"],
      "@stylistic/space-before-blocks": ["error", "always"],
      "@stylistic/space-in-parens": ["error", "never"],
      "@stylistic/spaced-comment": ["error", "always", { exceptions: ["-", "+"] }],
      "@stylistic/template-curly-spacing": ["error", "never"],
      "@stylistic/comma-dangle": ["error", {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "never",
      }],
      "@stylistic/eol-last": ["error", "always"],
      "@stylistic/no-multi-spaces": ["error", { ignoreEOLComments: false }],
      "@stylistic/linebreak-style": ["error", "unix"],
      "@stylistic/max-len": "off",

      "react/react-in-jsx-scope": "off",
      "react/jsx-props-no-spreading": "off",

      "consistent-return": "error",
      "func-names": "warn",
      "no-console": "warn",
      "no-else-return": ["error", { allowElseIf: false }],
      "no-lonely-if": "error",
      "no-mixed-operators": "error",
      "no-nested-ternary": "error",
      "no-param-reassign": ["error", { props: true }],

      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "error",

      "no-unused-expressions": ["error", { allowShortCircuit: true, allowTernary: true }],
      "prefer-arrow-callback": ["error", { allowNamedFunctions: false }],
      "prefer-const": "error",
      eqeqeq: ["error", "always"],

      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["**/*.config.{js,ts,jsx,tsx}"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);

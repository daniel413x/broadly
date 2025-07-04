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
import {
  FlatCompat,
} from "@eslint/eslintrc";
import {
  fileURLToPath,
} from "url";
import pluginJest from "eslint-plugin-jest";

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
  // jest block
  {
    files: ["**/*.test.{js,ts,jsx,tsx}", "**/__tests__/**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    plugins: {
      jest: pluginJest,
    },
    rules: {
      // Optional: enable recommended rules
      ...pluginJest.configs.recommended.rules,
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
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-props-no-spreading": "off",
      "react/jsx-indent": ["error", 2],

      "array-bracket-spacing": ["error", "never"],
      "block-spacing": ["error", "always"],
      "brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "comma-spacing": ["error", { before: false, after: true }],
      "consistent-return": "error",
      "func-names": "warn",
      "key-spacing": ["error", { beforeColon: false, afterColon: true }],
      "keyword-spacing": ["error", { before: true, after: true }],
      "no-console": "warn",
      "no-else-return": ["error", { allowElseIf: false }],
      "no-lonely-if": "error",
      "no-mixed-operators": "error",
      "no-nested-ternary": "error",
      "no-param-reassign": ["error", { props: true }],
      "no-shadow": "error",
      "no-trailing-spaces": "error",
      "no-unused-expressions": ["error", { allowShortCircuit: true, allowTernary: true }],
      "object-curly-spacing": ["error", "always"],
      "padded-blocks": ["error", "never"],
      "prefer-arrow-callback": ["error", { allowNamedFunctions: false }],
      "prefer-const": "error",
      "quote-props": ["error", "as-needed"],
      "space-before-blocks": ["error", "always"],
      "space-in-parens": ["error", "never"],
      "spaced-comment": ["error", "always", { exceptions: ["-", "+"] }],
      "template-curly-spacing": ["error", "never"],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "off",
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
  {
    files: ["**/*.config.{js,ts,jsx,tsx}"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);

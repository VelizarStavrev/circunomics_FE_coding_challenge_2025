// @ts-check
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = defineConfig([
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      "no-unreachable": "error",
      "capitalized-comments": ["error", "always"],
      "no-alert": "error",
      "no-console": ["error", { allow: ["warn", "error"] }],
      "max-len": ["warn", { code: 160 }],
      "arrow-parens": ["error", "always"],
      "arrow-spacing": "error",
      "brace-style": "error",
      "comma-dangle": ["error", "always-multiline"],
      "comma-spacing": "error",
      "eol-last": ["error", "always"],
      "func-call-spacing": "error",
      "indent": ["error", 2],
      "quotes": ["error", "single", { avoidEscape: true }],
      "spaced-comment": "error",
      "space-before-function-paren": ["error", "never"],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
    rules: {
      "@angular-eslint/template/click-events-have-key-events": 0,
      "@angular-eslint/template/interactive-supports-focus": 0
    }
  }
]);

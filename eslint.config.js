// @ts-check

// ?: Angular prefers CommonJS modules for JS files since package.json doesn't have `"type": "module"`
const eslint = require("@eslint/js"); // ?: So `import x from "y" isn't allowed in JS files
const globals = require("globals");
const tsEslint = require("typescript-eslint");
const ngEslint = require("angular-eslint");

// ?: Similar to using `require()`, without the following export, ESLint won't work
module.exports = tsEslint.config(
  { // ?: Unlike React-Eslint, Angular-Eslint can MOSTLY be configured via one TS file config obj
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tsEslint.configs.recommended,
      ...ngEslint.configs.tsRecommended
    ],
    processor: ngEslint.processInlineTemplates,
    rules: {
      "linebreak-style": ["error", "unix"],
      "max-len": ["error", { "code": 100 }],
      "no-trailing-spaces": "error",
      "indent": "off",
      "@typescript-eslint/indent": ["error", 2],
      "@typescript-eslint/member-delimiter-style": ["error", {
        "multiline": { "delimiter": "semi", "requireLast": true },
        "singleline": { "delimiter": "semi", "requireLast": true },
        "multilineDetection": "brackets"
      }],
      "quotes": "off",
      "@typescript-eslint/quotes": "error",
      "semi": "off",
      "@typescript-eslint/semi": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@angular-eslint/directive-selector": ["warn", { "type": "attribute", "prefix": "app", "style": "camelCase" }],
      "@angular-eslint/component-selector": ["warn", { "type": "element", "prefix": "app", "style": "kebab-case" }]
    }
  },
  {
    files: ["**/*.html"],
    extends: [
      ...ngEslint.configs.templateRecommended,
      ...ngEslint.configs.templateAccessibility
    ],
    rules: {}
  },
  { // ?: Adding a separate config object is the equivalent of "overrides" from ".eslintrc" files
    files: ["**/*.spec.ts"],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off"
    }
  },
  { // ?: A Config obj with ONLY an ignores key acts as a global ignore
    ignores: ["**/projects/", "*.d.ts"]
  }
);
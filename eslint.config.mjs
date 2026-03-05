import js from "@eslint/js";

export default [
  {
    ignores: [
      "node_modules/",
      "downloads/",
      "uploads/",
      "test/input/",
      "test/output/",
    ],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "commonjs",
      globals: {
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        process: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        Promise: "readonly",
        describe: "readonly",
        it: "readonly",
        before: "readonly",
        after: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off",
    },
  },
  {
    files: ["eslint.config.mjs"],
    languageOptions: {
      sourceType: "module",
    },
  },
];

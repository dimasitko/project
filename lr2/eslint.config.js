const js = require("@eslint/js");
const prettierConfig = require("eslint-config-prettier");
const prettierPlugin = require("eslint-plugin-prettier");

module.exports = [
    js.configs.recommended,
    prettierConfig,
    {
        plugins: { prettier: prettierPlugin },
        languageOptions: {
            globals: {
                require: "readonly",
                module: "writable",
                exports: "writable",
                __dirname: "readonly",
                __filename: "readonly",
                process: "readonly",
                console: "readonly"
            }
        },
        rules: {
            "prettier/prettier": "error",
            "no-unused-vars": "warn",
            "no-console": "off",
            "eqeqeq": ["error", "always"],
            "no-var": "error",
            "prefer-const": "warn",
            "@typescript-eslint/no-unused-vars": ["warn", { "varsIgnorePattern": "^_" }]
        }
    },
    {
        ignores: ["node_modules/**", "public/**"]
    }
];
import js from "@eslint/js";
import globals from "globals";

export default [
    {
        ignores: ["node_modules/**", "dist/**", "build/**"],
    },
    js.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: globals.node,
        },
        rules: {
            "no-unused-vars": "off",
            "no-console": "off",
            "no-undef": "off",
            semi: ["error", "always"],
            quotes: ["error", "double"],
            eqeqeq: "error",
            "no-var": "error",
            "prefer-const": "error",
        },
    },
];

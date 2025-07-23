import eslint from '@eslint/js';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';
import vue from 'eslint-plugin-vue';
import prettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';

export default typescriptEslint.config(
    {
        ignores: ['*.d.ts', '**/dist', '**/coverage'],
    },
    {
        files: ['**/*.{ts,vue}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: globals.browser,
            parserOptions: {
                parser: typescriptEslint.parser,
                extraFileExtensions: ['.vue'],
            },
        },
        plugins: {
            vue,
            prettier,
        },
        rules: {
            'prettier/prettier': 'error',

            'vue/multi-word-component-names': 'off',
            'vue/no-mutating-props': 'warn',
            'vue/no-v-html': 'off',

            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
        extends: [
            eslint.configs.recommended,
            ...typescriptEslint.configs.recommended,
            ...vue.configs['flat/recommended'],
            configPrettier,
        ],
    }
);

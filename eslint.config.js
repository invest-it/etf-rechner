// eslint.config.ts
import eslint from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'

export default tseslint.config(
    { ignores: ['*.d.ts', '**/dist', '**/coverage'] },

    {
        files: ['**/*.{ts,vue}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: globals.browser,
            parserOptions: {
                parser: tseslint.parser,
                extraFileExtensions: ['.vue'],
            },
        },
        plugins: { vue, prettier },
        rules: {
            'prettier/prettier': [
                'error',
                {
                    printWidth: 140,
                    proseWrap: 'never',
                    htmlWhitespaceSensitivity: 'ignore',
                    singleAttributePerLine: false,
                    trailingComma: 'all',
                    bracketSameLine: true,
                },
            ],

            // Turn off Vue rules that force wrapping/line breaks/indent churn
            'vue/max-attributes-per-line': 'off',
            'vue/first-attribute-linebreak': 'off',
            'vue/html-closing-bracket-newline': 'off',
            'vue/singleline-html-element-content-newline': 'off',
            'vue/multiline-html-element-content-newline': 'off',
            'vue/html-indent': 'off',
            'vue/script-indent': 'off',


            'vue/multi-word-component-names': 'off',
            'vue/no-mutating-props': 'warn',
            'vue/no-v-html': 'off',

            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],


        },
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
            ...vue.configs['flat/recommended'],
            configPrettier,
        ],
    }
)

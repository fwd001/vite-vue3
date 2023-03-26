// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  plugins: ['vue'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    ecmaVersion: 'latest', // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {}, // Allows for the parsing of JSX
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-var-requires': 'warn',
    '@typescript-eslint/no-empty-function': 'error',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^h$',
        varsIgnorePattern: '^h$',
      },
    ],
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^h$',
        varsIgnorePattern: '^h$',
      },
    ],
    'space-before-function-paren': 'off',
    quotes: ['error', 'single'],
    'comma-dangle': ['error', 'only-multiline'],
    'vue/custom-event-name-casing': 'off',
    'vue/multi-word-component-names': 0, // 驼峰报错-横线
    'vue/require-default-prop': 0, // props默认值
    'vue/valid-define-props': 0, // 引用本地声明的变量
    'vue/v-on-event-hyphenation': 0, // 事件驼峰
    'vue/no-unused-components': 0,
    'vue/no-reserved-component-names': 0,
    'vue/no-v-html': 0,
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
    document: 'readonly',
    localStorage: 'readonly',
    baiduMap: 'readonly',
    window: 'readonly',
    // 腾讯地图
    TMap: 'readonly',
  },
})

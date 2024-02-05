/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    // 当前项目不支持 ts
    // '@vue/eslint-config-typescript/recommended'
  ],
  env: {
    'vue/setup-compiler-macros': true
  },
  rules: {
    "vue/multi-word-component-names": ["error", {
      "ignores": ["index"]
    }],
    "vue/no-setup-props-destructure": ["off"],
    // 支持对 defineProps 解构
    "vue/no-mutating-props": ["off"]
  }
}

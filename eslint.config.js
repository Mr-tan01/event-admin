import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,vue}'] },
  { languageOptions: { globals: globals.browser } },
  {
    ignores: [
      'node_modules/',
      'dist',
      'build/',
      '*.zip',
      'logs/',
      'src/legacy-code.js',
      '*.min.js',
      '*.png',
      '*.jpg',
      '*.jpeg',
      '*.gif',
      '**/*.test.js',
      '!src/index.js'
    ]
  },
  {
    rules: {
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index'] // vue组件名称多单词组成（忽略index.vue）
        }
      ],
      'vue/no-setup-props-destructure': ['off'], // 关闭 props 解构的校验
      // 💡 添加未定义变量错误提示，create-vue@3.6.3 关闭，这里加上是为了支持下一个章节演示。
      'no-undef': 'error'
    }
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs['flat/essential']
]

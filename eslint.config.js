import js from '@eslint/js'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'

export default [
  {
    ignores: ['dist/**']
  },
  {
    ...js.configs.recommended,
    files: ['src/**/*.{js,svelte}']
  },
  ...svelte.configs['flat/recommended'],
  {
    files: ['src/**/*.{js,svelte}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  }
]

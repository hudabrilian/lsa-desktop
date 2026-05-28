const { config, configs } = require('@electron-toolkit/eslint-config-ts')
const prettier = require('@electron-toolkit/eslint-config-prettier')
const reactPlugin = require('eslint-plugin-react')

module.exports = config(
  { ignores: ['node_modules', 'dist', 'out', '.gitignore'] },
  ...configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  prettier,
  {
    files: ['eslint.config.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  }
)

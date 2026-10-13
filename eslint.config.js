const vue = require('eslint-plugin-vue')
const globals = require('globals')

module.exports = [
  ...vue.configs['flat/vue2-essential'],
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      semi: [ 'error', 'never' ],
      // Without semicolons, a line opening with ( [ or ` would join the previous one
      'no-unexpected-multiline': 'error',
      quotes: [ 'error', 'single', { avoidEscape: true } ]
    }
  },
  {
    ignores: [ 'dist/', 'node_modules/' ]
  }
]

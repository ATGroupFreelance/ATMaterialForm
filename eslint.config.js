import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': 'off', // Set this to 'off' to ignore the warning
      'no-unused-vars': [
        "warn", // Change "warn" to "error" if you want it to be an error
        {
          "vars": "all",
          "args": "none" // This will ignore unused function arguments
        }
      ],
      'react/prop-types': 'off',
      'react/display-name': 'off',     
    }
  },
  {
    files: ["src/lib/**/*.{js,jsx}"], // Adjust the path to your directory
    rules: {
      "no-unused-vars": "off" // Disable the rule for this directory
    }
  }
]

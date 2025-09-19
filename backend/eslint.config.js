import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.js'], // Aplica solo a archivos .js
    languageOptions: {
      ecmaVersion: 'latest', // Usa la última versión de ECMAScript
      sourceType: 'module',  // Tu proyecto usa módulos ES
      globals: {
        ...globals.node // Agrega las variables globales de Node.js
      }
    },
    rules: {
      // Reglas recomendadas para Node.js/Express
      'semi': ['error', 'never'], // Sin punto y coma (consistente con frontend)
      'quotes': ['error', 'single'], // Comillas simples
      'indent': ['error', 2], // Indentación de 2 espacios
      'no-console': 'off', // Permitir console.log en backend
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'comma-dangle': ['error', 'never'] // Sin coma final
    }
  },
  js.configs.recommended // Aplica las reglas recomendadas por ESLint
])
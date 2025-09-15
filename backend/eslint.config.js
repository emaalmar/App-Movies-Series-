import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.js"], // Aplica solo a archivos .js
    languageOptions: {
      ecmaVersion: 'latest', // Usa la última versión de ECMAScript
      sourceType: 'module',  // Tu proyecto usa módulos ES
      globals: {
        ...globals.node // Agrega las variables globales de Node.js
      }
    },
    rules: {
      // Aquí puedes añadir reglas personalizadas si quieres
      // Por ejemplo: 'semi': ['error', 'always']
    }
  },
  js.configs.recommended // Aplica las reglas recomendadas por ESLint
]);
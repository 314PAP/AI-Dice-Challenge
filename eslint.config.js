/**
 * @file ESLint Configuration for AI Dice Game
 * @description Základní ESLint konfigurace pro projekt
 */

// Importujeme základní ESLint konfiguraci z JS balíčku
import js from '@eslint/js';

// Definujeme vlastní pravidla
const customRules = {
  'no-unused-vars': 'warn',      // Pouze varuje při nepoužitých proměnných
  'no-console': 'off',           // Povoluje konzolové výpisy
  'no-debugger': 'warn',         // Varuje před debugger příkazy
  'quotes': ['warn', 'single'],  // Preferuje jednoduché uvozovky, pouze warning
  'semi': ['warn', 'always']     // Vyžaduje středníky, pouze warning
};

// Exportujeme finální konfiguraci
export default [
  // Výchozí ESLint pravidla
  js.configs.recommended,
  
  // Vlastní nastavení a přepisy pro projekt
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'archive/**',
      '*.min.js',
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        'document': 'readonly',
        'window': 'readonly',
        'console': 'readonly',
        'alert': 'readonly',
        'setTimeout': 'readonly',
        'clearTimeout': 'readonly',
      }
    },
    rules: customRules,
    linterOptions: {
      reportUnusedDisableDirectives: 'warn',
      noInlineConfig: false
    }
  }
];

/**
 * @file ESLint Configuration for AI Dice Game
 * @description Základní ESLint konfigurace pro projekt
 */

// Importujeme základní ESLint konfiguraci z JS balíčku
import js from '@eslint/js';

// Definujeme vlastní pravidla
const customRules = {
  'no-unused-vars': ['warn', {
    'vars': 'all',
    'args': 'after-used',
    'ignoreRestSiblings': true,
    'varsIgnorePattern': '^_',
    'argsIgnorePattern': '^_'
  }],                           // Pouze varuje při nepoužitých proměnných s lepší kontrolou
  'no-console': 'off',          // Povoluje konzolové výpisy
  'no-debugger': 'warn',        // Varuje před debugger příkazy
  'quotes': ['warn', 'single'], // Preferuje jednoduché uvozovky, pouze warning
  'semi': ['warn', 'always'],   // Vyžaduje středníky, pouze warning
  'no-undef': 'warn'           // Pouze varování pro nedefinované proměnné
};

// Exportujeme finální konfiguraci
export default [
  // Ignore pravidla - MUSÍ být na prvním místě
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'archive/**/*',
      '**/*.min.js',
      'backend-example.js',
      'emergency-fix.js',
      'debug-functions.js',
      'postcss.config.js'
    ]
  },
  
  // Výchozí ESLint pravidla
  js.configs.recommended,
  
  // Vlastní nastavení a přepisy pro projekt
  {
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
        'setInterval': 'readonly',
        'clearInterval': 'readonly',
        'localStorage': 'readonly',
        'sessionStorage': 'readonly',
        'fetch': 'readonly',
        'MutationObserver': 'readonly',
        'HTMLElement': 'readonly',
        'CustomEvent': 'readonly',
        'Event': 'readonly',
      }
    },
    rules: customRules,
    linterOptions: {
      reportUnusedDisableDirectives: 'warn',
      noInlineConfig: false
    }
  }
];

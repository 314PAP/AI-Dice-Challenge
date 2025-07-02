/**
 * 🛡️ Enhanced Error Handling
 * Pokročilý systém pro zpracování chyb s využitím funkcionálního programování
 */

import { curry, pipe, tap, tryCatch } from 'ramda';

/**
 * Vlastní typy chyb pro lepší klasifikaci
 */
export class GameError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'GameError';
    this.code = options.code || 'GAME_ERROR';
    this.context = options.context || {};
  }
}

export class UIError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'UIError';
    this.code = options.code || 'UI_ERROR';
    this.context = options.context || {};
  }
}

export class NetworkError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'NetworkError';
    this.code = options.code || 'NETWORK_ERROR';
    this.context = options.context || {};
  }
}

/**
 * Vytvoří bezpečnou funkci, která nikdy nespadne
 * @param {Function} fn - Funkce, kterou chceme udělat bezpečnou
 * @param {*} fallbackValue - Hodnota, která se vrátí v případě chyby
 * @param {string} operationName - Název operace pro logování
 * @returns {Function} Bezpečná funkce, která nikdy nespadne
 */
export const tryCatchWithLogging = curry((fn, fallbackValue, operationName = 'Operation') => {
  return tryCatch(
    // Hlavní funkce
    pipe(
      fn,
      tap(result => console.log(`✅ ${operationName} completed successfully`, { result }))
    ),
    
    // Error handler
    err => {
      console.error(`❌ Error in ${operationName}:`, err);
      
      // Logování do monitorovacího systému (pokud existuje)
      if (window.errorReporter && typeof window.errorReporter.report === 'function') {
        window.errorReporter.report(err, {
          operation: operationName,
          timestamp: new Date().toISOString()
        });
      }
      
      // Vrácení fallback hodnoty
      return fallbackValue;
    }
  );
});

/**
 * Validuje vstupní hodnotu podle schématu
 * @param {Object} schema - Schéma pro validaci
 * @param {*} value - Hodnota k validaci
 * @returns {Object} Výsledek validace { isValid, value, errors }
 */
export const validateInput = curry((schema, value) => {
  const result = { isValid: true, value, errors: [] };
  
  // Kontrola typu
  if (schema.type && typeof value !== schema.type) {
    result.isValid = false;
    result.errors.push(`Expected type ${schema.type}, got ${typeof value}`);
  }
  
  // Kontrola hodnoty čísla
  if (schema.type === 'number') {
    // Kontrola minimální hodnoty
    if (schema.min !== undefined && value < schema.min) {
      result.isValid = false;
      result.errors.push(`Value ${value} is less than minimum ${schema.min}`);
    }
    
    // Kontrola maximální hodnoty
    if (schema.max !== undefined && value > schema.max) {
      result.isValid = false;
      result.errors.push(`Value ${value} is greater than maximum ${schema.max}`);
    }
  }
  
  // Kontrola řetězce
  if (schema.type === 'string') {
    // Kontrola minimální délky
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      result.isValid = false;
      result.errors.push(`String length ${value.length} is less than minimum ${schema.minLength}`);
    }
    
    // Kontrola maximální délky
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      result.isValid = false;
      result.errors.push(`String length ${value.length} is greater than maximum ${schema.maxLength}`);
    }
    
    // Kontrola formátu pomocí regulárního výrazu
    if (schema.pattern && !schema.pattern.test(value)) {
      result.isValid = false;
      result.errors.push('String does not match required pattern');
    }
  }
  
  return result;
});

/**
 * Vytvoří validátor, který buď vrátí validovanou hodnotu, nebo vyhodí výjimku
 * @param {Object} schema - Schéma pro validaci
 * @returns {Function} Validační funkce
 */
export const createValidator = curry((schema, value) => {
  const result = validateInput(schema, value);
  
  if (!result.isValid) {
    throw new GameError(`Validation failed: ${result.errors.join(', ')}`, { 
      code: 'VALIDATION_ERROR', 
      context: { schema, value, errors: result.errors }
    });
  }
  
  return value;
});

// Export pro použití v jiných modulech
export const safeExecute = tryCatchWithLogging;

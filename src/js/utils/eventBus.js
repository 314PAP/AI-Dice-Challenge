/**
 * 🚌 Enhanced Event Bus
 * Centrální event bus postavený na knihovně mitt pro komunikaci mezi komponentami
 */

import mitt from 'mitt';
import { curry, pipe, tap } from 'ramda';
import { memoize } from 'lodash-es';
import { safeExecute } from './gameUtils.js';

// Vytvoření instance mitt eventemitteru
const emitter = mitt();

// Konstanty pro události
export const GAME_EVENTS = {
  // Herní události
  GAME_STARTED: 'game:started',
  GAME_ENDED: 'game:ended',
  TURN_STARTED: 'turn:started',
  TURN_ENDED: 'turn:ended',
  DICE_ROLLED: 'dice:rolled',
  SCORE_UPDATED: 'score:updated',
  PLAYER_SWITCHED: 'player:switched',
  GAME_WON: 'game:won',
  
  // Chat události
  CHAT_MESSAGE_SENT: 'chat:message:sent',
  CHAT_MESSAGE_RECEIVED: 'chat:message:received',
  CHAT_CLEARED: 'chat:cleared',
  CHAT_TOGGLED: 'chat:toggled',
  
  // UI události
  MODAL_OPENED: 'modal:opened',
  MODAL_CLOSED: 'modal:closed',
  HALL_OF_FAME_OPENED: 'hall-of-fame:opened',
  HALL_OF_FAME_CLOSED: 'hall-of-fame:closed',
  
  // AI události
  AI_REACTION: 'ai:reaction',
  AI_THINKING: 'ai:thinking',
  AI_DECISION: 'ai:decision'
};

// Funkce pro vytváření event handleru s logováním
export const createEventHandler = curry((eventType, handler) => {
  return (...args) => {
    console.log(`🎮 Event triggered: ${eventType}`, ...args);
    return safeExecute(handler, null, `Event handler for ${eventType}`)(...args);
  };
});

// Funkce pro bezpečné přihlášení k událostem
export const safeOn = curry((eventType, handler) => {
  const safeHandler = createEventHandler(eventType, handler);
  emitter.on(eventType, safeHandler);
  
  // Vrátíme funkci pro odhlášení, což umožňuje snadné cleanup
  return () => emitter.off(eventType, safeHandler);
});

// Funkce pro bezpečné publikování událostí
export const safeEmit = curry((eventType, payload) => {
  console.log(`📢 Emitting event: ${eventType}`, payload);
  emitter.emit(eventType, payload);
});

/**
 * Vytvoří kompozitní handler, který se spustí pro více událostí
 * @param {Array<string>} eventTypes - Pole typů událostí
 * @param {Function} handler - Handler, který se má spustit
 * @returns {Array<Function>} Pole funkcí pro odregistraci
 */
export const onMultiple = curry((eventTypes, handler) => {
  return eventTypes.map(eventType => safeOn(eventType, handler));
});

/**
 * Odregistruje více handlerů najednou
 * @param {Array<Function>} unsubscribeFunctions - Pole funkcí pro odregistraci
 */
export const offMultiple = (unsubscribeFunctions) => {
  unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
};

// Export základního emitteru pro přímé použití
export { emitter };

// Export jednoduchého rozhraní pro práci s událostmi
export const eventBus = {
  on: safeOn,
  emit: safeEmit,
  onMultiple,
  offMultiple
};

// Exportujeme výchozí hodnotu pro jednoduchý import
export default eventBus;

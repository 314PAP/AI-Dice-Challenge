/**
 * 🎯 Event Manager
 * Správa událostí s využitím mitt
 */

import mitt from 'mitt';
import { debounce, throttle } from 'lodash-es';

/**
 * Správce událostí
 */
export class EventManager {
    constructor() {
        this.emitter = mitt();
        this.handlers = new Map();
        this.initialized = false;
    }

    /**
     * Inicializace event managera
     */
    initialize() {
        this.setupGlobalHandlers();
        this.initialized = true;
        console.log('🎯 Event Manager initialized');
    }

    /**
     * Nastavení globálních handlerů
     */
    setupGlobalHandlers() {
        // Debounced resize handler
        const resizeHandler = debounce(() => {
            this.emit('window:resize', {
                width: window.innerWidth,
                height: window.innerHeight
            });
        }, 100);

        // Throttled scroll handler
        const scrollHandler = throttle(() => {
            this.emit('window:scroll', {
                x: window.scrollX,
                y: window.scrollY
            });
        }, 16);

        window.addEventListener('resize', resizeHandler);
        window.addEventListener('scroll', scrollHandler);

        // Keyboard handlers
        document.addEventListener('keydown', (e) => {
            this.emit('keyboard:keydown', e);
        });

        document.addEventListener('keyup', (e) => {
            this.emit('keyboard:keyup', e);
        });

        // Mouse handlers
        document.addEventListener('click', (e) => {
            this.emit('mouse:click', e);
        });

        document.addEventListener('contextmenu', (e) => {
            this.emit('mouse:contextmenu', e);
        });

        // Touch handlers for mobile
        document.addEventListener('touchstart', (e) => {
            this.emit('touch:start', e);
        });

        document.addEventListener('touchend', (e) => {
            this.emit('touch:end', e);
        });

        // Focus handlers
        document.addEventListener('focusin', (e) => {
            this.emit('focus:in', e);
        });

        document.addEventListener('focusout', (e) => {
            this.emit('focus:out', e);
        });
    }

    /**
     * Emitování události
     */
    emit(type, data) {
        this.emitter.emit(type, data);
    }

    /**
     * Přidání listenera
     */
    on(type, handler) {
        this.emitter.on(type, handler);
        
        // Sledování handlerů pro cleanup
        if (!this.handlers.has(type)) {
            this.handlers.set(type, new Set());
        }
        this.handlers.get(type).add(handler);
        
        return () => this.off(type, handler);
    }

    /**
     * Odebrání listenera
     */
    off(type, handler) {
        this.emitter.off(type, handler);
        
        if (this.handlers.has(type)) {
            this.handlers.get(type).delete(handler);
        }
    }

    /**
     * Jednorázový listener
     */
    once(type, handler) {
        const wrappedHandler = (data) => {
            handler(data);
            this.off(type, wrappedHandler);
        };
        
        this.on(type, wrappedHandler);
        return () => this.off(type, wrappedHandler);
    }

    /**
     * Vyčištění všech listenerů
     */
    clear() {
        this.emitter.all.clear();
        this.handlers.clear();
    }

    /**
     * Vyčištění listenerů pro konkrétní typ
     */
    clearType(type) {
        if (this.handlers.has(type)) {
            this.handlers.get(type).forEach(handler => {
                this.off(type, handler);
            });
        }
    }

    /**
     * Delay pro události
     */
    emitDelayed(type, data, delay = 0) {
        setTimeout(() => {
            this.emit(type, data);
        }, delay);
    }

    /**
     * Asynchronní emit
     */
    async emitAsync(type, data) {
        return new Promise((resolve) => {
            this.emit(type, { ...data, resolve });
        });
    }

    /**
     * Podmíněný emit
     */
    emitIf(condition, type, data) {
        if (condition) {
            this.emit(type, data);
        }
    }

    /**
     * Batch emit - více událostí najednou
     */
    emitBatch(events) {
        events.forEach(({ type, data }) => {
            this.emit(type, data);
        });
    }

    /**
     * Statistiky
     */
    getStats() {
        const stats = {
            totalTypes: this.handlers.size,
            totalHandlers: 0,
            types: {}
        };

        this.handlers.forEach((handlers, type) => {
            stats.totalHandlers += handlers.size;
            stats.types[type] = handlers.size;
        });

        return stats;
    }

    /**
     * Debug info
     */
    debug() {
        console.log('🎯 Event Manager Stats:', this.getStats());
        console.log('🎯 Active handlers:', this.handlers);
    }
}

export default EventManager;

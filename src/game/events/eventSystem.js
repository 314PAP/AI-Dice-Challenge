/**
 * AI Dice Challenge - Event System
 * Centralizovaný systém pro správu událostí
 */

export class EventSystem {
    constructor() {
        this.listeners = new Map();
    }

    /**
     * Inicializuje event systém
     */
    async initialize() {
        console.log('📡 Inicializuji Event System...');
        this.listeners.clear();
        console.log('✅ Event System připraven');
    }

    /**
     * Přidá event listener
     */
    on(eventName, callback) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }
        this.listeners.get(eventName).push(callback);
    }

    /**
     * Odebere event listener
     */
    off(eventName, callback) {
        if (!this.listeners.has(eventName)) return;
        
        const listeners = this.listeners.get(eventName);
        const index = listeners.indexOf(callback);
        
        if (index > -1) {
            listeners.splice(index, 1);
        }
    }

    /**
     * Emituje event
     */
    emit(eventName, data = null) {
        if (!this.listeners.has(eventName)) return;
        
        const listeners = this.listeners.get(eventName);
        listeners.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Chyba v event listeneru pro ${eventName}:`, error);
            }
        });
    }

    /**
     * Přidá listener, který se spustí pouze jednou
     */
    once(eventName, callback) {
        const onceCallback = (data) => {
            callback(data);
            this.off(eventName, onceCallback);
        };
        this.on(eventName, onceCallback);
    }

    /**
     * Odebere všechny listenery pro event
     */
    removeAllListeners(eventName = null) {
        if (eventName) {
            this.listeners.delete(eventName);
        } else {
            this.listeners.clear();
        }
    }

    /**
     * Získá počet listenerů pro event
     */
    getListenerCount(eventName) {
        return this.listeners.has(eventName) 
            ? this.listeners.get(eventName).length 
            : 0;
    }

    /**
     * Vypíše debug informace
     */
    debugInfo() {
        console.log('🔍 Event System Debug:');
        for (const [eventName, listeners] of this.listeners) {
            console.log(`  ${eventName}: ${listeners.length} listeners`);
        }
    }
}

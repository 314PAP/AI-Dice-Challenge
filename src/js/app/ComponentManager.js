/**
 * 🎲 AI Dice Challenge - Component Manager
 * 
 * Modulární správa UI komponent pomocí lodash utilities
 * Redukuje komplexnost main.js
 */

// Lodash utilities (načteno z CDN)  
const { isEmpty, isFunction, forEach, map, throttle } = _;
import { GameUI } from '../ui/gameUI.js';
import ChatUI from '../ui/chatUI.js';
import UltraBootstrapAutocomplete from '../ui/autocomplete.js';
import { updateDiceForOrientation } from '../ui/uiComponents.js';

/**
 * Správce UI komponent
 */
export class ComponentManager {
    constructor() {
        this.components = {};
        this.initialized = false;
    }

    /**
     * Inicializuje všechny komponenty
     */
    async initializeComponents() {
        if (this.initialized) {
            console.warn('⚠️ Komponenty už jsou inicializované');
            return;
        }

        try {
            // Lodash-based component initialization
            const componentConfig = {
                gameUI: () => new GameUI(),
                chatUI: () => new ChatUI(),
                autocomplete: () => this.initializeAutocomplete()
            };

            // Lodash forEach pro inicializaci
            await Promise.all(
                map(componentConfig, async (factory, name) => {
                    try {
                        console.log(`🔧 Inicializuji komponentu: ${name}`);
                        this.components[name] = await factory();
                        console.log(`✅ Komponenta ${name} inicializována`);
                    } catch (error) {
                        console.error(`❌ Chyba při inicializaci ${name}:`, error);
                        throw error;
                    }
                })
            );

            // Specifické nastavení
            this.setupOrientationUpdates();
            
            this.initialized = true;
            console.log('✅ Všechny komponenty inicializovány');
            
        } catch (error) {
            console.error('❌ Chyba při inicializaci komponent:', error);
            throw error;
        }
    }

    /**
     * Inicializuje autocomplete - zjednodušeno pomocí lodash
     */
    initializeAutocomplete() {
        const chatInput = document.getElementById('chatInput');
        if (!chatInput) {
            console.warn('⚠️ Chat input nenalezen');
            return null;
        }

        // Lodash isEmpty pro kontrolu
        if (isEmpty(chatInput.value)) {
            console.log('🔧 Inicializuji autocomplete...');
        }

        return new UltraBootstrapAutocomplete(chatInput, {
            suggestions: this.getAutocompleteSuggestions(),
            onSelect: (suggestion) => {
                console.log(`📝 Autocomplete: ${suggestion}`);
            }
        });
    }

    /**
     * Vrací autocomplete návrhy
     */
    getAutocompleteSuggestions() {
        return [
            'Kolik bodů mám?',
            'Jaké jsou pravidla?',
            'Ukončit hru',
            'Hoď kostky',
            'Strategie pro výhru',
            'Jak hraje AI?'
        ];
    }

    /**
     * Nastavení aktualizací orientace
     */
    setupOrientationUpdates() {
        // Lodash throttle pro optimalizaci
        const throttledUpdate = throttle(() => {
            updateDiceForOrientation();
        }, 200);

        window.addEventListener('orientationchange', throttledUpdate);
        window.addEventListener('resize', throttledUpdate);
    }

    /**
     * Získá komponentu podle názvu
     */
    getComponent(name) {
        if (!this.components[name]) {
            console.warn(`⚠️ Komponenta '${name}' nenalezena`);
            return null;
        }
        return this.components[name];
    }

    /**
     * Kontrola stavu komponent
     */
    getComponentsStatus() {
        return map(this.components, (component, name) => ({
            name,
            initialized: !isEmpty(component),
            hasInit: isFunction(component?.init),
            hasRender: isFunction(component?.render)
        }));
    }

    /**
     * Vyčištění všech komponent
     */
    cleanup() {
        forEach(this.components, (component, name) => {
            if (isFunction(component?.cleanup)) {
                try {
                    component.cleanup();
                    console.log(`🧹 Komponenta ${name} vyčištěna`);
                } catch (error) {
                    console.error(`❌ Chyba při čištění ${name}:`, error);
                }
            }
        });
        
        this.components = {};
        this.initialized = false;
    }
}

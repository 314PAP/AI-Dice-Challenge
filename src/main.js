/**
 * 🎲 AI Dice Challenge - Modularizovaný hlavní soubor  
 * 
 * Redukováno z 574 řádků na ~100 řádků pomocí lodash a modulů
 * Moduly: AppInitializer, ComponentManager, LayoutManager
 */

// Lodash utilities (načteno z CDN)
const { isEmpty, isFunction } = _;

// Modularizované třídy
import { AppInitializer } from './js/app/AppInitializer.js';
import { ComponentManager } from './js/app/ComponentManager.js';
import { LayoutManager } from './js/app/LayoutManager.js';

// Utility importy
import soundSystem from './js/utils/soundSystem.js';
import { CONSOLE_COLORS } from './js/utils/colors.js';

/**
 * Hlavní aplikace - zjednodušená pomocí modulů
 */
class AIDiceGame {
    constructor() {
        console.log('🎲 AI Dice Challenge - Modular Edition starting...');
        
        // Moduly pro zjednodušení
        this.initializer = new AppInitializer();
        this.componentManager = new ComponentManager();
        this.layoutManager = new LayoutManager();
        
        this.init();
    }

    /**
     * Hlavní inicializace - zjednodušená
     */
    async init() {
        try {
            // 1. Čekání na DOM
            await this.initializer.waitForDOM();
            
            // 2. Skrytí loading screen
            this.initializer.hideLoadingScreen();
            
            // 3. Inicializace komponent
            await this.componentManager.initializeComponents();
            
            // 4. Nastavení event listenerů
            this.initializer.setupEventListeners();
            
            // 5. Spuštění layout monitoringu
            this.layoutManager.startLayoutMonitoring();
            
            // 6. Finální kontroly
            await this.performFinalChecks();
            
            console.log('✅ AI Dice Challenge initialized!');
            
        } catch (error) {
            console.error('❌ App init failed:', error);
            this.initializer.showError('Chyba při načítání aplikace.');
        }
    }

    /**
     * Finální kontroly - s lodash optimalizací
     */
    async performFinalChecks() {
        // Krátká pauza pro stabilizaci
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Kontrola komponent
        const componentStatus = this.componentManager.getComponentsStatus();
        const allInitialized = componentStatus.every(c => c.initialized);
        
        if (!allInitialized) {
            console.warn('⚠️ Některé komponenty nejsou inicializované:', componentStatus);
        }
        
        // Kontrola layoutu
        const layoutValid = this.layoutManager.validateLayout();
        if (!layoutValid.valid) {
            console.warn('⚠️ Layout problémy detekované');
            this.layoutManager.fixLayout();
        }
        
        // Test zvukového systému
        this.testSoundSystem();
        
        // Výpis stavu
        this.logAppStatus();
    }

    /**
     * Test zvukového systému
     */
    testSoundSystem() {
        try {
            // Test zvukového systému - ověříme, že existuje
            if (soundSystem && soundSystem.enabled !== undefined) {
                console.log(`🎵 Zvukový systém: ${soundSystem.enabled ? 'AKTIVNÍ' : 'NEAKTIVNÍ'}`);
            } else {
                console.warn('⚠️ Zvukový systém nenačten');
            }
        } catch (error) {
            console.error('❌ Chyba v zvukovém systému:', error);
        }
    }

    /**
     * Výpis stavu aplikace
     */
    logAppStatus() {
        const status = {
            components: this.componentManager.getComponentsStatus().length,
            layout: this.layoutManager.isLayoutValid ? 'OK' : 'ISSUES',
            sounds: soundSystem && soundSystem.enabled ? 'OK' : 'OFF'
        };
        
        console.log(
            '%c🎮 APP STATUS %c Components: %c%d %c Layout: %c%s %c Sounds: %c%s',
            `background: ${CONSOLE_COLORS.bgDark}; color: ${CONSOLE_COLORS.neonGreen}; font-weight: bold; padding: 2px 6px;`,
            `color: ${CONSOLE_COLORS.textDark};`,
            `color: ${CONSOLE_COLORS.neonBlue}; font-weight: bold;`,
            status.components,
            `color: ${CONSOLE_COLORS.textDark};`,
            `color: ${status.layout === 'OK' ? CONSOLE_COLORS.neonGreen : CONSOLE_COLORS.neonYellow}; font-weight: bold;`,
            status.layout,
            `color: ${CONSOLE_COLORS.textDark};`,
            `color: ${status.sounds === 'OK' ? CONSOLE_COLORS.neonGreen : CONSOLE_COLORS.neonYellow}; font-weight: bold;`,
            status.sounds
        );
    }

    /**
     * Získání komponenty
     */
    getComponent(name) {
        return this.componentManager.getComponent(name);
    }

    /**
     * Čištění při uzavření aplikace
     */
    cleanup() {
        this.layoutManager.stopLayoutMonitoring();
        this.componentManager.cleanup();
        this.initializer.cleanup();
        console.log('🧹 Aplikace vyčištěna');
    }
}

// Globální instance pro debugging
window.AIDiceGame = AIDiceGame;

// Spuštění aplikace
const app = new AIDiceGame();

// Čištění při odchodu ze stránky
window.addEventListener('beforeunload', () => {
    app.cleanup();
});

export default app;

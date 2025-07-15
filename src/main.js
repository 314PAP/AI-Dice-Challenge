/**
 * AI Dice Challenge - Main Application Entry Point
 * Modularizovaná hra kostek s AI - ES6 moduly + Bootstrap
 */

async function waitForLodash() {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 50; // 5 sekund (50 × 100ms)
        
        const checkLodash = () => {
            attempts++;
            
            if (typeof _ !== 'undefined') {
                console.log('✅ Lodash dostupný po', attempts * 100, 'ms');
                resolve();
            } else if (attempts >= maxAttempts) {
                console.error('❌ Lodash se nenačetl po 5 sekundách');
                reject(new Error('Lodash timeout'));
            } else {
                setTimeout(checkLodash, 100);
            }
        };
        
        checkLodash();
    });
}

// Čekání na Lodash před inicializací
await waitForLodash();

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
        console.log('🎲 AI Dice Challenge starting...');
        
        try {
            this.initializer = new AppInitializer();
            this.componentManager = new ComponentManager();
            this.layoutManager = new LayoutManager();
            this.init();
        } catch (error) {
            console.error('❌ Init error:', error);
            throw error;
        }
    }

    /**
     * Hlavní inicializace
     */
    async init() {
        try {
            // Zaznamenej čas startu pro minimum 2 sekundy loading
            const startTime = Date.now();
            
            // 1. DOM ready
            await this.initializer.waitForDOM();
            
            // 2. Basic components
            await this.componentManager.initializeComponents();
            
            // Ujisti se, že loading trvá alespoň 3 sekundy pro dokončení animace
            const elapsedTime = Date.now() - startTime;
            const minLoadingTime = 3000; // 3 sekundy pro neonovou animaci
            if (elapsedTime < minLoadingTime) {
                await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
            }
            
            // 3. Hide loading
            console.log('🎬 Volám hideLoadingScreen...');
            this.initializer.hideLoadingScreen();
            console.log('✅ hideLoadingScreen dokončen');
            
            // Malé zpoždění pro jistotu
            await new Promise(resolve => setTimeout(resolve, 600));
            
            // 4. GameUI init
            await this.componentManager.initializeGameUI();
            
            // 5. Event listeners
            this.initializer.setupEventListeners();
            
            // 6. Layout monitoring
            this.layoutManager.startLayoutMonitoring();
            
            // 7. Final checks
            await this.performFinalChecks();
            
            console.log('✅ AI Dice Challenge ready!');
            
        } catch (error) {
            console.error('❌ Init failed:', error);
            this.initializer.showError('Chyba při načítání aplikace.');
        }
    }

    /**
     * Přidá uvítací zprávy do chatu
     */
    /**
     * Finální kontroly
     */
    async performFinalChecks() {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const componentStatus = this.componentManager.getComponentsStatus();
        const allInitialized = componentStatus.every(c => c.initialized);
        
        if (!allInitialized) {
            console.warn('⚠️ Components not ready:', componentStatus);
        }
        
        const layoutValid = this.layoutManager.validateLayout();
        if (!layoutValid.valid) {
            console.warn('⚠️ Layout issues detected');
            this.layoutManager.fixLayout();
        }
        
        this.testSoundSystem();
        this.logAppStatus();
    }

    testSoundSystem() {
        try {
            if (soundSystem && soundSystem.enabled !== undefined) {
                console.log(`🎵 Sound: ${soundSystem.enabled ? 'ON' : 'OFF'}`);
            } else {
                console.warn('⚠️ Sound system missing');
            }
        } catch (error) {
            console.error('❌ Sound error:', error);
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
        
        console.log(`🎮 Status: ${status.components} components, Layout ${status.layout}, Sounds ${status.sounds}`);
    }

    getComponent(name) {
        return this.componentManager.getComponent(name);
    }

    cleanup() {
        this.layoutManager.stopLayoutMonitoring();
        this.componentManager.cleanup();
        this.initializer.cleanup();
        console.log('🧹 App cleaned');
    }
}

// Globální instance pro debugging
window.AIDiceGame = AIDiceGame;

async function initializeApp() {
    try {
        console.log('🚀 Spouštím inicializaci aplikace...');
        
        // Spuštění aplikace
        const app = new AIDiceGame();
        
        // Čištění při odchodu ze stránky
        window.addEventListener('beforeunload', () => {
            app.cleanup();
        });
        
        // Export pro debugging
        window.app = app;
        
        console.log('🎯 Aplikace úspěšně inicializována');
        return app;
        
    } catch (error) {
        console.error('❌ Kritická chyba při inicializaci aplikace:', error);
        
        // Zobrazení chyby uživateli
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div class="text-center text-danger">
                    <h3>❌ Chyba při načítání aplikace</h3>
                    <p>${error.message}</p>
                    <button class="btn btn-danger" onclick="location.reload()">Obnovit stránku</button>
                </div>
            `;
        }
        
        throw error;
    }
}

// Spuštění inicializace
const app = await initializeApp();

// DEBUG: Force loading screen removal after 3 seconds
setTimeout(() => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen && loadingScreen.style.display !== 'none') {
        console.log('🚨 EMERGENCY: Force removing stuck loading screen!');
        loadingScreen.remove();
        const app = document.getElementById('app');
        if (app) {
            app.classList.remove('d-none');
            app.style.display = 'flex';
        }
    }
}, 3000);

export default app;

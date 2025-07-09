/**
 * 🎲 AI Dice Challenge - Hlavní aplikační soubor
 * 
 * Hlavní vstupní bod aplikace, který propojuje všechny moduly
 * 100% Bootstrap utility třídy, modulární struktura, žádné hardcoded styly
 */

// Importy z herních modulů
import gameState from './js/game/gameState.js';
import * as diceMechanics from './js/game/diceMechanics.js';

// Importy z AI modulů
import chatSystem from './js/ai/chatSystem.js';
import { aiPersonalities, getAiDecision } from './js/ai/personalities.js';

// Importy z UI modulů
import GameUI from './js/ui/gameUI.js';
import ChatUI from './js/ui/chatUI.js';
import UltraBootstrapAutocomplete from './js/ui/autocomplete.js';

// Importy z utility modulů
import { GAME_CONSTANTS, STORAGE_KEYS } from './js/utils/constants.js';
import { sleep, loadFromLocalStorage, saveToLocalStorage } from './js/utils/helpers.js';

/**
 * Hlavní třída aplikace, která propojuje všechny komponenty
 */
class AIDiceGame {
    constructor() {
        console.log('🎲 AI Dice Challenge - Bootstrap-First Modular Edition starting...');
        
        this.gameUI = null;
        this.chatUI = null;
        this.chatAutocomplete = null;
        
        this.init();
    }

    /**
     * Inicializuje aplikaci
     */
    async init() {
        try {
            await this.waitForDOM();
            
            // 🔍 DEBUG: Kontrola výšek před inicializací
            this.debugAppHeight('PŘED inicializací');
            
            // 🔍 DEBUG: Nastavení MutationObserver pro sledování kritických změn
            this.setupMutationObserver();
            
            this.hideLoadingScreen();
            
            // 🔍 DEBUG: Kontrola výšek po skrytí loading screen
            this.debugAppHeight('PO skrytí loading screen');
            
            this.initializeComponents();
            
            // 🔍 DEBUG: Kontrola výšek po inicializaci komponent
            this.debugAppHeight('PO inicializaci komponent');
            
            this.setupEventListeners();
            console.log('✅ AI Dice Challenge initialized!');
            
            // 🔍 DEBUG: Finální kontrola výšek
            this.debugAppHeight('FINÁLNĚ');
            
            // Po úspěšné inicializaci vypíšeme stav layoutu
            setTimeout(() => {
                const gameCol = document.querySelector('.col-12.col-sm-8');
                const chatCol = document.querySelector('.col-12.col-sm-4');
                if (gameCol && chatCol && gameCol.offsetHeight > 0 && chatCol.offsetHeight > 0) {
                    const ratio = Math.round(gameCol.offsetHeight / chatCol.offsetHeight * 100) / 100;
                    console.log(
                        `✅ BOOTSTRAP LAYOUT: Game:Chat = ${ratio} ${ratio >= 1.5 ? '(Optimální)' : '(Suboptimální)'}`
                    );
                }
            }, 500);
            
        } catch (error) {
            console.error('❌ App init failed:', error);
            this.showError('Chyba při načítání aplikace.');
        }
    }

    /**
     * Čeká na načtení DOM
     */
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    /**
     * Skryje úvodní načítací obrazovku
     */
    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            const app = document.getElementById('app');
            
            if (loadingScreen && app) {
                // Uložení původních tříd pro možné debugování
                const originalClasses = app.className;
                
                loadingScreen.classList.add('animate__animated', 'animate__fadeOut');
                app.classList.remove('d-none');
                app.classList.add('animate__animated', 'animate__fadeIn');
                
                // 🔍 DEBUG: Kontrola změn tříd - pouze pokud je skutečný rozdíl
                if (originalClasses !== app.className) {
                    this.debugAppHeight('PO změně visibility tříd');
                }
                
                setTimeout(() => loadingScreen.remove(), 800);
            }
        }, 500);
    }

    /**
     * Inicializuje komponenty aplikace
     */
    initializeComponents() {
        // Inicializace UI komponent
        this.gameUI = new GameUI();
        this.chatUI = new ChatUI();
        
        // Odstranění případných starých autocomplete elementů
        this.removeAutocompleteDropdowns();
        
        // Autocomplete je dočasně vypnut kvůli responsive problémům
        // const chatInput = document.getElementById('chatInput');
        // if (chatInput) {
        //     const chatHistory = chatSystem.getChatHistory();
        //     this.chatAutocomplete = new UltraBootstrapAutocomplete(chatInput, {
        //         suggestions: chatHistory,
        //         maxResults: 8,
        //         neonColor: 'blue',
        //         storageKey: STORAGE_KEYS.CHAT_HISTORY
        //     });
        // }
        
        // Načtení uložených nastavení
        this.loadGameSettings();
        
        // Přidání uvítacích zpráv
        this.chatUI.addWelcomeMessages();
        
        // Trigger initial render of UI
        this.gameUI.renderUI(gameState.getState());
    }

    /**
     * Nastaví event listenery pro aplikaci
     */
    setupEventListeners() {
        // Příklad globálního event listeneru
        document.addEventListener('game-end', this.handleGameEnd.bind(this));
    }

    /**
     * Zpracuje událost konce hry
     * @param {CustomEvent} event - Událost konce hry
     */
    handleGameEnd(event) {
        const { winner } = event.detail;
        console.log(`Hra skončila! Vítěz: ${winner}`);
        
        // Aktualizace síně slávy
        this.updateHallOfFame(winner);
    }

    /**
     * Načte herní nastavení z localStorage
     */
    loadGameSettings() {
        const settings = loadFromLocalStorage(STORAGE_KEYS.GAME_SETTINGS, {
            targetScore: GAME_CONSTANTS.DEFAULT_TARGET_SCORE
        });
        
        gameState.updateState({ targetScore: settings.targetScore });
    }

    /**
     * Uloží herní nastavení do localStorage
     */
    saveGameSettings() {
        const state = gameState.getState();
        
        saveToLocalStorage(STORAGE_KEYS.GAME_SETTINGS, {
            targetScore: state.targetScore
        });
    }

    /**
     * Aktualizuje síň slávy
     * @param {string} winner - Jméno vítěze
     */
    updateHallOfFame(winner) {
        const hallOfFame = loadFromLocalStorage(STORAGE_KEYS.HALL_OF_FAME, []);
        
        hallOfFame.push({
            name: winner,
            date: new Date().toISOString(),
            score: gameState.getState().targetScore
        });
        
        // Seřazení podle data (nejnovější první)
        hallOfFame.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Omezení na 10 záznamů
        const limitedHallOfFame = hallOfFame.slice(0, 10);
        
        saveToLocalStorage(STORAGE_KEYS.HALL_OF_FAME, limitedHallOfFame);
    }

    /**
     * Zobrazí chybovou hlášku
     * @param {string} message - Text chybové hlášky
     */
    showError(message) {
        // Použijeme SweetAlert2 pro zobrazení chyby
        if (window.Swal) {
            window.Swal.fire({
                title: 'Chyba!',
                text: message,
                icon: 'error',
                confirmButtonText: 'OK',
                background: '#000',
                color: '#fff',
                iconColor: '#ff3131',
                confirmButtonColor: '#194DD1'
            });
        } else {
            alert(`Chyba: ${message}`);
        }
    }

    /**
     * Odstraní všechny autocomplete dropdown elementy ze stránky
     */
    removeAutocompleteDropdowns() {
        const dropdowns = document.querySelectorAll('[style*="z-index: 1050"]');
        dropdowns.forEach(dropdown => {
            if (dropdown.className.includes('position-absolute')) {
                dropdown.remove();
            }
        });
    }

    /**
     * 🔍 DEBUG: Nastavení MutationObserver pro sledování změn DOM
     */
    setupMutationObserver() {
        const app = document.getElementById('app');
        if (!app) return;
        
        // Počítadlo změn - použijeme pro omezení logu jen na důležité změny
        let changeCount = 0;
        // Příznak pro sledování očekávaných změn při inicializaci
        let isInitializing = true;
        
        // Po 3 sekundách už nepovažujeme změny za součást inicializace
        setTimeout(() => {
            isInitializing = false;
            console.log('✅ DEBUG: Inicializační období dokončeno, dále budou hlášeny pouze neočekávané změny');
        }, 3000);

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    // Kontrola kritických změn
                    const hasCriticalChange = this.checkForCriticalChanges(mutation);
                    
                    // Logujeme pouze pokud:
                    // 1. Došlo ke kritické změně (ztráta důležitých tříd)
                    // 2. Nejsme v inicializační fázi
                    // 3. Maximálně 3 logy pro každý typ (zabránění spamu)
                    if (hasCriticalChange && (!isInitializing || changeCount < 3)) {
                        changeCount++;
                        if (mutation.attributeName === 'style') {
                            console.warn('⚠️ ZMĚNA STYLE na #app - zkontrolujte layout!');
                            console.log('Detail změny:', {
                                old: mutation.oldValue,
                                new: mutation.target.getAttribute('style')
                            });
                        } else if (mutation.attributeName === 'class') {
                            console.warn('⚠️ ZMĚNA CLASS na #app - zkontrolujte layout!');
                            console.log('Detail změny:', {
                                old: mutation.oldValue,
                                new: mutation.target.className
                            });
                        }
                        
                        this.debugAppHeight('PO NEOČEKÁVANÉ ZMĚNĚ ATRIBUTU');
                    }
                }
            });
        });

        observer.observe(app, {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: ['style', 'class']
        });

        console.log('🔍 MutationObserver nastaven pro sledování kritických změn layoutu');
    }
    
    /**
     * Kontroluje, zda došlo k důležitým změnám v atributech
     * @param {MutationRecord} mutation - Záznam o změně
     * @returns {boolean} - True pokud došlo k důležité změně, jinak False
     */
    checkForCriticalChanges(mutation) {
        // Kontrola změny class atributu
        if (mutation.attributeName === 'class') {
            const oldClasses = mutation.oldValue ? mutation.oldValue.split(' ') : [];
            const newClasses = mutation.target.className.split(' ');
            
            // Sledujeme pouze ztrátu důležitých tříd (vh-100, overflow-hidden)
            const criticalClasses = ['vh-100', 'overflow-hidden'];
            
            // Kontrola, zda byla odstraněna některá kritická třída
            const lostCriticalClass = criticalClasses.some(cls => 
                oldClasses.includes(cls) && !newClasses.includes(cls)
            );
            
            // Ignorujeme očekávané změny (např. odstranění d-none při inicializaci)
            const isExpectedChange = 
                (oldClasses.includes('d-none') && !newClasses.includes('d-none')) ||
                (!oldClasses.includes('animate__fadeIn') && newClasses.includes('animate__fadeIn'));
                
            return lostCriticalClass && !isExpectedChange;
        }
        
        // Kontrola změny style atributu - vždy považujeme za kritickou
        if (mutation.attributeName === 'style') {
            const oldStyle = mutation.oldValue || '';
            const newStyle = mutation.target.getAttribute('style') || '';
            
            // Pokud došlo k přidání/změně stylu, který ovlivňuje layout
            return newStyle !== oldStyle && 
                   (newStyle.includes('height') || 
                    newStyle.includes('width') || 
                    newStyle.includes('margin') ||
                    newStyle.includes('overflow'));
        }
        
        return false;
    }

    /**
     * 🔍 DEBUG: Funkce pro kontrolu Bootstrap layoutu
     */
    debugAppHeight(stage) {
        // DEBUG přepínač - nastavte na false pro vypnutí všech debug logů
        const ENABLE_DEBUG_LOGS = true;
        
        // Pokud jsou logy vypnuty, nepokračujeme
        if (!ENABLE_DEBUG_LOGS) return;
        
        // Neprovádíme plný debug pro každou drobnou změnu během inicializace
        const isFullDebug = 
            stage === 'PŘED inicializací' || 
            stage === 'FINÁLNĚ' || 
            stage.includes('NEOČEKÁVANÉ');
            
        const app = document.getElementById('app');
        const html = document.documentElement;
        const body = document.body;
        const gameCol = document.querySelector('.col-12.col-sm-8');
        const chatCol = document.querySelector('.col-12.col-sm-4');
        
        // Pro běžné informace používáme jen krátký log bez console.group
        if (!isFullDebug) {
            const isMobile = window.innerWidth <= 575.98;
            const hasScroll = document.documentElement.scrollHeight > window.innerHeight;
            const hasVh100 = app?.classList.contains('vh-100');
            const hasOverflowHidden = app?.classList.contains('overflow-hidden');
            
            // Pro základní kontrolu používáme jednoduché info
            if (gameCol && chatCol && gameCol.offsetHeight > 0 && chatCol.offsetHeight > 0) {
                const ratio = Math.round(gameCol.offsetHeight / chatCol.offsetHeight * 100) / 100;
                console.log(
                    `� Layout ${stage}: ${isMobile ? 'MOBILE' : 'DESKTOP'} ` +
                    `${window.innerWidth}x${window.innerHeight}, ` +
                    `Scroll: ${hasScroll ? 'YES' : 'NO'}, ` +
                    `vh-100: ${hasVh100 ? 'YES' : 'NO'}, ` +
                    `Game:Chat = ${ratio} ${ratio >= 1.5 ? '✅' : '⚠️'}`
                );
            }
            
            return;
        }
        
        // Plný debug log pouze pro důležité fáze
        console.group(`�🔍 BOOTSTRAP LAYOUT DEBUG - ${stage}`);
        
        // Základní viewport info
        const isMobile = window.innerWidth <= 575.98;
        console.log('📱 Viewport:', window.innerWidth, 'x', window.innerHeight, isMobile ? '(MOBILE)' : '(DESKTOP)');
        console.log('📏 Document scroll height:', document.documentElement.scrollHeight);
        console.log('🔄 Has vertical scroll:', document.documentElement.scrollHeight > window.innerHeight ? 'YES' : 'NO');
        
        // App container info
        if (app) {
            console.log('📦 #app container:');
            console.log('  - Bootstrap classes:', app.className);
            console.log('  - Computed height:', window.getComputedStyle(app).height);
            console.log('  - Offset height:', app.offsetHeight, 'px');
            console.log('  - Has vh-100:', app.classList.contains('vh-100') ? 'YES' : 'NO');
            console.log('  - Has overflow-hidden:', app.classList.contains('overflow-hidden') ? 'YES' : 'NO');
        }
        
        // Columns ratio and heights
        if (gameCol && chatCol) {
            console.log('📊 Game column (col-sm-8):');
            console.log('  - Height:', gameCol.offsetHeight, 'px');
            console.log('  - Bootstrap classes:', gameCol.className);
            
            console.log('📊 Chat column (col-sm-4):');
            console.log('  - Height:', chatCol.offsetHeight, 'px');
            console.log('  - Bootstrap classes:', chatCol.className);
            
            const ratio = Math.round(gameCol.offsetHeight / chatCol.offsetHeight * 100) / 100;
            console.log('📊 Game:Chat ratio =', ratio, ratio >= 1.5 ? '(GOOD)' : '(BAD - should be ~2:1)');
        }
        
        console.groupEnd();
    }

}

// Spuštění aplikace
const app = new AIDiceGame();

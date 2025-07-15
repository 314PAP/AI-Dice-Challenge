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
import { CONSOLE_COLORS, pxToRem } from './js/utils/colors.js';
import { updateDiceForOrientation } from './js/ui/uiComponents.js';
import soundSystem from './js/utils/soundSystem.js';

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
                    const isGoodRatio = ratio >= 1.5;
                    
                    // CSS styly pro barevný výstup - používáme definované barvy
                    const successStyle = `background: ${CONSOLE_COLORS.bgDark2}; color: ${CONSOLE_COLORS.neonGreen}; font-weight: bold; padding: ${pxToRem(3)} ${pxToRem(6)}; border-radius: ${pxToRem(3)};`;
                    const valueStyle = `color: ${CONSOLE_COLORS.neonGreen}; font-weight: bold;`;
                    const statusStyle = isGoodRatio 
                        ? `color: ${CONSOLE_COLORS.neonGreen}; font-weight: bold;` 
                        : `color: ${CONSOLE_COLORS.neonYellow}; font-weight: bold;`;
                    
                    console.log(
                        '%c✅ BOOTSTRAP LAYOUT %c Game:Chat = %c%s %c%s',
                        successStyle,
                        `color: ${CONSOLE_COLORS.textDark};`,
                        valueStyle,
                        ratio,
                        statusStyle,
                        isGoodRatio ? '✓ OPTIMÁLNÍ' : '⚠ SUBOPTIMÁLNÍ'
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
     * Skryje úvodní načítací obrazovku s vylepšenými animacemi
     */
    hideLoadingScreen() {
        // Delší čekání pro pěknější loading experience (2 sekundy)
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            const app = document.getElementById('app');
            
            if (loadingScreen && app) {
                // Uložení původních tříd pro možné debugování
                const originalClasses = app.className;
                
                // Přidáme pěknou fade out animaci s delším trváním
                loadingScreen.classList.add('opacity-0');
                loadingScreen.style.transition = 'opacity 0.8s ease-out';
                
                // Zobrazíme hlavní aplikaci s fade in efektem
                app.classList.remove('d-none');
                app.classList.add('opacity-0');
                app.style.transition = 'opacity 0.6s ease-in';
                
                // Po krátké pauze zapneme fade in pro hlavní aplikaci
                setTimeout(() => {
                    app.classList.remove('opacity-0');
                    app.classList.add('opacity-100');
                }, 100);
                
                // 🔍 DEBUG: Kontrola změn tříd - pouze pokud je skutečný rozdíl
                if (originalClasses !== app.className) {
                    this.debugAppHeight('PO změně visibility tříd');
                }
                
                // Odstranění loading screen až po dokončení animace
                setTimeout(() => {
                    if (loadingScreen.parentNode) {
                        loadingScreen.remove();
                    }
                }, 1000);
            }
        }, 2000); // Zvýšeno z 500ms na 2000ms pro delší loading
    }

    /**
     * Inicializuje komponenty aplikace
     */
    initializeComponents() {
        // Inicializace UI komponent
        this.gameUI = new GameUI();
        this.chatUI = new ChatUI();
        
        // 🎵 Inicializace zvukového systému při prvním kliknutí
        this.initializeSoundSystem();
        
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
        
        // Listener pro změnu orientace - aktualizace velikostí kostek
        window.addEventListener('resize', () => {
            // Debounce pro lepší performance
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                updateDiceForOrientation();
            }, 150);
        });
        
        // Listener pro změnu orientace
        window.addEventListener('orientationchange', () => {
            // Trochu delší delay pro orientationchange
            setTimeout(() => {
                updateDiceForOrientation();
            }, 300);
        });
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
     * 🎵 Inicializuje zvukový systém při prvním user interaction
     */
    initializeSoundSystem() {
        let soundInitialized = false;
        
        const initOnFirstClick = () => {
            if (!soundInitialized) {
                soundInitialized = true;
                soundSystem.init();
                console.log('🎵 Zvukový systém inicializován při prvním kliknutí');
                
                // Odstraníme listener po prvním použití
                document.removeEventListener('click', initOnFirstClick);
                document.removeEventListener('touchstart', initOnFirstClick);
            }
        };
        
        // Přidáme listenery pro první user interaction
        document.addEventListener('click', initOnFirstClick);
        document.addEventListener('touchstart', initOnFirstClick);
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
                background: CONSOLE_COLORS.neonBlack,
                color: CONSOLE_COLORS.neonGreen,
                iconColor: CONSOLE_COLORS.neonRed,
                confirmButtonColor: CONSOLE_COLORS.neonBlue
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
            console.log(
                '%c✅ DEBUG %c Inicializační období dokončeno, dále budou hlášeny pouze neočekávané změny',
                `background: ${CONSOLE_COLORS.bgDark2}; color: ${CONSOLE_COLORS.neonGreen}; font-weight: bold; padding: ${pxToRem(3)} ${pxToRem(6)}; border-radius: ${pxToRem(3)};`,
                `color: ${CONSOLE_COLORS.textDark};`
            );
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
                            console.warn(
                                '%c⚠️ UPOZORNĚNÍ %c ZMĚNA STYLE na #app - zkontrolujte layout!',
                                `background: ${CONSOLE_COLORS.bgDark3}; color: ${CONSOLE_COLORS.neonYellow}; font-weight: bold; padding: ${pxToRem(3)} ${pxToRem(6)}; border-radius: ${pxToRem(3)};`,
                                `color: ${CONSOLE_COLORS.neonYellow}; font-weight: bold;`
                            );
                            console.log(
                                '%cPůvodní:%c %s\n%cNový:%c %s',
                                `color: ${CONSOLE_COLORS.textDark};`,
                                `color: ${CONSOLE_COLORS.textLight};`,
                                mutation.oldValue || 'none',
                                `color: ${CONSOLE_COLORS.textDark};`,
                                `color: ${CONSOLE_COLORS.textLight};`,
                                mutation.target.getAttribute('style') || 'none'
                            );
                        } else if (mutation.attributeName === 'class') {
                            console.warn(
                                '%c⚠️ UPOZORNĚNÍ %c ZMĚNA CLASS na #app - zkontrolujte layout!',
                                `background: ${CONSOLE_COLORS.bgDark3}; color: ${CONSOLE_COLORS.neonYellow}; font-weight: bold; padding: ${pxToRem(3)} ${pxToRem(6)}; border-radius: ${pxToRem(3)};`,
                                `color: ${CONSOLE_COLORS.neonYellow}; font-weight: bold;`
                            );
                            console.log(
                                '%cPůvodní:%c %s\n%cNový:%c %s',
                                `color: ${CONSOLE_COLORS.textDark};`,
                                `color: ${CONSOLE_COLORS.textLight};`,
                                mutation.oldValue || 'none',
                                `color: ${CONSOLE_COLORS.textDark};`,
                                `color: ${CONSOLE_COLORS.textLight};`,
                                mutation.target.className
                            );
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
        
        // CSS styly pro barevné rozlišení logů - používáme definované barvy z CONSOLE_COLORS
        const styles = {
            title:    `background: ${CONSOLE_COLORS.neonDarkGray2}; color: ${CONSOLE_COLORS.neonGreen}; font-weight: bold; padding: ${pxToRem(2)} ${pxToRem(5)}; border-radius: ${pxToRem(3)};`,
            success:  `color: ${CONSOLE_COLORS.neonGreen}; font-weight: bold;`,
            warning:  `color: ${CONSOLE_COLORS.neonYellow}; font-weight: bold;`,
            error:    `color: ${CONSOLE_COLORS.neonRed}; font-weight: bold;`,
            info:     `color: ${CONSOLE_COLORS.neonBlue}; font-weight: bold;`,
            label:    `color: ${CONSOLE_COLORS.textDark}; font-weight: normal;`,
            value:    `color: ${CONSOLE_COLORS.neonGreen}; font-weight: bold;`,
            detail:   `color: ${CONSOLE_COLORS.textDark}; font-style: italic;`
        };
        
        // Neprovádíme plný debug pro každou drobnou změnu během inicializace
        const isFullDebug = 
            stage === 'PŘED inicializací' || 
            stage === 'FINÁLNĚ' || 
            stage.includes('NEOČEKÁVANÉ');
            
        const app = document.getElementById('app');
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
                const isGoodRatio = ratio >= 1.5;
                
                console.log(
                    `%cLAYOUT ${stage}%c: ${isMobile ? 'MOBILE' : 'DESKTOP'} ` +
                    `${window.innerWidth}x${window.innerHeight} | ` +
                    `Scroll: ${hasScroll ? '%cYES' : '%cNO'}%c | ` +
                    `vh-100: ${hasVh100 ? '%cYES' : '%cNO'}%c | ` +
                    `Game:Chat = %c${ratio}%c ${isGoodRatio ? '✓ GOOD' : '⚠ SUB-OPTIMAL'}`,
                    styles.title,
                    styles.label,
                    hasScroll ? styles.warning : styles.success,
                    styles.label,
                    hasVh100 ? styles.success : styles.error,
                    styles.label,
                    isGoodRatio ? styles.success : styles.warning,
                    isGoodRatio ? styles.success : styles.warning
                );
            }
            
            return;
        }
        
        // Plný debug log pouze pro důležité fáze
        console.group(`%cBOOTSTRAP LAYOUT DEBUG - ${stage}`, `background: ${CONSOLE_COLORS.bgDark1}; color: ${CONSOLE_COLORS.neonGreen}; font-weight: bold; padding: ${pxToRem(3)} ${pxToRem(5)}; border-radius: ${pxToRem(3)};`);
        
        // Základní viewport info
        const isMobile = window.innerWidth <= 575.98;
        console.log(
            `%c📱 Viewport:%c ${window.innerWidth} × ${window.innerHeight} %c${isMobile ? 'MOBILE' : 'DESKTOP'}`,
            styles.info, styles.value, isMobile ? styles.warning : styles.info
        );
        
        const hasScroll = document.documentElement.scrollHeight > window.innerHeight;
        console.log(
            `%c📏 Document height:%c ${document.documentElement.scrollHeight}px %c${hasScroll ? '(has scroll)' : '(no scroll)'}`,
            styles.info, styles.value, hasScroll ? styles.warning : styles.success
        );
        
        // App container info
        if (app) {
            const hasVh100 = app.classList.contains('vh-100');
            const hasOverflowHidden = app.classList.contains('overflow-hidden');
            
            console.log('%c📦 App Container:', styles.info);
            console.log(`  %cHeight:%c ${app.offsetHeight}px (${window.getComputedStyle(app).height})`, styles.label, styles.value);
            console.log(`  %cClasses:%c ${hasVh100 ? '%c✓' : '%c⚠'} vh-100 | ${hasOverflowHidden ? '%c✓' : '%c⚠'} overflow-hidden`,
                styles.label, styles.label, 
                hasVh100 ? styles.success : styles.error,
                hasOverflowHidden ? styles.success : styles.error
            );
        }
        
        // Columns ratio and heights
        if (gameCol && chatCol) {
            const gameHeight = gameCol.offsetHeight;
            const chatHeight = chatCol.offsetHeight;
            const ratio = Math.round(gameHeight / Math.max(chatHeight, 1) * 100) / 100;
            const isGoodRatio = ratio >= 1.5;
            
            console.log('%c📊 Column Heights:', styles.info);
            console.log(`  %cGame:%c ${gameHeight}px | %cChat:%c ${chatHeight}px | %cRatio:%c ${ratio} ${isGoodRatio ? '%c✓ OPTIMAL' : '%c⚠ SUB-OPTIMAL'}`,
                styles.label, styles.value, 
                styles.label, styles.value,
                styles.label, styles.value,
                isGoodRatio ? styles.success : styles.warning
            );
        }
        
        console.groupEnd();
    }

}

// Spuštění aplikace
const app = new AIDiceGame();

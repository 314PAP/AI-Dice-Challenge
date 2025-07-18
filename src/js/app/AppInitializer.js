/**
 * 🎲 AI Dice Challenge - App Initializer Module
 * 
 * Modulární inicializace aplikace pomocí lodash utilities
 * Redukuje komplexnost hlavního main.js souboru
 */

// Lodash utilities (načteno z CDN)
const { debounce, throttle, pick } = _;
import { CONSOLE_COLORS, pxToRem } from '../utils/colors.js';

/**
 * Třída pro inicializaci aplikace - oddělena z main.js
 */
export class AppInitializer {
    constructor() {
        this.initTime = Date.now();
        this.observer = null;

        // Lodash throttled funkce pro optimalizaci
        this.throttledHeightCheck = throttle(this.debugAppHeight.bind(this), 200);
        this.debouncedResize = debounce(this.handleResize.bind(this), 300);
    }

    /**
     * Čeká na načtení DOM
     */
    async waitForDOM() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    /**
     * Skryje loading screen a zobrazí hlavní aplikaci
     */
    hideLoadingScreen() {
        // Pokud už probíhá skrývání, přeskoč
        if (this._hidingLoadingScreen) {
            console.log('🔄 Loading screen se už skrývá, přeskakuji...');
            return;
        }

        this._hidingLoadingScreen = true;
        const loadingScreen = document.getElementById('loadingScreen');
        const app = document.getElementById('app');

        if (loadingScreen && !loadingScreen.classList.contains('d-none')) {
            console.log('🎬 Skrývám loading screen...');
            // Zkusíme všechny možné způsoby skrytí
            loadingScreen.style.display = 'none';
            loadingScreen.style.visibility = 'hidden';
            loadingScreen.style.opacity = '0';
            loadingScreen.classList.add('d-none');

            // Teprve pak odstraníme z DOM
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.remove();
                }
                this._hidingLoadingScreen = false;
                console.log('✅ Loading screen úspěšně odstraněn');
            }, 100);
        } else {
            this._hidingLoadingScreen = false;
            if (!loadingScreen) {
                console.log('ℹ️ Loading screen element už neexistuje');
            } else {
                console.log('ℹ️ Loading screen už je skrytý');
            }
        }

        if (app) {
            app.classList.remove('d-none');
            app.style.display = 'flex';
            app.style.visibility = 'visible';
            app.style.opacity = '1';
        } else {
            console.error('❌ App element nenalezen!');
        }
    }

    /**
     * Debug info o výškách - optimalizováno s lodash
     */
    debugAppHeight(context) {
        const app = document.getElementById('app');
        if (!app) return;

        const info = {
            context,
            viewport: { width: window.innerWidth, height: window.innerHeight },
            document: document.documentElement.clientHeight,
            app: app.offsetHeight,
            timestamp: Date.now() - this.initTime
        };

        // Lodash pick pro vybrání jen důležitých properties
        const essential = pick(info, ['context', 'viewport.height', 'app', 'timestamp']);

        console.log(
            `%c🔍 LAYOUT DEBUG %c${context} %c${essential.timestamp}ms`,
            `background: ${CONSOLE_COLORS.bgDark}; color: ${CONSOLE_COLORS.neonBlue}; font-weight: bold; padding: 2px 6px;`,
            `color: ${CONSOLE_COLORS.neonPurple}; font-weight: bold;`,
            `color: ${CONSOLE_COLORS.textMuted};`
        );
    }

    /**
     * Nastavení MutationObserver - zjednodušeno
     */
    setupMutationObserver() {
        if (this.observer) return;

        this.observer = new MutationObserver(
            // Lodash throttle pro omezení četnosti spouštění
            throttle((mutations) => {
                if (mutations.some(m => m.attributeName === 'class' || m.attributeName === 'style')) {
                    this.throttledHeightCheck('MutationObserver');
                }
            }, 100)
        );

        const app = document.getElementById('app');
        if (app) {
            this.observer.observe(app, {
                attributes: true,
                childList: true,
                subtree: true,
                attributeFilter: ['class', 'style']
            });
        }
    }

    /**
     * Resize handler - pomocí lodash debounce
     */
    handleResize() {
        this.debugAppHeight('Window Resize');
    }

    /**
     * Nastavení event listenerů
     */
    setupEventListeners() {
        // Resize listener s debounce
        window.addEventListener('resize', this.debouncedResize);

        // Visibility change s throttle
        document.addEventListener('visibilitychange',
            throttle(() => {
                if (!document.hidden) {
                    this.debugAppHeight('Visibility Change');
                }
            }, 500)
        );
    }

    /**
     * Čištění při uzavření
     */
    cleanup() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        window.removeEventListener('resize', this.debouncedResize);
    }

    /**
     * Zobrazí chybovou zprávu
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger position-fixed top-50 start-50 translate-middle';
        errorDiv.innerHTML = `
            <h4 class="alert-heading"><i class="bi bi-exclamation-triangle-fill"></i> Chyba</h4>
            <p>${message}</p>
        `;
        document.body.appendChild(errorDiv);

        // Auto-remove po 5 sekundách
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

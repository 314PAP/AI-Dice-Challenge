/**
 * 🎲 AI Dice Challenge - Layout Manager
 * 
 * Modulární správa layoutu pomocí lodash utilities
 * Zjednodušuje layout logiku z main.js
 */

// Lodash utilities (načteno z CDN)
const { debounce, throttle, round, pick, get } = _;
import { CONSOLE_COLORS, pxToRem } from '../utils/colors.js';

/**
 * Správce layoutu aplikace
 */
export class LayoutManager {
    constructor() {
        this.lastLayoutCheck = 0;
        this.isLayoutValid = false;
        
        // Lodash throttled/debounced funkce
        this.throttledLayoutCheck = throttle(this.checkLayout.bind(this), 300);
        this.debouncedLayoutValidation = debounce(this.validateLayout.bind(this), 500);
    }

    /**
     * Kontrola a validace layoutu
     */
    checkLayout() {
        const now = Date.now();
        this.lastLayoutCheck = now;
        
        const layoutInfo = this.getLayoutInfo();
        
        // Lodash round pro přesné hodnoty
        if (layoutInfo.gameHeight > 0 && layoutInfo.chatHeight > 0) {
            const ratio = round(layoutInfo.gameHeight / layoutInfo.chatHeight, 2);
            const isOptimal = ratio >= 1.5;
            
            this.logLayoutStatus(layoutInfo, ratio, isOptimal);
            this.isLayoutValid = isOptimal;
        }
        
        return layoutInfo;
    }

    /**
     * Získá informace o layoutu - pomocí lodash pick
     */
    getLayoutInfo() {
        const app = document.getElementById('app');
        const gameCol = document.querySelector('.col-12.col-sm-8');
        const chatCol = document.querySelector('.col-12.col-sm-4');
        
        const rawInfo = {
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            app: {
                height: app?.offsetHeight || 0,
                width: app?.offsetWidth || 0
            },
            game: {
                height: gameCol?.offsetHeight || 0,
                width: gameCol?.offsetWidth || 0
            },
            chat: {
                height: chatCol?.offsetHeight || 0,
                width: chatCol?.offsetWidth || 0
            }
        };
        
        // Lodash pick pro vybrání jen důležitých dat
        return pick(rawInfo, [
            'viewport.width', 'viewport.height',
            'app.height', 'app.width',
            'game.height', 'game.width',
            'chat.height', 'chat.width'
        ]);
    }

    /**
     * Logování stavu layoutu s barevným výstupem
     */
    logLayoutStatus(layoutInfo, ratio, isOptimal) {
        const successStyle = `background: ${CONSOLE_COLORS.bgDark2}; color: ${CONSOLE_COLORS.neonGreen}; font-weight: bold; padding: ${pxToRem(3)} ${pxToRem(6)}; border-radius: ${pxToRem(3)};`;
        const valueStyle = `color: ${CONSOLE_COLORS.neonGreen}; font-weight: bold;`;
        const statusStyle = isOptimal 
            ? `color: ${CONSOLE_COLORS.neonGreen}; font-weight: bold;` 
            : `color: ${CONSOLE_COLORS.neonYellow}; font-weight: bold;`;
        
        console.log(
            '%c✅ BOOTSTRAP LAYOUT %c Game:Chat = %c%s %c%s',
            successStyle,
            `color: ${CONSOLE_COLORS.textDark};`,
            valueStyle,
            ratio,
            statusStyle,
            isOptimal ? '✓ OPTIMÁLNÍ' : '⚠ SUBOPTIMÁLNÍ'
        );
    }

    /**
     * Validace layoutu - detailní kontrola
     */
    validateLayout() {
        const info = this.getLayoutInfo();
        
        const issues = [];
        
        // Kontroly pomocí lodash
        if (get(info, 'app.height', 0) === 0) {
            issues.push('App má nulovou výšku');
        }
        
        if (get(info, 'viewport.height', 0) < 400) {
            issues.push('Příliš malá výška viewportu');
        }
        
        const gameHeight = get(info, 'game.height', 0);
        const chatHeight = get(info, 'chat.height', 0);
        
        if (gameHeight === 0) issues.push('Game area má nulovou výšku');
        if (chatHeight === 0) issues.push('Chat area má nulovou výšku');
        
        if (gameHeight > 0 && chatHeight > 0) {
            const ratio = round(gameHeight / chatHeight, 2);
            if (ratio < 0.8) { // Snížený threshold - mobilní poměr může být i 1:1
                issues.push(`Nevyvážený poměr Game:Chat = ${ratio}`);
            }
        }
        
        if (issues.length > 0) {
            console.warn('⚠️ Layout problémy:', issues);
            this.isLayoutValid = false;
        } else {
            console.log('✅ Layout validní');
            this.isLayoutValid = true;
        }
        
        return {
            valid: this.isLayoutValid,
            issues,
            info
        };
    }

    /**
     * Opravní layout pokud je to možné
     */
    fixLayout() {
        if (this.isLayoutValid) return true;
        
        console.log('🔧 Pokouším se opravit layout...');
        
        const app = document.getElementById('app');
        if (app && app.offsetHeight === 0) {
            // Přidáme min-height fallback
            app.style.minHeight = '100vh';
            console.log('🔧 Přidán fallback min-height pro app');
        }
        
        // Trigger reflow
        setTimeout(() => {
            this.debouncedLayoutValidation();
        }, 100);
        
        return false;
    }

    /**
     * Nastavení automatických kontrol layoutu
     */
    startLayoutMonitoring() {
        // Throttled resize listener
        window.addEventListener('resize', this.throttledLayoutCheck);
        
        // Periodická kontrola
        setInterval(this.throttledLayoutCheck, 2000);
        
        console.log('🔍 Layout monitoring aktivní');
    }

    /**
     * Zastavení monitoringu
     */
    stopLayoutMonitoring() {
        window.removeEventListener('resize', this.throttledLayoutCheck);
        console.log('⏹️ Layout monitoring zastaven');
    }
}

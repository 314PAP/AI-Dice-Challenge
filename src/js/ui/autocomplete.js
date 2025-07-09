/**
 * Autocomplete Manager - Správa automatického doplňování v chatu
 * Rozšíření původního autocomplete s Bootstrap styly a responzivitou
 */

import { STORAGE_KEYS } from '../utils/constants.js';
import { pxToRem } from '../utils/colors.js';

// Z-index konstanty (kompatibilní s Bootstrap)
const Z_INDEXES = {
    DROPDOWN: 1050 // Bootstrap modal z-index level
};

// Max-height pro dropdown v rem místo px
const DROPDOWN_MAX_HEIGHT = pxToRem(200); // 12.5rem

/**
 * UltraBootstrapAutocomplete třída - Responzivní autocomplete s neonovým vzhledem
 */
export class UltraBootstrapAutocomplete {
    constructor(inputElement, options = {}) {
        this.input = inputElement;
        this.options = {
            suggestions: options.suggestions || [],
            maxResults: options.maxResults || 8,
            placeholder: options.placeholder || 'Začněte psát...',
            neonColor: options.neonColor || 'blue',
            storageKey: options.storageKey || STORAGE_KEYS.CHAT_HISTORY,
            ...options
        };
        
        this.isVisible = false;
        this.selectedIndex = -1;
        this.filteredSuggestions = [];
        this.dropdown = null;
        
        this.init();
    }
    
    /**
     * Inicializace autocomplete
     */
    init() {
        this.createDropdown();
        this.attachEventListeners();
        this.loadStoredSuggestions();
    }
    
    /**
     * Vytvoří dropdown element
     */
    createDropdown() {
        // Vytvořit dropdown s 100% Bootstrap utility třídami
        this.dropdown = document.createElement('div');
        this.dropdown.className = [
            'position-absolute', 'top-100', 'start-0', 'end-0',
            'bg-black', 'border', `border-neon-${this.options.neonColor}`,
            'rounded-3', 'shadow-lg', 'overflow-hidden',
            'd-none', 'mt-1', 'border-neon-glow'
        ].join(' ');
        this.dropdown.style.zIndex = Z_INDEXES.DROPDOWN;
        this.dropdown.style.maxHeight = DROPDOWN_MAX_HEIGHT;
        this.dropdown.style.overflowY = 'auto';
        
        // Vložit dropdown hned za input element
        this.input.parentNode.style.position = 'relative';
        this.input.parentNode.appendChild(this.dropdown);
    }
    
    /**
     * Připojí event listenery
     */
    attachEventListeners() {
        // Input focus
        this.input.addEventListener('focus', () => {
            this.updateSuggestions();
        });
        
        // Input změny
        this.input.addEventListener('input', () => {
            this.updateSuggestions();
        });
        
        // Input keydown (šipky, enter, escape)
        this.input.addEventListener('keydown', (e) => {
            if (!this.isVisible) return;
            
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.moveSelection(1);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.moveSelection(-1);
                    break;
                case 'Enter':
                    if (this.selectedIndex >= 0) {
                        e.preventDefault();
                        this.selectSuggestion(this.filteredSuggestions[this.selectedIndex]);
                    }
                    break;
                case 'Escape':
                    this.hideDropdown();
                    break;
            }
        });
        
        // Kliknutí mimo dropdown
        document.addEventListener('click', (e) => {
            if (e.target !== this.input && !this.dropdown.contains(e.target)) {
                this.hideDropdown();
            }
        });
    }
    
    /**
     * Načte uložené návrhy
     */
    loadStoredSuggestions() {
        const storedSuggestions = localStorage.getItem(this.options.storageKey);
        if (storedSuggestions) {
            try {
                this.options.suggestions = JSON.parse(storedSuggestions);
            } catch (e) {
                console.error('Chyba při načítání autocomplete historie:', e);
            }
        }
    }
    
    /**
     * Uloží návrh do historie
     * @param {string} suggestion - Text k uložení
     */
    storeSuggestion(suggestion) {
        if (!suggestion || !suggestion.trim()) return;
        
        // Aktualizujeme pole návrhů
        const suggestions = [...this.options.suggestions];
        
        // Odstraníme duplicity a přidáme na začátek
        const index = suggestions.indexOf(suggestion);
        if (index >= 0) {
            suggestions.splice(index, 1);
        }
        suggestions.unshift(suggestion);
        
        // Omezíme velikost
        const MAX_HISTORY_SIZE = 50; // Maximální počet položek v historii
        this.options.suggestions = suggestions.slice(0, MAX_HISTORY_SIZE);
        
        // Uložíme do localStorage
        localStorage.setItem(this.options.storageKey, JSON.stringify(this.options.suggestions));
    }
    
    /**
     * Aktualizuje zobrazené návrhy podle aktuálního textu
     */
    updateSuggestions() {
        const inputValue = this.input.value.toLowerCase();
        
        if (!inputValue) {
            this.filteredSuggestions = [...this.options.suggestions].slice(0, this.options.maxResults);
        } else {
            this.filteredSuggestions = this.options.suggestions
                .filter(item => item.toLowerCase().includes(inputValue))
                .slice(0, this.options.maxResults);
        }
        
        if (this.filteredSuggestions.length > 0) {
            this.renderDropdown();
            this.showDropdown();
        } else {
            this.hideDropdown();
        }
    }
    
    /**
     * Vykreslí dropdown s návrhy
     */
    renderDropdown() {
        // Vyčistit dropdown
        this.dropdown.innerHTML = '';
        
        // Vytvořit seznam
        const list = document.createElement('div');
        list.className = 'list-group list-group-flush';
        
        // Přidat položky
        this.filteredSuggestions.forEach((suggestion, index) => {
            const item = document.createElement('button');
            item.className = `list-group-item list-group-item-action bg-black text-neon-${this.options.neonColor} border-0`;
            item.textContent = suggestion;
            
            if (index === this.selectedIndex) {
                item.classList.add('active', 'bg-dark');
            }
            
            item.addEventListener('click', () => {
                this.selectSuggestion(suggestion);
            });
            
            list.appendChild(item);
        });
        
        this.dropdown.appendChild(list);
    }
    
    /**
     * Zobrazí dropdown
     */
    showDropdown() {
        if (!this.isVisible) {
            this.dropdown.classList.remove('d-none');
            this.isVisible = true;
        }
    }
    
    /**
     * Skryje dropdown
     */
    hideDropdown() {
        if (this.isVisible) {
            this.dropdown.classList.add('d-none');
            this.isVisible = false;
            this.selectedIndex = -1;
        }
    }
    
    /**
     * Pohybuje výběrem nahoru/dolů
     * @param {number} direction - Směr pohybu (1 = dolů, -1 = nahoru)
     */
    moveSelection(direction) {
        this.selectedIndex = (this.selectedIndex + direction) % this.filteredSuggestions.length;
        
        // Wrap kolem konce
        if (this.selectedIndex < 0) {
            this.selectedIndex = this.filteredSuggestions.length - 1;
        }
        
        this.renderDropdown();
    }
    
    /**
     * Vybere návrh a vloží ho do inputu
     * @param {string} suggestion - Vybraný návrh
     */
    selectSuggestion(suggestion) {
        this.input.value = suggestion;
        this.hideDropdown();
        this.input.focus();
        
        // Uložit výběr do historie
        this.storeSuggestion(suggestion);
        
        // Vyvolat event
        const event = new CustomEvent('suggestion-selected', {
            detail: { suggestion }
        });
        this.input.dispatchEvent(event);
    }
    
    /**
     * Aktualizuje seznam návrhů
     * @param {Array<string>} suggestions - Nové návrhy
     */
    updateSuggestionsList(suggestions) {
        this.options.suggestions = [...suggestions];
        if (this.isVisible) {
            this.updateSuggestions();
        }
    }
}

export default UltraBootstrapAutocomplete;

/**
 * 🚀 Ultra Bootstrap Autocomplete - Luxusní neonový autocomplete
 * Plně responzivní, 100% Bootstrap utility třídy, žádné hardcoded styly
 */

class UltraBootstrapAutocomplete {
    constructor(inputElement, options = {}) {
        this.input = inputElement;
        this.options = {
            suggestions: options.suggestions || [],
            maxResults: options.maxResults || 8,
            placeholder: options.placeholder || 'Začněte psát...',
            neonColor: options.neonColor || 'blue', // výchozí barva je modrá (blue)
            storageKey: options.storageKey || 'autocomplete-history',
            ...options
        };
        
        this.isVisible = false;
        this.selectedIndex = -1;
        this.filteredSuggestions = [];
        this.dropdown = null;
        
        this.init();
    }
    
    init() {
        this.createDropdown();
        this.attachEventListeners();
        this.loadStoredSuggestions();
    }
    
    createDropdown() {
        // Vytvořit dropdown s 100% Bootstrap utility třídami
        this.dropdown = document.createElement('div');
        this.dropdown.className = [
            'position-absolute', 'top-100', 'start-0', 'end-0',
            'bg-black', 'border', `border-neon-${this.options.neonColor}`,
            'rounded-3', 'shadow-lg', 'overflow-hidden',
            'd-none', 'mt-1', 'border-neon-glow'
        ].join(' ');
        this.dropdown.style.zIndex = '1050'; // Bootstrap modal z-index level
        this.dropdown.style.maxHeight = '200px';
        this.dropdown.style.overflowY = 'auto';
        
        // Vložit dropdown hned za input element
        this.input.parentNode.style.position = 'relative';
        this.input.parentNode.appendChild(this.dropdown);
    }
    
    attachEventListeners() {
        // Input events
        this.input.addEventListener('input', (e) => this.handleInput(e));
        this.input.addEventListener('focus', (e) => this.handleFocus(e));
        this.input.addEventListener('blur', (e) => this.handleBlur(e));
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!this.input.contains(e.target) && !this.dropdown.contains(e.target)) {
                this.hideDropdown();
            }
        });
    }
    
    handleInput(e) {
        const value = e.target.value.toLowerCase().trim();
        
        if (!value) {
            this.hideDropdown();
            return;
        }
        
        this.filterSuggestions(value);
        this.showDropdown();
    }
    
    handleFocus(e) {
        if (this.input.value.trim()) {
            this.filterSuggestions(this.input.value.toLowerCase().trim());
            this.showDropdown();
        }
    }
    
    handleBlur(e) {
        // Delay hiding to allow clicking on dropdown items
        setTimeout(() => {
            if (!this.dropdown.contains(document.activeElement)) {
                this.hideDropdown();
            }
        }, 200);
    }
    
    handleKeydown(e) {
        if (!this.isVisible) return;
        
        const items = this.dropdown.querySelectorAll('.autocomplete-item');
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
                this.updateSelection(items);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelection(items);
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
                    const value = items[this.selectedIndex].dataset.value;
                    this.selectItem(value);
                }
                break;
                
            case 'Escape':
                this.hideDropdown();
                this.input.blur();
                break;
        }
    }
    
    filterSuggestions(value) {
        this.filteredSuggestions = this.options.suggestions
            .filter(suggestion => suggestion.toLowerCase().includes(value))
            .slice(0, this.options.maxResults);
    }
    
    showDropdown() {
        if (this.filteredSuggestions.length === 0) {
            this.hideDropdown();
            return;
        }
        
        this.renderItems();
        this.dropdown.classList.remove('d-none');
        this.isVisible = true;
        this.selectedIndex = -1;
    }
    
    hideDropdown() {
        this.dropdown.classList.add('d-none');
        this.isVisible = false;
        this.selectedIndex = -1;
    }
    
    renderItems() {
        this.dropdown.innerHTML = '';
        
        this.filteredSuggestions.forEach((suggestion, index) => {
            const item = document.createElement('div');
            item.className = [
                'autocomplete-item', 'px-3', 'py-2', 'cursor-pointer',
                `text-neon-${this.options.neonColor}`, 'position-relative',
                'transition-all', 'user-select-none'
            ].join(' ');
            item.dataset.value = suggestion;
            item.textContent = suggestion;
            item.addEventListener('mouseenter', () => {
                // Odstranit aktivní třídu z ostatních
                this.dropdown.querySelectorAll('.autocomplete-item').forEach(el => {
                    // Použijeme třídu odpovídající refaktorovanému CSS (bg-neon-glow-effect-color)
                    el.classList.remove(`bg-neon-glow-effect-${this.options.neonColor}`);
                    el.classList.remove('neon-text-glow');
                });
                
                // Přidat hover efekt s konzistentní barvou pozadí - využíváme přímo CSS třídy
                item.classList.add(`bg-neon-glow-effect-${this.options.neonColor}`);
                item.classList.add('neon-text-glow');
                this.selectedIndex = index;
            });
            
            item.addEventListener('mouseleave', () => {
                item.classList.remove(`bg-neon-glow-effect-${this.options.neonColor}`);
                item.classList.remove('neon-text-glow');
            });
            
            item.addEventListener('click', () => {
                this.selectItem(suggestion);
            });
            
            this.dropdown.appendChild(item);
        });
    }
    
    updateSelection(items) {
        items.forEach((item, index) => {
            const isSelected = index === this.selectedIndex;
            
            if (isSelected) {
                item.classList.add(`bg-neon-glow-effect-${this.options.neonColor}`);
                item.classList.add('neon-text-glow');
                
                // Scroll into view if needed
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove(`bg-neon-glow-effect-${this.options.neonColor}`);
                item.classList.remove('neon-text-glow');
            }
        });
    }
    
    selectItem(value) {
        this.input.value = value;
        this.hideDropdown();
        this.addToHistory(value);
        
        // Trigger change event
        this.input.dispatchEvent(new Event('change', { bubbles: true }));
        this.input.focus();
    }
    
    addToHistory(value) {
        if (!value.trim()) return;
        
        // Remove if already exists
        const index = this.options.suggestions.indexOf(value);
        if (index > -1) {
            this.options.suggestions.splice(index, 1);
        }
        
        // Add to beginning
        this.options.suggestions.unshift(value);
        
        // Limit history size
        if (this.options.suggestions.length > 20) {
            this.options.suggestions = this.options.suggestions.slice(0, 20);
        }
        
        this.saveToStorage();
    }
    
    loadStoredSuggestions() {
        try {
            const stored = localStorage.getItem(this.options.storageKey);
            if (stored) {
                const suggestions = JSON.parse(stored);
                this.options.suggestions = [...suggestions, ...this.options.suggestions];
                
                // Remove duplicates
                this.options.suggestions = [...new Set(this.options.suggestions)];
            }
        } catch (error) {
            console.warn('Failed to load autocomplete history:', error);
        }
    }
    
    saveToStorage() {
        try {
            localStorage.setItem(this.options.storageKey, JSON.stringify(this.options.suggestions));
        } catch (error) {
            console.warn('Failed to save autocomplete history:', error);
        }
    }
    
    // Public API
    addSuggestion(value) {
        this.addToHistory(value);
    }
    
    setSuggestions(suggestions) {
        this.options.suggestions = [...suggestions];
        this.saveToStorage();
    }
    
    clear() {
        this.options.suggestions = [];
        this.saveToStorage();
    }
    
    destroy() {
        if (this.dropdown && this.dropdown.parentNode) {
            this.dropdown.parentNode.removeChild(this.dropdown);
        }
    }
}

// Export pro použití v hlavní aplikaci
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UltraBootstrapAutocomplete;
} else if (typeof window !== 'undefined') {
    window.UltraBootstrapAutocomplete = UltraBootstrapAutocomplete;
}

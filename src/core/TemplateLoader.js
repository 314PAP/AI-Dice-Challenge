/**
 * 📄 Template Loader
 * Načítání a cache HTML šablon
 */

import { memoize } from 'lodash-es';

/**
 * Správce načítání šablon
 */
export class TemplateLoader {
    constructor() {
        this.cache = new Map();
        this.loading = new Set();
    }

    /**
     * Načtení šablony s cache
     */
    async load(url) {
        // Kontrola cache
        if (this.cache.has(url)) {
            return this.cache.get(url);
        }

        // Kontrola současného načítání
        if (this.loading.has(url)) {
            return this.waitForLoad(url);
        }

        // Načtení šablony
        this.loading.add(url);
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const html = await response.text();
            
            // Uložení do cache
            this.cache.set(url, html);
            this.loading.delete(url);
            
            return html;
            
        } catch (error) {
            this.loading.delete(url);
            console.error(`Failed to load template ${url}:`, error);
            
            // Fallback HTML
            return this.getFallbackHtml(url, error);
        }
    }

    /**
     * Čekání na dokončení načítání
     */
    async waitForLoad(url) {
        while (this.loading.has(url)) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        return this.cache.get(url);
    }

    /**
     * Fallback HTML pro chyby
     */
    getFallbackHtml(url, error) {
        return `
            <div class="alert alert-warning d-flex align-items-center">
                <i class="ri-alert-line me-2"></i>
                <div>
                    <h6 class="mb-1">⚠️ Chyba načítání šablony</h6>
                    <small class="text-muted">Nepodařilo se načíst: ${url}</small>
                </div>
            </div>
        `;
    }

    /**
     * Vyčištění cache
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Template cache cleared');
    }

    /**
     * Předčítání šablon
     */
    async preload(urls) {
        const promises = urls.map(url => this.load(url));
        const results = await Promise.allSettled(promises);
        
        const failed = results
            .filter(result => result.status === 'rejected')
            .map((result, index) => ({ url: urls[index], error: result.reason }));
        
        if (failed.length > 0) {
            console.warn('Some templates failed to preload:', failed);
        }
        
        return results;
    }

    /**
     * Statistiky cache
     */
    getStats() {
        return {
            cached: this.cache.size,
            loading: this.loading.size,
            urls: Array.from(this.cache.keys())
        };
    }
}

export default TemplateLoader;

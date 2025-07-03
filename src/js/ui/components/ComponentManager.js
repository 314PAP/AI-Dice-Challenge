/**
 * ComponentManager - Správce inicializace a načítání komponent
 */
import HTMLLoader from './HTMLLoader.js';

class ComponentManager {
  constructor() {
    this.components = new Map();
    this.loadedComponents = new Set();
  }
  
  /**
   * Zaregistruje komponentu s její šablonou a inicializační funkcí
   * @param {string} name - Název komponenty
   * @param {string} templatePath - Cesta k HTML šabloně
   * @param {Function|null} initFunction - Funkce pro inicializaci komponenty
   */
  registerComponent(name, templatePath, initFunction = null) {
    this.components.set(name, { templatePath, initFunction });
  }
  
  /**
   * Načte komponentu a inicializuje ji
   * @param {string} name - Název komponenty
   * @param {string|Element} targetSelector - Kam se má komponenta vložit
   * @param {boolean} append - Přidat nebo nahradit existující obsah
   * @returns {Promise<void>}
   */
  async loadComponent(name, targetSelector, append = false) {
    if (!this.components.has(name)) {
      console.error(`Komponenta '${name}' není zaregistrována`);
      return;
    }
    
    const component = this.components.get(name);
    
    // Načtení šablony
    await HTMLLoader.loadTemplate(component.templatePath, targetSelector, append);
    
    // Inicializace komponenty, pokud má inicializační funkci
    if (component.initFunction && typeof component.initFunction === 'function') {
      component.initFunction();
    }
    
    this.loadedComponents.add(name);
  }
  
  /**
   * Načte více komponent najednou
   * @param {Array<{name: string, target: string|Element, append: boolean}>} componentList
   * @returns {Promise<void>}
   */
  async loadComponents(componentList) {
    const loadPromises = componentList.map(item => 
      this.loadComponent(item.name, item.target, item.append || false)
    );
    
    await Promise.all(loadPromises);
  }
  
  /**
   * Kontrola zda je komponenta načtena
   * @param {string} name - Název komponenty
   * @returns {boolean}
   */
  isLoaded(name) {
    return this.loadedComponents.has(name);
  }
}

export default ComponentManager;

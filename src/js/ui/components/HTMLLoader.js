/**
 * HTMLLoader - Třída pro načítání a injektování HTML komponent
 * Zajišťuje dynamické načítání HTML šablon a jejich vkládání do DOM
 */
class HTMLLoader {
  /**
   * Načte HTML šablonu ze souboru a vloží ji do cílového elementu
   * @param {string} templatePath - Cesta k HTML šabloně
   * @param {string|Element} targetSelector - CSS selektor nebo DOM element, kam má být šablona vložena
   * @param {boolean} append - Má se obsah přidat ke stávajícímu? (true) nebo nahradit stávající obsah (false)
   * @returns {Promise<void>}
   */
  static async loadTemplate(templatePath, targetSelector, append = false) {
    try {
      // Fetch HTML šablony
      const response = await fetch(templatePath);
      if (!response.ok) {
        throw new Error(`Nepodařilo se načíst šablonu: ${templatePath}`);
      }
      
      const html = await response.text();
      
      // Získání cílového elementu
      const targetElement = (typeof targetSelector === 'string') 
        ? document.querySelector(targetSelector)
        : targetSelector;
        
      if (!targetElement) {
        throw new Error(`Cílový element nebyl nalezen: ${targetSelector}`);
      }
      
      // Vložení nebo přidání obsahu
      if (append) {
        targetElement.insertAdjacentHTML('beforeend', html);
      } else {
        targetElement.innerHTML = html;
      }
      
    } catch (error) {
      console.error('Chyba při načítání HTML šablony:', error);
    }
  }
  
  /**
   * Načte více šablon najednou
   * @param {Array<{path: string, target: string|Element, append: boolean}>} templates - Pole objektů s definicemi šablon
   * @returns {Promise<void>}
   */
  static async loadTemplates(templates) {
    try {
      // Načíst všechny šablony paralelně pro rychlejší načtení
      await Promise.all(
        templates.map(template => 
          this.loadTemplate(template.path, template.target, template.append || false)
        )
      );
    } catch (error) {
      console.error('Chyba při načítání více šablon:', error);
    }
  }
}

export default HTMLLoader;

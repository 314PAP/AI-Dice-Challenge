/**
 * Skript pro ověření správného načítání a stylování chat komponent
 * 
 * Tento skript můžete spustit v konzoli prohlížeče po načtení aplikace
 * pro ověření, že všechny chatovací komponenty jsou správně stylované.
 */

function verifyChatStyles() {
  console.log('🔍 Kontrola chatovacích komponent...');
  
  // Kontrola načtení CSS souborů
  const allStyles = Array.from(document.styleSheets);
  const cssFiles = {
    forms: false,
    chat: false
  };
  
  allStyles.forEach(sheet => {
    try {
      const rules = Array.from(sheet.cssRules);
      rules.forEach(rule => {
        if (rule.cssText && rule.cssText.includes('forms.css')) {
          cssFiles.forms = true;
        }
        if (rule.cssText && rule.cssText.includes('chat.css')) {
          cssFiles.chat = true;
        }
      });
    } catch (err) {
      console.warn('Nelze číst pravidla pro:', sheet.href, err.message);
    }
  });
  
  console.log('📂 CSS soubory načteny:', cssFiles);
  
  // Kontrola chat inputů
  const chatInputs = document.querySelectorAll('#chatInput, #chatInputMobile');
  console.log(`🔤 Nalezeno ${chatInputs.length} vstupních polí chatu`);
  
  chatInputs.forEach((input, i) => {
    const styles = window.getComputedStyle(input);
    console.log(`Chat input #${i}:`, {
      element: input,
      border: styles.border,
      backgroundColor: styles.backgroundColor,
      placeholderVisible: !!input.placeholder,
      placeholderColor: 'Nelze ověřit přímo, použijte DevTools'
    });
  });
  
  // Kontrola chat kontejnerů
  const chatContainers = document.querySelectorAll('.chat-container');
  console.log(`📱 Nalezeno ${chatContainers.length} chat kontejnerů`);
  
  chatContainers.forEach((container, i) => {
    const styles = window.getComputedStyle(container);
    console.log(`Chat kontejner #${i}:`, {
      element: container,
      display: styles.display,
      flexDirection: styles.flexDirection,
      height: styles.height
    });
  });
  
  console.log('✅ Kontrola dokončena! Zkontrolujte vizuální stav v prohlížeči.');
  console.log('🎨 Pro správné zobrazení by měly být placeholdery zelené a bez vnitřních rámečků.');
}

// Automaticky spustit po načtení stránky
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(verifyChatStyles, 1000);  // Počkat na načtení všech komponent
});

// Lze také manuálně spustit v konzoli
console.log('Pro manuální kontrolu spusťte funkci: verifyChatStyles()');

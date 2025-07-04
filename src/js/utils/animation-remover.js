/**
 * Pomocný skript pro odstranění pulzujících animací
 * Tento skript se načítá dříve než hlavní aplikace a okamžitě odstraňuje animace
 */

// Funkce pro okamžité odstranění všech pulzujících animací
(function() {
  // Funkce pro odstranění animací
  function removeAllAnimations() {
    // Odstranění animačních tříd z dokumentu
    document.body.classList.forEach(cls => {
      if (cls.includes('animate__')) {
        document.body.classList.remove(cls);
      }
    });
    
    // Aplikace stylu na všechny elementy s pulzujícími animacemi
    const animatedElements = document.querySelectorAll('.animate__pulse, .animate__infinite, .animate__slow, .animate__slower');
    animatedElements.forEach(el => {
      el.style.animation = 'none';
      el.classList.remove('animate__pulse', 'animate__infinite', 'animate__slow', 'animate__slower');
    });
    
    // Přidání třídy pro deaktivaci animací
    document.body.classList.add('no-animations');
    
    console.log('Všechny pulzující animace byly odstraněny pro ladění');
  }
  
  // Odstranění animací ihned po načtení skriptu
  removeAllAnimations();
  
  // Opakované volání pro zajištění odstranění i pozdějších animací
  setInterval(removeAllAnimations, 1000);
  
  // Přidání listeneru pro DOMContentLoaded
  document.addEventListener('DOMContentLoaded', removeAllAnimations);
  
  // Přidání události pro načtení okna
  window.addEventListener('load', removeAllAnimations);
})();

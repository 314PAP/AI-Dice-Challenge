/**
 * Test pro kontrolu správného zobrazování komponent podle velikosti obrazovky
 * Tento skript pomáhá odhalit problémy s duplicitním zobrazením komponent
 */

document.addEventListener('DOMContentLoaded', function() {
  // Vytvořit výstupní element pro test
  const testOutput = document.createElement('div');
  testOutput.id = 'responsiveTest';
  testOutput.style.position = 'fixed';
  testOutput.style.bottom = '10px';
  testOutput.style.right = '10px';
  testOutput.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  testOutput.style.padding = '10px';
  testOutput.style.borderRadius = '5px';
  testOutput.style.zIndex = '9999';
  testOutput.style.color = '#39ff14'; // Neon zelená
  testOutput.style.maxWidth = '250px';
  testOutput.style.fontSize = '12px';
  document.body.appendChild(testOutput);
  
  // Funkce pro kontrolu viditelných komponent
  function checkVisibleComponents() {
    const width = window.innerWidth;
    const isMobile = width < 768; // Bootstrap md breakpoint
    const testResults = {
      screenWidth: width,
      mode: isMobile ? 'MOBILNÍ' : 'DESKTOP',
      desktopComponents: {
        gameMenu: isVisible('gameHeader'),
        gameControls: document.querySelector('#gameControls') ? isVisible('gameControls') : 'není načten',
        chat: document.querySelector('.chat-container:not(#chatPanelMobile)') ? 
              isVisible('.chat-container:not(#chatPanelMobile)') : 'není načten'
      },
      mobileComponents: {
        gameMenu: isVisible('gameHeaderMobile'),
        gameControls: document.querySelector('#gameControlsMobile') ? isVisible('gameControlsMobile') : 'není načten',
        chat: isVisible('chatPanelMobile')
      }
    };
    
    // Kontrola, zda existuje duplicitní zobrazení
    const duplicatesExist = (isMobile && (
      testResults.desktopComponents.gameMenu === 'viditelný' ||
      testResults.desktopComponents.chat === 'viditelný' ||
      testResults.desktopComponents.gameControls === 'viditelný'
    )) || (!isMobile && (
      testResults.mobileComponents.gameMenu === 'viditelný' ||
      testResults.mobileComponents.chat === 'viditelný' ||
      testResults.mobileComponents.gameControls === 'viditelný'
    ));
    
    // Výpis testovacích výsledků
    let output = '<b>TEST ZOBRAZENÍ</b><br>';
    output += `Šířka: ${width}px (${testResults.mode})<br>`;
    
    output += '<b>Desktop komponenty:</b><br>';
    output += `- Menu: ${testResults.desktopComponents.gameMenu}<br>`;
    output += `- Chat: ${testResults.desktopComponents.chat}<br>`;
    output += `- Controls: ${testResults.desktopComponents.gameControls}<br>`;
    
    output += '<b>Mobilní komponenty:</b><br>';
    output += `- Menu: ${testResults.mobileComponents.gameMenu}<br>`;
    output += `- Chat: ${testResults.mobileComponents.chat}<br>`;
    output += `- Controls: ${testResults.mobileComponents.gameControls}<br>`;
    
    output += `<b>Výsledek: ${duplicatesExist ? '❌ DUPLICITY!' : '✅ OK'}</b>`;
    
    // Nastavení barvy podle výsledku
    testOutput.style.borderColor = duplicatesExist ? '#ff3939' : '#39ff14';
    testOutput.style.borderWidth = '2px';
    testOutput.style.borderStyle = 'solid';
    testOutput.innerHTML = output;
  }
  
  // Funkce pro zjištění viditelnosti elementu
  function isVisible(selector) {
    const element = typeof selector === 'string' ? 
      document.getElementById(selector) || document.querySelector(selector) : selector;
    
    if (!element) {
      return 'nenalezen';
    }
    
    const style = window.getComputedStyle(element);
    const isVisibleByDisplay = style.display !== 'none';
    const isVisibleByVisibility = style.visibility !== 'hidden';
    const hasSize = element.offsetWidth > 0 && element.offsetHeight > 0;
    
    return (isVisibleByDisplay && isVisibleByVisibility && hasSize) ? 'viditelný' : 'skrytý';
  }
  
  // Přidat testovací tlačítko
  const testButton = document.createElement('button');
  testButton.textContent = 'Spustit test zobrazení';
  testButton.style.position = 'fixed';
  testButton.style.bottom = '10px';
  testButton.style.left = '10px';
  testButton.style.zIndex = '9999';
  testButton.className = 'btn btn-sm btn-dark border-neon-green';
  document.body.appendChild(testButton);
  
  // Přidat event listener na tlačítko
  testButton.addEventListener('click', checkVisibleComponents);
  
  // Přidat event listener na změnu velikosti okna
  window.addEventListener('resize', function() {
    if (testOutput.style.display !== 'none') {
      checkVisibleComponents();
    }
  });
  
  // Spustit test při načtení stránky
  checkVisibleComponents();
});

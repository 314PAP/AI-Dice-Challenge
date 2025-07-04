/**
 * Hlavní JS soubor pro načítání šablon s novým Bootstrap responzivním layoutem
 */

// Utility funkce pro načítání HTML šablon
async function loadTemplate(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load template: ${url}`);
        }
        return await response.text();
    } catch (error) {
        console.error('Error loading template:', error);
        return `<div class="alert alert-danger">Error loading template: ${error.message}</div>`;
    }
}

// Funkce pro inicializaci hry
async function initGame() {
    try {
        // Načtení šablon
        const gameMenu = await loadTemplate('/src/templates/game-menu.html');
        const mobileGameMenu = await loadTemplate('/src/templates/game-menu-mobile-bootstrap.html');
        const mobileChat = await loadTemplate('/src/templates/chat-mobile-bootstrap.html');
        const desktopChat = await loadTemplate('/src/templates/chat.html');
        
        // Načtení modal šablon
        const rulesModal = await loadTemplate('/src/templates/modals/rules-modal.html');
        const hallOfFameModal = await loadTemplate('/src/templates/modals/hall-of-fame-modal.html');
        const gameOverModal = await loadTemplate('/src/templates/modals/game-over-modal.html');

        // Vložení šablon do správných kontejnerů
        document.getElementById('gameContent').innerHTML = gameMenu;
        document.getElementById('gameMobileContent').innerHTML = mobileGameMenu;
        document.getElementById('chatPanelMobileContainer').innerHTML = mobileChat;
        document.getElementById('chatPanel').innerHTML = desktopChat;
        
        // Vložení modal šablon do modalsContainer (nebo přímo do body pokud neexistuje)
        const modalsContainer = document.getElementById('modalsContainer') || document.body;
        modalsContainer.insertAdjacentHTML('beforeend', rulesModal);
        modalsContainer.insertAdjacentHTML('beforeend', hallOfFameModal);
        modalsContainer.insertAdjacentHTML('beforeend', gameOverModal);
        
        // Zvýraznění neonových efektů po načtení šablon
        enhanceNeonEffects();
        
        // Inicializace menu tlačítek PO načtení šablon
        await initMenuButtons();
        
    } catch (error) {
        console.error('Chyba při inicializaci hry:', error);
        // Pokus o obnovení za 1 sekundu při chybě
        setTimeout(tryContentRecovery, 1000);
    }
    
    // Inicializace event listenerů (bez menu tlačítek)
    initEventListeners();
    
    // Zajištění inicializace chatu
    ensureChatInitialized();
    
    // Odstranění všech pulzujících animací pro lepší ladění
    removeAllPulseAnimations();
    
    // Přidání třídy pro postupné objevení (pouze fadeIn, bez pulse)
    document.querySelectorAll('.btn').forEach((btn, index) => {
        btn.classList.add('animate__animated', 'animate__fadeIn');
        btn.style.animationDelay = `${index * 0.1 + 0.5}s`;
    });
    
    // Detekce změny orientace pro přizpůsobení layoutu
    window.addEventListener('orientationchange', adjustLayoutForOrientation);
    // Spustíme také při načtení stránky
    adjustLayoutForOrientation();
    
    // Pravidelná kontrola viditelnosti prvků pro zajištění funkčnosti
    setTimeout(ensureElementsVisibility, 500);
    // Kontrola viditelnosti každých 5 sekund
    setInterval(ensureElementsVisibility, 5000);
}

// Přizpůsobení layoutu podle orientace zařízení
function adjustLayoutForOrientation() {
    // Timeout pro zajištění správných rozměrů po změně orientace
    setTimeout(() => {
        // Detekce orientace a velikosti displeje
        const isLandscape = window.innerWidth > window.innerHeight;
        const isVerySmallHeight = window.innerHeight < 500;
        const isVerySmallWidth = window.innerWidth < 350;
        const isExtremelySmall = window.innerWidth < 320 || window.innerHeight < 480;
        
        console.log(`Orientace: ${isLandscape ? 'landscape' : 'portrait'}, Výška: ${window.innerHeight}px, Šířka: ${window.innerWidth}px`);
        
        // Aplikace tříd na body element pro snadnější CSS selektory
        document.body.classList.toggle('is-landscape', isLandscape);
        document.body.classList.toggle('is-small-height', isVerySmallHeight);
        document.body.classList.toggle('is-small-width', isVerySmallWidth);
        document.body.classList.toggle('is-extremely-small', isExtremelySmall);
        
        // Skryjeme dekorativní prvky na malých výškách
        const decorativeElements = document.querySelectorAll('.neon-dice-decoration, .decorative-element');
        decorativeElements.forEach(el => {
            if (isVerySmallHeight || isExtremelySmall) {
                el.classList.add('hide-on-small-height');
            } else {
                el.classList.remove('hide-on-small-height');
            }
        });
        
        // Upravíme velikost nadpisů
        const gameTitles = document.querySelectorAll('.game-title');
        gameTitles.forEach(title => {
            if (isExtremelySmall) {
                title.classList.add('fs-6');
                title.classList.remove('fs-3', 'fs-4', 'fs-5');
            } else if (isVerySmallHeight) {
                title.classList.add('fs-5');
                title.classList.remove('fs-3', 'fs-4', 'fs-6');
            } else if (isLandscape) {
                title.classList.add('fs-4');
                title.classList.remove('fs-3', 'fs-5', 'fs-6');
            } else {
                title.classList.add('fs-4');
                title.classList.remove('fs-3', 'fs-5', 'fs-6');
            }
        });
        
        // Optimalizace tlačítek
        const menuButtons = document.querySelectorAll('.menu-buttons .btn');
        menuButtons.forEach(button => {
            if (isExtremelySmall) {
                button.classList.add('btn-sm', 'py-1');
            } else if (isVerySmallHeight || isVerySmallWidth) {
                button.classList.add('py-1');
                button.classList.remove('btn-sm');
            } else {
                button.classList.remove('btn-sm', 'py-1');
            }
        });
        
        // Zajištění viditelnosti chat inputu
        const chatInputs = document.querySelectorAll('.chat-input');
        chatInputs.forEach(input => {
            input.style.visibility = 'visible';
            input.style.opacity = '1';
        });
    }, 200);
}

// Inicializace event listenerů
// Inicializace event listenerů
function initEventListeners() {
    // Animace po najetí na tlačítka
    document.querySelectorAll('.btn-neon').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.classList.add('animate__pulse');
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.classList.remove('animate__pulse');
        });
    });
    
    // Event listenery pro mobilní chat
    const chatInputMobile = document.getElementById('chatInputMobile');
    const sendChatBtnMobile = document.getElementById('sendChatBtnMobile');
    
    if (chatInputMobile && sendChatBtnMobile) {
        // Odeslání zprávy kliknutím na tlačítko
        sendChatBtnMobile.addEventListener('click', () => {
            sendChatMessage(chatInputMobile, 'mobile');
        });
        
        // Odeslání zprávy stisknutím Enter
        chatInputMobile.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage(chatInputMobile, 'mobile');
            }
        });
        
        // Focus efekty pro vstupní pole
        chatInputMobile.addEventListener('focus', () => {
            const chatBox = document.querySelector('#chatPanelMobile');
            if (chatBox) chatBox.classList.add('input-focused');
        });
        
        chatInputMobile.addEventListener('blur', () => {
            const chatBox = document.querySelector('#chatPanelMobile');
            if (chatBox) chatBox.classList.remove('input-focused');
        });
    }
    
    // Event listenery pro desktop chat
    const chatInputDesktop = document.getElementById('chatInput');
    const sendChatBtn = document.getElementById('sendChatBtn');
    
    if (chatInputDesktop && sendChatBtn) {
        // Odeslání zprávy kliknutím na tlačítko
        sendChatBtn.addEventListener('click', () => {
            sendChatMessage(chatInputDesktop, 'desktop');
        });
        
        // Odeslání zprávy stisknutím Enter
        chatInputDesktop.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage(chatInputDesktop, 'desktop');
            }
        });
        
        // Focus efekty pro vstupní pole
        chatInputDesktop.addEventListener('focus', () => {
            const chatBox = document.querySelector('#chatPanel').closest('.chat-box');
            if (chatBox) chatBox.classList.add('input-focused');
        });
        
        chatInputDesktop.addEventListener('blur', () => {
            const chatBox = document.querySelector('#chatPanel').closest('.chat-box');
            if (chatBox) chatBox.classList.remove('input-focused');
        });
    }
    
    // Odposlech změny velikosti okna
    window.addEventListener('resize', handleWindowResize);
    
    // První detekce velikosti obrazovky
    detectExtremelySmallScreen();
    
    // Odposlech orientace zařízení
    window.addEventListener('orientationchange', () => {
        setTimeout(detectExtremelySmallScreen, 300);
    });
    
    // Přidání třídy pro postupné objevení tlačítek
    document.querySelectorAll('.btn').forEach((btn, index) => {
        if (!btn.classList.contains('animate__animated')) {
            btn.classList.add('animate__animated', 'animate__fadeIn');
            btn.style.animationDelay = `${index * 0.1 + 0.5}s`;
        }
    });
}

// Zpracování změny velikosti okna
function handleWindowResize() {
    // Zavoláme přizpůsobení layoutu
    adjustLayoutForOrientation();
    
    // Detekce extrémně malých zařízení
    detectExtremelySmallScreen();
    
    // Zajištění viditelnosti elementů
    ensureElementsVisibility();
}

// Funkce pro zajištění viditelnosti důležitých prvků
function ensureElementsVisibility() {
    // Zajištění viditelnosti tlačítek
    document.querySelectorAll('.btn').forEach(btn => {
        btn.style.visibility = 'visible';
        btn.style.opacity = '1';
    });
    
    // Zajištění viditelnosti chatů
    document.querySelectorAll('#chatMessagesMobile, #chatMessages').forEach(element => {
        if (element) {
            element.style.minHeight = window.innerHeight < 480 ? '60px' : '100px';
            element.style.visibility = 'visible';
            element.style.opacity = '1';
            // Scroll na poslední zprávu
            element.scrollTop = element.scrollHeight;
        }
    });
    
    // Zajištění viditelnosti vstupních polí
    document.querySelectorAll('#chatInputMobile, #chatInput').forEach(input => {
        if (input) {
            input.style.visibility = 'visible';
            input.style.opacity = '1';
        }
    });
}

// Vylepšená detekce extrémně malých obrazovek
function detectExtremelySmallScreen() {
    const isXS = window.innerWidth < 320 || window.innerHeight < 480;
    const isXXS = window.innerWidth < 280 || window.innerHeight < 400;
    const deviceInfo = `Šířka: ${window.innerWidth}px, Výška: ${window.innerHeight}px, Typ: ${isXXS ? 'Extrémně malé zařízení' : isXS ? 'Velmi malé zařízení' : 'Standardní zařízení'}`;
    console.log(deviceInfo);
    
    // Přizpůsobíme prvky pro velmi malé obrazovky
    if (isXXS) {
        document.body.classList.add('xxs-device');
        document.body.classList.add('xs-device');
        
        // Extrémně kompaktní rozložení
        document.querySelectorAll('.game-title').forEach(title => {
            title.classList.add('fs-6');
            title.classList.remove('fs-3', 'fs-4', 'fs-5');
            // Odstranění ikon pro extra úsporu místa
            const icons = title.querySelectorAll('i');
            icons.forEach(icon => icon.style.display = 'none');
        });
        
        // Extra malá tlačítka
        document.querySelectorAll('.btn').forEach(btn => {
            btn.classList.add('btn-sm', 'py-1', 'px-1');
            btn.classList.add('compact-btn');
        });
        
        // Odstranit dekorativní elementy
        document.querySelectorAll('.decorative-element, .hide-on-xs').forEach(el => {
            el.style.display = 'none';
        });
        
    } else if (isXS) {
        document.body.classList.add('xs-device');
        document.body.classList.remove('xxs-device');
        
        document.querySelectorAll('.game-title').forEach(title => {
            title.classList.add('fs-6');
            title.classList.remove('fs-3', 'fs-4', 'fs-5');
        });
        
        document.querySelectorAll('.btn').forEach(btn => {
            btn.classList.add('btn-sm', 'py-1');
            btn.classList.remove('compact-btn');
        });
        
        // Skryjeme některé dekorační prvky
        document.querySelectorAll('.hide-on-xs').forEach(el => {
            el.style.display = 'none';
        });
    } else {
        document.body.classList.remove('xs-device', 'xxs-device');
        
        // Obnovíme viditelnost prvků
        document.querySelectorAll('.hide-on-xs').forEach(el => {
            el.style.display = '';
        });
        
        document.querySelectorAll('.btn i').forEach(icon => {
            icon.style.display = '';
        });
        
        document.querySelectorAll('.game-title').forEach(title => {
            title.classList.remove('fs-6');
            if (window.innerWidth > 767) {
                title.classList.add('fs-3');
            } else {
                title.classList.add('fs-4');
            }
        });
    }
    
    // Zajištění viditelnosti chat boxu
    ensureChatVisibility();
}

// Funkce pro zajištění viditelnosti chatu
function ensureChatVisibility() {
    const chatMessages = document.getElementById('chatMessagesMobile');
    const chatInput = document.getElementById('chatInputMobile');
    
    if (chatMessages && chatInput) {
        // Zajistíme, že chat input je vždy viditelný
        chatInput.style.visibility = 'visible';
        chatInput.style.opacity = '1';
        
        // Zajistíme, že zprávy jsou viditelné
        chatMessages.style.minHeight = '80px';
        
        // Scrollujeme na nejnovější zprávu
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Funkce pro zajištění inicializace chatu
function ensureChatInitialized() {
    // Kontrola, zda jsou inicializované chat kontejnery
    const mobileMessages = document.getElementById('chatMessagesMobile');
    const desktopMessages = document.getElementById('chatMessages');
    
    // Pokud nejsou zprávy, přidáme uvítací zprávy
    if (mobileMessages && mobileMessages.children.length === 0) {
        // Přidání systémových zpráv
        addChatMessage('Systém', 'Vítejte v AI Kostkové Výzvě!', 'system');
        addChatMessage('Gemini', 'Připraven na hru?', 'ai');
        addChatMessage('Systém', 'Můžete kdykoliv chatovat s AI protihráči. Pište do pole níže.', 'system');
    }
    
    // Zajištění viditelnosti pro všechny chat elementy
    document.querySelectorAll('.chat-box, .chat-messages, .chat-message, .chat-input').forEach(el => {
        el.style.visibility = 'visible';
        el.style.opacity = '1';
    });
    
    // Scroll na poslední zprávu po krátké prodlevě
    setTimeout(() => {
        if (mobileMessages) mobileMessages.scrollTop = mobileMessages.scrollHeight;
        if (desktopMessages) desktopMessages.scrollTop = desktopMessages.scrollHeight;
    }, 300);
}

// Inicializace menu tlačítek
async function initMenuButtons() {
    // Použije naši optimalizovanou implementaci z menuButtonHandlers.js
    try {
        const { attachMenuButtonHandlers } = await import('./js/ui/menuButtonHandlers.js');
        attachMenuButtonHandlers();
        console.log('✅ Menu tlačítka inicializována pomocí menuButtonHandlers');
    } catch (error) {
        console.error('❌ Chyba při načítání menuButtonHandlers:', error);
        
        // Fallback: základní implementace
        const startGameBtn = document.getElementById('startGameBtn');
        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => {
                console.log('Start game requested (fallback)');
                addChatMessage('Systém', 'Hra začíná...', 'system');
            });
        }
        
        const startGameBtnMobile = document.getElementById('startGameBtnMobile');
        if (startGameBtnMobile) {
            startGameBtnMobile.addEventListener('click', () => {
                console.log('Start game requested (mobile fallback)');
                addChatMessage('Systém', 'Hra začíná...', 'system');
            });
        }
    }
}

// Funkce pro odeslání zprávy
function sendChatMessage(inputElement, source = 'desktop') {
    const message = inputElement.value.trim();
    if (message) {
        // Zde by byla reálná implementace odesílání zprávy
        console.log(`Sending message from ${source}:`, message);
        
        // Přidáme efekt pulzování k tlačítku odeslání
        const sendButton = inputElement.nextElementSibling;
        if (sendButton) {
            sendButton.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                sendButton.classList.remove('animate__animated', 'animate__pulse');
            }, 500);
        }
        
        // Vyčištění vstupu
        inputElement.value = '';
        
        // Přidání zprávy do chatu pro demonstrační účely
        addChatMessage('Player', message, 'player');
        
        // Simulace odpovědi AI (pro demonstrační účely)
        simulateAiResponse();
    }
}

// Simulace odpovědi AI
function simulateAiResponse() {
    const aiResponses = [
        'Zajímavý tah! Co uděláš dál?',
        'Skvělá strategie!',
        'Vidím, že hraješ opatrně.',
        'Zkus to znovu s větším rizikem!',
        'To byla troufalá volba!',
        'Jsem zvědavý, jak to dopadne...',
        'Počítám pravděpodobnost tvého úspěchu.'
    ];
    
    // Náhodná odpověď
    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    
    // Přidání zpoždění pro realističtější konverzaci
    setTimeout(() => {
        // Přidání indikátoru psaní
        addChatMessage('AI', 'Přemýšlím...', 'system');
        
        // Odpověď AI po chvíli
        setTimeout(() => {
            // Odebereme poslední zprávu (indikátor psaní)
            const mobileMessages = document.getElementById('chatMessagesMobile');
            const desktopMessages = document.getElementById('chatMessages');
            
            if (mobileMessages && mobileMessages.lastChild) {
                mobileMessages.removeChild(mobileMessages.lastChild);
            }
            
            if (desktopMessages && desktopMessages.lastChild) {
                desktopMessages.removeChild(desktopMessages.lastChild);
            }
            
            // Přidáme skutečnou odpověď
            addChatMessage('Gemini', randomResponse, 'ai');
        }, 1500);
    }, 700);
}

// Funkce pro přidání zprávy do chatu s vylepšenými animacemi a třídami
function addChatMessage(sender, message, type = 'player') {
    // Získáme kontejnery zpráv
    const mobileMessages = document.getElementById('chatMessagesMobile');
    const desktopMessages = document.getElementById('chatMessages');
    
    // Vytvoříme nový element zprávy s odpovídající třídou pro typ zprávy
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message small animate__animated ${type}-message`;
    
    // Barva podle typu zprávy
    let colorClass = 'neon-green';
    let animationType = 'animate__fadeInLeft';
    
    switch(type) {
        case 'system':
            colorClass = 'neon-yellow';
            animationType = 'animate__fadeInDown';
            break;
        case 'ai':
            colorClass = 'neon-blue';
            animationType = 'animate__fadeInRight';
            break;
        case 'error':
            colorClass = 'neon-red';
            animationType = 'animate__shakeX';
            break;
        default:
            colorClass = 'neon-green';
            animationType = 'animate__fadeInLeft';
    }
    
    // Přidání animace
    messageElement.classList.add(animationType);
    
    // Obsah zprávy s ikonou podle typu
    let icon = '';
    switch(type) {
        case 'system': icon = '<i class="ri-information-line me-1"></i>'; break;
        case 'ai': icon = '<i class="ri-robot-line me-1"></i>'; break;
        case 'error': icon = '<i class="ri-error-warning-line me-1"></i>'; break;
        default: icon = '<i class="ri-user-line me-1"></i>';
    }
    
    // Formátování obsahu zprávy
    messageElement.innerHTML = `
        <strong class="${colorClass}">${icon}${sender}:</strong> 
        <span class="${colorClass}">${message}</span>
    `;
    
    // Přidáme zprávu do obou chatů s časovým odstupem pro lepší animaci
    const addMessageWithDelay = (container, element, isClone = false) => {
        if (!container) return;
        
        const messageToAdd = isClone ? element.cloneNode(true) : element;
        
        // Přidáme zprávu
        container.appendChild(messageToAdd);
        
        // Zajistíme scroll na nejnovější zprávu
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
            
            // Přidáme efekt zvýraznění
            messageToAdd.classList.add('highlight-new');
            
            // Odstraníme efekt po chvíli
            setTimeout(() => {
                messageToAdd.classList.remove('highlight-new');
            }, 2000);
        }, 100);
    };
    
    // Přidáme zprávy do obou chatů
    if (mobileMessages) {
        addMessageWithDelay(mobileMessages, messageElement, true);
    }
    
    if (desktopMessages) {
        addMessageWithDelay(desktopMessages, messageElement);
    }
}

// Funkce pro zvýraznění neonových efektů
function enhanceNeonEffects() {
    // Zvýšení intenzity neonového efektu u tlačítek
    document.querySelectorAll('.btn-neon').forEach(btn => {
        // Zvýšení intenzity stínu pro lepší viditelnost
        const color = window.getComputedStyle(btn).color;
        btn.style.textShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
        
        // Přidání extra glow efektu k okrajům
        const borderColor = window.getComputedStyle(btn).borderColor;
        btn.style.boxShadow = `0 0 5px ${borderColor}, 0 0 8px ${borderColor}, 0 0 12px ${borderColor}`;
    });
    
    // Zvýraznění neonových nadpisů
    document.querySelectorAll('.neon-text').forEach(text => {
        const color = window.getComputedStyle(text).color;
        text.style.textShadow = `0 0 5px ${color}, 0 0 10px ${color}, 0 0 15px ${color}`;
    });
}

// Funkce pro pokus o znovunačtení obsahu, pokud je něco prázdné
function tryContentRecovery() {
    // Kontrola, zda jsou klíčové elementy prázdné
    const gameContent = document.getElementById('gameContent');
    const gameMobileContent = document.getElementById('gameMobileContent');
    const chatPanel = document.getElementById('chatPanel');
    const chatPanelMobile = document.getElementById('chatPanelMobileContainer');
    
    // Pokud některý z klíčových obsahů chybí, zkusíme znovu načíst
    if ((!gameContent || !gameContent.innerHTML.trim()) || 
        (!gameMobileContent || !gameMobileContent.innerHTML.trim()) ||
        (!chatPanel || !chatPanel.innerHTML.trim()) ||
        (!chatPanelMobile || !chatPanelMobile.innerHTML.trim())) {
        
        console.log('Detekován prázdný obsah, pokus o znovunačtení...');
        // Znovu načteme šablony
        initGame();
    }
}

// Funkce pro odstranění všech pulzujících animací
function removeAllPulseAnimations() {
    // Odstranění pulse animací ze všech prvků
    document.querySelectorAll('.animate__pulse').forEach(element => {
        element.classList.remove('animate__pulse', 'animate__slow', 'animate__slower', 'animate__infinite');
    });
    
    // Odstranění animací z game boxů
    document.querySelectorAll('.game-box').forEach(box => {
        box.classList.remove('animate__pulse', 'animate__slow', 'animate__infinite');
    });
    
    // Odstranění animací z chat boxů
    document.querySelectorAll('.chat-box').forEach(box => {
        box.classList.remove('animate__pulse', 'animate__slow', 'animate__infinite');
    });
    
    // Odstranění animací z nadpisů
    document.querySelectorAll('.game-title, .neon-text').forEach(text => {
        text.classList.remove('animate__pulse', 'animate__slow', 'animate__slower', 'animate__infinite');
    });
    
    console.log('Všechny pulzující animace byly odstraněny pro snazší ladění');
}

// Inicializace při načtení DOM
document.addEventListener('DOMContentLoaded', function() {
    // Nejprve odstraníme všechny pulzující animace
    removeAllPulseAnimations();
    
    // Spuštění inicializace hry
    initGame();
    
    // Kontrola, zda se stránka zobrazila správně
    setTimeout(() => {
        // Kontrola, zda se načetl obsah
        tryContentRecovery();
        // Zajištění viditelnosti prvků
        ensureElementsVisibility();
        // Vylepšení neonových efektů (bez pulzování)
        enhanceNeonEffects();
        // Detekce velikosti obrazovky
        detectExtremelySmallScreen();
        // Ještě jednou odstraníme všechny animace pulse
        removeAllPulseAnimations();
    }, 1000);
});

// Export důležitých funkcí pro možnost volání z konzole v případě problémů
window.gameDebug = {
    initGame,
    ensureElementsVisibility,
    enhanceNeonEffects,
    tryContentRecovery,
    detectExtremelySmallScreen,
    ensureChatVisibility,
    ensureChatInitialized,
    removeAllPulseAnimations
};

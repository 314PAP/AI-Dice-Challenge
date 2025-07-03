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
    // Načtení šablon
    const gameMenu = await loadTemplate('/src/templates/game-menu.html');
    const mobileGameMenu = await loadTemplate('/src/templates/game-menu-mobile-bootstrap.html');
    const mobileChat = await loadTemplate('/src/templates/chat-mobile-bootstrap.html');
    const desktopChat = await loadTemplate('/src/templates/chat.html');

    // Vložení šablon do správných kontejnerů
    document.getElementById('gameContent').innerHTML = gameMenu;
    document.getElementById('gameMobileContent').innerHTML = mobileGameMenu;
    document.getElementById('chatPanelMobileContainer').innerHTML = mobileChat;
    document.getElementById('chatPanel').innerHTML = desktopChat;
    
    // Inicializace event listenerů
    initEventListeners();
    
    // Přidání třídy pro postupné objevení
    document.querySelectorAll('.btn').forEach((btn, index) => {
        btn.classList.add('animate__animated', 'animate__fadeIn');
        btn.style.animationDelay = `${index * 0.1 + 0.5}s`;
    });
    
    // Detekce změny orientace pro přizpůsobení layoutu
    window.addEventListener('orientationchange', adjustLayoutForOrientation);
    // Spustíme také při načtení stránky
    adjustLayoutForOrientation();
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
            sendChatMessage(chatInputMobile);
        });
        
        // Odeslání zprávy stisknutím Enter
        chatInputMobile.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage(chatInputMobile);
            }
        });
    }
    
    // Další event listenery podle potřeby
    // ...
}

// Funkce pro odeslání zprávy
function sendChatMessage(inputElement) {
    const message = inputElement.value.trim();
    if (message) {
        // Zde by byla reálná implementace odesílání zprávy
        console.log('Sending message:', message);
        
        // Vyčištění vstupu
        inputElement.value = '';
        
        // Přidání zprávy do chatu pro demonstrační účely
        addChatMessage('Player', message);
    }
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

// Spuštění inicializace po načtení stránky
document.addEventListener('DOMContentLoaded', initGame);

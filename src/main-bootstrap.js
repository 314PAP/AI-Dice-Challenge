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
        // Landscape detekce
        const isLandscape = window.innerWidth > window.innerHeight;
        
        // Zjištění velmi malé výšky
        const isVerySmallHeight = window.innerHeight < 500;
        
        // Skryjeme dekorativní prvky na malých výškách
        const decorativeElements = document.querySelectorAll('.neon-dice-decoration');
        decorativeElements.forEach(el => {
            if (isVerySmallHeight) {
                el.classList.add('hide-on-small-height');
            } else {
                el.classList.remove('hide-on-small-height');
            }
        });
        
        // Upravíme velikost nadpisů
        const gameTitles = document.querySelectorAll('.game-title');
        gameTitles.forEach(title => {
            if (isVerySmallHeight) {
                title.classList.add('fs-6');
                title.classList.remove('fs-3', 'fs-4', 'fs-5');
            } else if (isLandscape) {
                title.classList.add('fs-5');
                title.classList.remove('fs-3', 'fs-4', 'fs-6');
            } else {
                title.classList.add('fs-4');
                title.classList.remove('fs-3', 'fs-5', 'fs-6');
            }
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

// Funkce pro přidání zprávy do chatu
function addChatMessage(sender, message, type = 'player') {
    // Získáme kontejnery zpráv
    const mobileMessages = document.getElementById('chatMessagesMobile');
    const desktopMessages = document.getElementById('chatMessages');
    
    // Vytvoříme nový element zprávy
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message small animate__animated animate__fadeIn';
    
    // Barva podle typu zprávy
    let colorClass = 'neon-green';
    if (type === 'system') colorClass = 'neon-yellow';
    else if (type === 'ai') colorClass = 'neon-blue';
    else if (type === 'error') colorClass = 'neon-red';
    
    // Obsah zprávy
    messageElement.innerHTML = `<strong class="${colorClass}">${sender}:</strong> <span class="${colorClass}">${message}</span>`;
    
    // Přidáme zprávu do obou chatů
    if (mobileMessages) {
        const clonedMessage = messageElement.cloneNode(true);
        mobileMessages.appendChild(clonedMessage);
        mobileMessages.scrollTop = mobileMessages.scrollHeight;
    }
    
    if (desktopMessages) {
        desktopMessages.appendChild(messageElement);
        desktopMessages.scrollTop = desktopMessages.scrollHeight;
    }
}

// Spuštění inicializace po načtení stránky
document.addEventListener('DOMContentLoaded', initGame);

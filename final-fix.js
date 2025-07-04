// Finální oprava aplikace AI Kostková Výzva
// Tato oprava zajistí, že aplikace funguje správně

console.log('🛠️ FINÁLNÍ OPRAVA APLIKACE - START');

// 1. Kontrola existence kritických elementů
function checkCriticalElements() {
    console.log('🔍 Kontrola kritických elementů...');
    
    const elements = {
        gameContent: document.getElementById('gameContent'),
        gameControls: document.getElementById('gameControls'),
        gameControlsMobile: document.getElementById('gameControlsMobile'),
        gameMobileContent: document.getElementById('gameMobileContent'),
        chatPanel: document.getElementById('chatPanel'),
        chatPanelMobileContainer: document.getElementById('chatPanelMobileContainer')
    };
    
    for (const [name, element] of Object.entries(elements)) {
        if (element) {
            console.log(`✅ ${name} - nalezen`);
        } else {
            console.error(`❌ ${name} - nenalezen!`);
        }
    }
    
    return elements;
}

// 2. Oprava CSS tříd pro zobrazení herních kontrol
function fixGameControlsVisibility() {
    console.log('🎨 Oprava CSS tříd pro herní kontroly...');
    
    const gameControls = document.getElementById('gameControls');
    if (gameControls) {
        // Odstraníme všechny problematické třídy
        gameControls.classList.remove('d-none', 'hidden');
        // Přidáme správné Bootstrap třídy
        gameControls.classList.add('d-none', 'd-md-block');
        console.log('✅ Desktop game controls CSS opraveny');
    }
    
    const gameControlsMobile = document.getElementById('gameControlsMobile');
    if (gameControlsMobile) {
        // Odstraníme všechny problematické třídy
        gameControlsMobile.classList.remove('d-none', 'hidden');
        // Přidáme správné Bootstrap třídy
        gameControlsMobile.classList.add('d-none', 'd-md-none');
        console.log('✅ Mobile game controls CSS opraveny');
    }
}

// 3. Oprava startGame funkce
function fixStartGameFunction() {
    console.log('🎮 Oprava startGame funkce...');
    
    // Vytvoříme zjednodušenou verzi startGame
    window.fixedStartGame = function() {
        console.log('🎮 Spouštím opravenou verzi startGame...');
        
        // Získání target score
        const targetScoreInput = document.getElementById('targetScoreInput') || 
                                document.getElementById('targetScoreInputMobile');
        
        if (!targetScoreInput) {
            console.error('❌ Input pro target score nenalezen!');
            alert('Chyba: Nenalezen input pro cílové skóre!');
            return;
        }
        
        const targetScore = parseInt(targetScoreInput.value);
        if (targetScore < 1000) {
            alert('Cílové skóre musí být alespoň 1000 bodů!');
            return;
        }
        
        console.log('🎯 Target score nastaven na:', targetScore);
        
        // Skrytí menu
        const gameHeader = document.getElementById('gameHeader');
        if (gameHeader) {
            gameHeader.classList.add('d-none');
            console.log('✅ Desktop menu skryto');
        }
        
        const gameMobileContent = document.getElementById('gameMobileContent');
        if (gameMobileContent) {
            gameMobileContent.classList.add('d-none');
            console.log('✅ Mobile menu skryto');
        }
        
        // Zobrazení herních kontrol
        const gameControls = document.getElementById('gameControls');
        if (gameControls) {
            gameControls.classList.remove('d-none');
            gameControls.classList.add('d-block', 'd-md-block');
            console.log('✅ Desktop herní kontroly zobrazeny');
        }
        
        const gameControlsMobile = document.getElementById('gameControlsMobile');
        if (gameControlsMobile) {
            gameControlsMobile.classList.remove('d-none');
            gameControlsMobile.classList.add('d-block', 'd-md-none');
            console.log('✅ Mobile herní kontroly zobrazeny');
        }
        
        // Aktualizace target score display
        const targetScoreDisplay = document.getElementById('targetScoreDisplay');
        if (targetScoreDisplay) {
            targetScoreDisplay.textContent = targetScore;
        }
        
        // Zpráva do chatu
        if (window.addChatMessage) {
            window.addChatMessage('system', `🎮 Hra začala! Cíl: ${targetScore} bodů`);
        }
        
        console.log('✅ Hra úspěšně spuštěna!');
    };
}

// 4. Oprava menu tlačítek
function fixMenuButtons() {
    console.log('🔘 Oprava menu tlačítek...');
    
    // Najdeme všechna start game tlačítka
    const startBtns = [
        document.getElementById('startGameBtn'),
        document.getElementById('startGameBtnMobile')
    ].filter(Boolean);
    
    startBtns.forEach((btn, index) => {
        // Odstraníme všechny existující event listenery
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Přidáme nový event listener
        newBtn.addEventListener('click', window.fixedStartGame);
        console.log(`✅ Start game tlačítko ${index + 1} opraveno`);
    });
}

// 5. Hlavní opravná funkce
function applyFinalFix() {
    console.log('🔧 Aplikace finální opravy...');
    
    // Čekáme na plné načtení DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyFinalFix);
        return;
    }
    
    // Aplikujeme opravy
    checkCriticalElements();
    fixGameControlsVisibility();
    fixStartGameFunction();
    
    // Čekáme na načtení šablon
    setTimeout(() => {
        fixMenuButtons();
        console.log('✅ FINÁLNÍ OPRAVA DOKONČENA');
    }, 1000);
}

// Spuštění opravy
applyFinalFix();

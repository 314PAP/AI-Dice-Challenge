/**
 * Test funkce pro ověření všech funkcí hry
 */

// Simuluje výhru hráče pro testování
function simulateHumanWin() {
    console.log('🧪 Simuluji výhru hráče...');
    
    // Nastav mock data
    const mockWinner = {
        id: 0,
        name: 'Vy',
        type: 'human',
        score: 10500
    };
    
    const mockGameState = {
        players: [
            { id: 0, name: 'Vy', score: 10500 },
            { id: 1, name: 'Gemini', score: 9800 },
            { id: 2, name: 'ChatGPT', score: 9200 },
            { id: 3, name: 'Claude', score: 9600 }
        ],
        targetScore: 10000
    };
    
    // Nastav mock game controller data
    window.gameController = {
        gameStartTime: new Date(Date.now() - 8 * 60 * 1000), // 8 minut zpět
        totalTurns: 15,
        calculateGameDuration: function() {
            const diff = Date.now() - this.gameStartTime.getTime();
            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    };
    
    // Zobraz modal
    showMockGameOverModal(mockWinner, mockGameState);
}

function showMockGameOverModal(winner, gameState) {
    const modal = document.getElementById('gameOverModal');
    if (!modal) return;

    // Update winner announcement
    const announcement = document.getElementById('winnerAnnouncement');
    if (announcement) {
        announcement.innerHTML = `
            <h3>🏆 ${winner.name} vyhrává!</h3>
            <p>Finální skóre: <strong>${winner.score}</strong> bodů</p>
        `;
    }

    // Update final scores
    const finalScores = document.getElementById('finalScores');
    if (finalScores) {
        const scoresHtml = gameState.players.map(player => 
            `<div class="score-row ${player.id === winner.id ? 'winner' : ''}">
                <span>${player.name}:</span> 
                <span>${player.score} bodů</span>
            </div>`
        ).join('');
        finalScores.innerHTML = `<h4>Konečné výsledky:</h4>${scoresHtml}`;
    }

    // Update game stats
    const gameStats = document.getElementById('gameStats');
    if (gameStats && window.gameController) {
        const duration = window.gameController.calculateGameDuration();
        gameStats.innerHTML = `
            <h4>Statistiky hry:</h4>
            <p>⏱️ Doba hry: ${duration}</p>
            <p>🎲 Počet tahů: ${window.gameController.totalTurns}</p>
            <p>🎯 Cílové skóre: ${gameState.targetScore}</p>
        `;
    }

    // Show signature section for human winner
    const signatureSection = document.getElementById('signatureSection');
    if (signatureSection) {
        if (winner.type === 'human') {
            signatureSection.style.display = 'block';
            const signatureInput = document.getElementById('winnerSignature');
            if (signatureInput) {
                signatureInput.value = '';
                signatureInput.focus();
            }
        } else {
            signatureSection.style.display = 'none';
        }
    }

    modal.style.display = 'block';
    
    if (window.addChatMessage) {
        window.addChatMessage('Test', `🧪 Simulace: ${winner.name} vyhrál s ${winner.score} body!`);
    }
}

// Test funkce pro Hall of Fame
function testHallOfFameWithData() {
    console.log('🧪 Testuji Hall of Fame s ukázkovými daty...');
    
    // Přidej ukázková data
    const mockHallOfFame = [
        {
            signature: 'TestPlayer1',
            score: 10500,
            targetScore: 10000,
            turns: 12,
            duration: '7:30',
            date: new Date().toLocaleDateString('cs-CZ'),
            time: new Date().toLocaleTimeString('cs-CZ')
        },
        {
            signature: 'TestPlayer2',
            score: 10250,
            targetScore: 10000,
            turns: 15,
            duration: '9:15',
            date: new Date().toLocaleDateString('cs-CZ'),
            time: new Date().toLocaleTimeString('cs-CZ')
        }
    ];
    
    localStorage.setItem('diceGameHallOfFame', JSON.stringify(mockHallOfFame));
    
    if (window.displayHallOfFame) {
        window.displayHallOfFame();
    }
    
    if (window.addChatMessage) {
        window.addChatMessage('Test', '🧪 Hall of Fame naplněn testovacími daty');
    }
}

// Vyčisti Hall of Fame
function clearHallOfFame() {
    localStorage.removeItem('diceGameHallOfFame');
    if (window.addChatMessage) {
        window.addChatMessage('Test', '🧹 Hall of Fame vyčištěn');
    }
}

// Přidej debug menu
function addDebugMenu() {
    const debugMenu = document.createElement('div');
    debugMenu.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0,0,0,0.8);
        border: 1px solid var(--neon-green);
        padding: 10px;
        border-radius: 5px;
        z-index: 2000;
        font-family: 'Orbitron', monospace;
        font-size: 12px;
    `;
    
    debugMenu.innerHTML = `
        <div style="color: var(--neon-green); margin-bottom: 10px;"><strong>🧪 Debug Menu</strong></div>
        <button onclick="simulateHumanWin()" style="display: block; margin: 5px 0; width: 100%; padding: 5px; background: var(--black-bg); color: var(--neon-green); border: 1px solid var(--neon-green); border-radius: 3px; cursor: pointer;">
            🏆 Simuluj výhru
        </button>
        <button onclick="testHallOfFameWithData()" style="display: block; margin: 5px 0; width: 100%; padding: 5px; background: var(--black-bg); color: var(--neon-blue); border: 1px solid var(--neon-blue); border-radius: 3px; cursor: pointer;">
            📊 Test Hall of Fame
        </button>
        <button onclick="clearHallOfFame()" style="display: block; margin: 5px 0; width: 100%; padding: 5px; background: var(--black-bg); color: var(--neon-pink); border: 1px solid var(--neon-pink); border-radius: 3px; cursor: pointer;">
            🧹 Vyčisti data
        </button>
    `;
    
    document.body.appendChild(debugMenu);
}

// Export funkcí pro globální použití
window.simulateHumanWin = simulateHumanWin;
window.testHallOfFameWithData = testHallOfFameWithData;
window.clearHallOfFame = clearHallOfFame;
window.addDebugMenu = addDebugMenu;

console.log('🧪 Debug funkce načteny');

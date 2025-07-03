/**
 * Hall of Fame Management
 * Správa síně slávy pro ukládání a zobrazování výsledků
 */

/**
 * Uloží výsledek hry do síně slávy
 * @param {Object} gameResult - Výsledek hry
 */
export function saveGameResult(gameResult) {
    const savedGames = getHallOfFame();
    savedGames.push(gameResult);
    
    // Seřadit podle skóre (nejvyšší první) a data
    savedGames.sort((a, b) => {
        if (b.winnerScore !== a.winnerScore) {
            return b.winnerScore - a.winnerScore;
        }
        return new Date(b.date) - new Date(a.date);
    });
    
    localStorage.setItem('diceGameHallOfFame', JSON.stringify(savedGames));
}

/**
 * Získá všechny záznamy ze síně slávy
 * @returns {Array} Pole výsledků her
 */
export function getHallOfFame() {
    return JSON.parse(localStorage.getItem('diceGameHallOfFame') || '[]');
}

/**
 * Zobrazí síň slávy v modalu
 */
export function displayHallOfFame() {
    const modal = document.getElementById('hallOfFameModal');
    const list = document.getElementById('hallOfFameList');
    const games = getHallOfFame();
    
    if (games.length === 0) {
        list.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--neon-green);">
                <h3>🏆 Síň slávy je prázdná</h3>
                <p>Zatím žádné záznamy...</p>
                <p style="font-size: 14px; opacity: 0.7;">Vyhrajte hru a zapište se do historie!</p>
            </div>
        `;
    } else {
        list.innerHTML = games.map((game, index) => {
            const date = new Date(game.date);
            const formattedDate = date.toLocaleDateString('cs-CZ', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const duration = formatDuration(game.gameDuration);
            const efficiency = Math.round(game.winnerScore / game.totalTurns);
            
            return `
                <div class="hall-of-fame-entry ${game.winner === 'Vy' ? 'winner' : ''}">
                    <div class="rank-number">#${index + 1}</div>
                    <div>
                        <div class="entry-header">🏆 ${game.winner} (${game.signature || 'Anonym'})</div>
                        <div class="entry-stats">
                            🎯 ${game.winnerScore}/${game.targetScore} bodů<br>
                            ⏱️ ${duration} (${game.totalTurns} tahů)<br>
                            📊 ${efficiency} bodů/tah
                        </div>
                    </div>
                    <div class="entry-details">
                        📅 ${formattedDate}<br>
                        ${game.finalScores ? game.finalScores.map(p => `${p.name}: ${p.score}`).join('<br>') : 'Skóre nedostupné'}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    modal.classList.remove('hidden');
}

/**
 * Skryje síň slávy a správně ošetří návrat na odpovídající obrazovku
 */
export function hideHallOfFame() {
    console.log('🏆 Skrývám Hall of Fame modal...');
    
    const modal = document.getElementById('hallOfFameModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('visible');
    }
    
    // Získáme aktuální stav hry
    const gameState = window.gameState || {};
    
    // Pokud byla hra ukončena, vrátíme se na hlavní menu místo zobrazení modalu konce hry
    if (gameState.gameEnded) {
        console.log('🎮 Hra byla již ukončena - vracím se do hlavního menu');
        
        // Prevence emergency módu - zrušení všech AI timeoutů
        if (window.endAITurn) {
            console.log('🛑 Preventivně ukončuji AI tahy');
            window.endAITurn();
        }
        
        if (window.clearAllAITimeouts) {
            console.log('🛑 Čistím všechny AI timeouty');
            window.clearAllAITimeouts();
        }
        
        // Vracíme se přímo do hlavního menu
        if (window.returnToMainMenu) {
            console.log('� Vracím se do hlavního menu po zobrazení síně slávy');
            window.returnToMainMenu();
        } else {
            // Fallback pokud funkce returnToMainMenu není dostupná
            console.error('⚠️ Funkce returnToMainMenu není dostupná, používám fallback řešení');
            
            // Základní skrytí všech modalů
            const gameOverModal = document.getElementById('gameOverModal');
            if (gameOverModal) {
                gameOverModal.classList.add('hidden');
            }
            
            // Zobrazíme hlavní menu komponenty
            const targetScoreSetup = document.getElementById('targetScoreSetup');
            if (targetScoreSetup) {
                targetScoreSetup.classList.remove('hidden');
            }
            
            // Resetujeme další prvky UI
            document.body.classList.remove('game-active');
        }
    }
}

/**
 * Vymaže všechny záznamy ze síně slávy
 */
export function clearHallOfFame() {
    localStorage.removeItem('diceGameHallOfFame');
}

/**
 * Formátuje dobu trvání hry
 * @param {number} milliseconds - Doba v milisekundách
 * @returns {string} Formátovaná doba
 */
function formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}

/**
 * Vytvoří objekt výsledku hry
 * @param {Object} gameState - Stav hry
 * @param {string} signature - Podpis vítěze
 * @param {number} startTime - Čas začátku hry
 * @param {number} totalTurns - Celkový počet tahů
 * @returns {Object} Objekt výsledku hry
 */
export function createGameResult(gameState, signature, startTime, totalTurns) {
    const winner = gameState.players.reduce((prev, current) => 
        (prev.score > current.score) ? prev : current);
    
    return {
        id: Date.now(), // Unikátní ID
        date: new Date().toISOString(),
        signature: signature,
        winner: winner.name,
        winnerScore: winner.score,
        targetScore: gameState.targetScore,
        finalScores: gameState.players.map(p => ({ 
            name: p.name, 
            score: p.score 
        })),
        gameDuration: Date.now() - startTime,
        totalTurns: totalTurns,
        gameType: 'Farkle'
    };
}

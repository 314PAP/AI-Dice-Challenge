/**
 * AI Reactions Controller
 * Manages AI reactions, trash talk, banter, and dynamic game responses
 */

import { gameState } from '../gameState.js';
import { enhancedAI } from '../../../ai/controllers/enhancedAIController.js';

/**
 * Spustí AI reakce po dobrém hodu
 */
export function triggerAIAfterGoodRoll(score, _playerName) {
    if (Math.random() < 0.3) { // 30% šance
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        const selectedAI = aiTypes[Math.floor(Math.random() * aiTypes.length)];
        
        const reactions = {
            gemini: [
                `Statisticky máš jen ${Math.round(Math.random() * 40 + 20)}% šanci na výhru 📊`,
                `${score} bodů? Můj algoritmus očekával víc 🤖`,
                'Data ukazují vzestupný trend... zatím 📈'
            ],
            chatgpt: [
                'Nice roll! But I\'m still gonna crush you! 😎🎲',
                `${score} bodů? Not bad, not bad! 💪`,
                'Okay, that was actually pretty good! 👏✨'
            ],
            claude: [
                'Výborný tah! Strategie se ti vyvíjí 🎯',
                `${score} bodů... moudré rozhodnutí 🧘`,
                'Tak se mi to líbí! Pokračuj v této cestě 🌟'
            ]
        };
        
        const response = reactions[selectedAI][Math.floor(Math.random() * reactions[selectedAI].length)];
        setTimeout(() => window.addChatMessage(selectedAI, response), 500 + Math.random() * 1000);
    }
}

/**
 * Spustí AI hecování po špatném hodu
 */
export function triggerAIAfterBadRoll(score, _playerName) {
    if (Math.random() < 0.4) { // 40% šance
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        const selectedAI = aiTypes[Math.floor(Math.random() * aiTypes.length)];
        
        const reactions = {
            gemini: [
                `${score} bodů? Error: Expected value too low 📉`,
                'Výpočet rizika selhal. Recalibrating... 🤖',
                'Suboptimální výsledek podle predikcí 📊'
            ],
            chatgpt: [
                'Ouch! That hurt to watch! 😅🎲',
                `${score} bodů? Maybe buy some luck online! 🛒✨`,
                'Kostky tě fakt nemají rády, co? 🤣'
            ],
            claude: [
                `${score} bodů... někdy je štěstí proměnlivé 🤔`,
                'Moudrost říká: i z neúspěchu se učíme 📚',
                'Takové jsou kostky života... 🎭'
            ]
        };
        
        const response = reactions[selectedAI][Math.floor(Math.random() * reactions[selectedAI].length)];
        setTimeout(() => window.addChatMessage(selectedAI, response), 300 + Math.random() * 800);
    }
}

/**
 * Spustí AI hecování po farkle
 */
export function triggerFarkleHeckling(_playerName) {
    if (Math.random() < 0.7) { // 70% šance na hecování po farkle
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        const selectedAI = aiTypes[Math.floor(Math.random() * aiTypes.length)];
        
        const farkleReactions = {
            gemini: [
                'FARKLE! Probability of this: 2.31% 📉❌',
                'Statistika neúprosná: FARKLE detected! 🤖💥',
                'Error 404: Bodující kostky not found! 🔍❌'
            ],
            chatgpt: [
                'OOOOOF! That\'s a big fat FARKLE! 💥😂',
                'Farkle! The dice are roasting you hard! 🔥🎲',
                'HAHA! That was painful to watch! 😅❌'
            ],
            claude: [
                'Ach, farkle... osud je nevyzpytatelný 🎭❌',
                'Takový je život kostkaře... 🌙💫',
                'I to je část cesty k moudrosti 📚✨'
            ]
        };
        
        const reactions = farkleReactions[selectedAI];
        const response = reactions[Math.floor(Math.random() * reactions.length)];
        setTimeout(() => window.addChatMessage(selectedAI, response), 800 + Math.random() * 1200);
    }
}

/**
 * Náhodný AI trash talk
 */
export function triggerRandomAITrashTalk() {
    if (Math.random() < 0.15) { // 15% šance
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        const selectedAI = aiTypes[Math.floor(Math.random() * aiTypes.length)];
        
        const reaction = enhancedAI.generateTrashTalk(selectedAI, 'human');
        if (reaction) {
            setTimeout(() => window.addChatMessage(selectedAI, reaction), 1500 + Math.random() * 2000);
        }
    }
}

/**
 * AI banter mezi sebou
 */
export function triggerAIBanter() {
    if (Math.random() < 0.2) { // 20% šance
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        const initiator = aiTypes[Math.floor(Math.random() * aiTypes.length)];
        
        const banter = enhancedAI.generateAIBanter(initiator);
        if (banter) {
            setTimeout(() => window.addChatMessage('system', banter), 2000 + Math.random() * 3000);
        }
    }
}

/**
 * Komentáře při vysokém napětí
 */
export function triggerAIHighTensionComment() {
    // Najít hráče blízko cíli
    const closeToWin = gameState.players.some(player => 
        player.score >= gameState.targetScore * 0.8
    );
    
    if (closeToWin && Math.random() < 0.6) { // 60% šance při vysokém napětí
        const aiTypes = ['gemini', 'chatgpt', 'claude'];
        const selectedAI = aiTypes[Math.floor(Math.random() * aiTypes.length)];
        
        const tensionComments = {
            gemini: [
                'Napětí roste exponenciálně! 📈⚡',
                'Critical phase detected! All systems alert! 🚨',
                'Statistical variance approaching maximum! 📊🔥'
            ],
            chatgpt: [
                'Whoa! Things are getting spicy! 🌶️🔥',
                'Plot twist incoming! 🎬✨',
                'This is where legends are made! 🏆⚡'
            ],
            claude: [
                'Napětí hustne... moment pravdy se blíží 🎭',
                'Ve vzduchu je cítit osud... 🌙⚡',
                'Takové chvíle definují charaktery 💎'
            ]
        };
        
        const comments = tensionComments[selectedAI];
        const response = comments[Math.floor(Math.random() * comments.length)];
        
        setTimeout(() => window.addChatMessage(selectedAI, response), 800 + Math.random() * 1200);
    }
}

/**
 * Dynamické AI komentáře podle herní situace
 */
export function triggerSituationalComment(situation, data = {}) {
    const aiTypes = ['gemini', 'chatgpt', 'claude'];
    const selectedAI = aiTypes[Math.floor(Math.random() * aiTypes.length)];
    
    let response = '';
    
    switch (situation) {
        case 'highScore': {
            const highScoreComments = {
                gemini: [`Impressive roll! Probability analysis shows ${data.score} points! 📊🎯`],
                chatgpt: [`WHOA! ${data.score} points? That's some serious dice magic! ✨🎲`],
                claude: [`${data.score} bodů... to je výjimečný výkon 🌟`]
            };
            response = highScoreComments[selectedAI][0];
            break;
        }
        case 'comeback': {
            const comebackComments = {
                gemini: [`Comeback probability increasing: ${Math.round(Math.random() * 30 + 40)}% 📈`],
                chatgpt: ['Plot twist! Someone\'s making a COMEBACK! 🎬🔥'],
                claude: ['Osud se otáčí... comeback je možný 🔄⭐']
            };
            response = comebackComments[selectedAI][0];
            break;
        }
        case 'closeGame': {
            const closeGameComments = {
                gemini: [`Game proximity alert! Margin: ${data.margin} points! 🚨`],
                chatgpt: [`This is TIGHT! Only ${data.margin} points apart! 😱⚡`],
                claude: [`Rozdíl pouhých ${data.margin} bodů... napětí vrcholí 🎭`]
            };
            response = closeGameComments[selectedAI][0];
            break;
        }
    }
    
    if (response) {
        setTimeout(() => window.addChatMessage(selectedAI, response), 500 + Math.random() * 1000);
    }
}

// Export všech funkcí pro globální přístup
window.triggerAIAfterGoodRoll = triggerAIAfterGoodRoll;
window.triggerAIAfterBadRoll = triggerAIAfterBadRoll;
window.triggerFarkleHeckling = triggerFarkleHeckling;
window.triggerRandomAITrashTalk = triggerRandomAITrashTalk;
window.triggerAIBanter = triggerAIBanter;
window.triggerAIHighTensionComment = triggerAIHighTensionComment;
window.triggerSituationalComment = triggerSituationalComment;

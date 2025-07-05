// Rychlý test pro simulaci problému se startGame
// Spustit v konzoli na http://localhost:8000

console.log('🧪 Testování startGame problému...');

// Simulace problému - co se stane když targetScoreInput neexistuje
console.log('🔍 Test 1: Existence targetScoreInput');
const targetScoreInput = document.getElementById('targetScoreInput');
console.log('targetScoreInput:', targetScoreInput);

// Simulace problému - co se stane když targetScoreInputMobile neexistuje
console.log('🔍 Test 2: Existence targetScoreInputMobile');
const targetScoreInputMobile = document.getElementById('targetScoreInputMobile');
console.log('targetScoreInputMobile:', targetScoreInputMobile);

// Test naší getTargetScore funkce
console.log('🔍 Test 3: getTargetScore funkce');
function getTargetScore() {
  const inputDesktop = document.getElementById('targetScoreInput');
  const inputMobile = document.getElementById('targetScoreInputMobile');
  return parseInt((inputDesktop?.value || inputMobile?.value || '10000'), 10);
}

const targetScore = getTargetScore();
console.log('targetScore z getTargetScore:', targetScore);

// Test startGame importu
console.log('🔍 Test 4: startGame import');
import('./src/js/game/controllers/gameFlowController.js').then(module => {
  console.log('startGame import:', module.startGame);
  
  // Zkusíme volat startGame s existujícím targetScoreInput
  if (targetScoreInput) {
    console.log('✅ targetScoreInput existuje, zkouším startGame');
    try {
      module.startGame();
      console.log('✅ startGame úspěšné');
    } catch (error) {
      console.error('❌ startGame chyba:', error);
    }
  } else {
    console.log('❌ targetScoreInput neexistuje, vytvořím dočasný');
    const tempInput = document.createElement('input');
    tempInput.id = 'targetScoreInput';
    tempInput.value = targetScore.toString();
    tempInput.style.display = 'none';
    document.body.appendChild(tempInput);
    
    try {
      module.startGame();
      console.log('✅ startGame úspěšné s dočasným inputem');
    } catch (error) {
      console.error('❌ startGame chyba i s dočasným inputem:', error);
    }
  }
}).catch(error => {
  console.error('❌ Import startGame selhal:', error);
});

console.log('🏁 Test dokončen');

// Jednoduchý skript pro rychlé testování menu tlačítek z konzole
console.log('🔧 Diagnostický nástroj pro menu tlačítka');

// Funkce pro rychlé ověření stavu tlačítek
window.quickMenuTest = function() {
    console.log('\n🚀 RYCHLÝ TEST MENU TLAČÍTEK');
    console.log('================================');
    
    // Seznam všech tlačítek
    const buttons = [
        { id: 'startGameBtn', name: 'Start Game (Desktop)' },
        { id: 'startGameBtnMobile', name: 'Start Game (Mobile)' },
        { id: 'rulesBtn', name: 'Pravidla (Desktop)' },
        { id: 'rulesBtnMobile', name: 'Pravidla (Mobile)' },
        { id: 'hallOfFameBtn', name: 'Síň slávy (Desktop)' },
        { id: 'hallOfFameBtnMobile', name: 'Síň slávy (Mobile)' },
        { id: 'exitGameBtn', name: 'Opustit hru (Desktop)' },
        { id: 'exitGameBtnMobile', name: 'Opustit hru (Mobile)' }
    ];
    
    buttons.forEach(btn => {
        const element = document.getElementById(btn.id);
        if (element) {
            console.log(`✅ ${btn.name}: NALEZENO`);
            // Test základních vlastností
            console.log(`   Visible: ${element.style.display !== 'none'}`);
            console.log(`   Enabled: ${!element.disabled}`);
        } else {
            console.log(`❌ ${btn.name}: NENALEZENO`);
        }
    });
    
    // Test modalů
    console.log('\n📋 KONTROLA MODALŮ:');
    const modals = [
        { id: 'rulesModal', name: 'Pravidla Modal' },
        { id: 'hallOfFameModal', name: 'Síň slávy Modal' },
        { id: 'gameOverModal', name: 'Konec hry Modal' }
    ];
    
    modals.forEach(modal => {
        const element = document.getElementById(modal.id);
        console.log(`${element ? '✅' : '❌'} ${modal.name}: ${element ? 'NALEZEN' : 'NENALEZEN'}`);
    });
};

// Funkce pro test konkrétního tlačítka
window.testButton = function(buttonId) {
    console.log(`\n🔍 TEST TLAČÍTKA: ${buttonId}`);
    const btn = document.getElementById(buttonId);
    if (btn) {
        console.log('✅ Tlačítko nalezeno, spouštím klik...');
        btn.click();
        console.log('✅ Klik proveden');
    } else {
        console.log('❌ Tlačítko nenalezeno');
    }
};

// Funkce pro zobrazení všech dostupných ID v DOM
window.listAllIds = function() {
    console.log('\n📋 VŠECHNA ID V DOM:');
    const elements = document.querySelectorAll('[id]');
    elements.forEach(el => {
        console.log(`- ${el.id} (${el.tagName.toLowerCase()})`);
    });
};

// Automatické spuštění základního testu
console.log('💡 Dostupné funkce:');
console.log('- quickMenuTest() - rychlý test všech tlačítek');
console.log('- testButton("id") - test konkrétního tlačítka');
console.log('- listAllIds() - seznam všech ID v DOM');
console.log('\n🔄 Spouštím základní test za 3 sekundy...');

setTimeout(() => {
    if (typeof window.quickMenuTest === 'function') {
        window.quickMenuTest();
    }
}, 3000);

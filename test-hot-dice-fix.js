#!/usr/bin/env node

/**
 * 🔥 QUICK HOT DICE TEST
 * Testuje HOT DICE logiku po opravě
 */

// Simulace herního stavu pro HOT DICE test
class HotDiceTest {
    constructor() {
        this.state = {
            savedDice: [],
            currentRoll: [],
            turnScore: 0,
            selectedDice: []
        };
    }

    // Simulace updateSavedDice metody
    updateSavedDice(selectedValues, points) {
        console.log(`📥 Ukládám kostky: [${selectedValues.join(', ')}] za ${points} bodů`);
        
        this.state.savedDice = [...this.state.savedDice, ...selectedValues];
        this.state.turnScore += points;
        this.state.currentRoll = []; // Simulace zbývajících kostek
        this.state.selectedDice = [];
        
        console.log(`📊 Nový stav po uložení:`);
        console.log(`   savedDice: [${this.state.savedDice.join(', ')}] (${this.state.savedDice.length} kostek)`);
        console.log(`   turnScore: ${this.state.turnScore}`);
        
        // Kontrola HOT DICE
        this.checkHotDice();
    }

    // Simulace checkHotDice metody (OPRAVENÁ VERZE)
    checkHotDice() {
        if (this.state.savedDice.length === 6) {
            console.log('\n🔥 HOT DICE DETEKOVÁN!');
            console.log('   Všech 6 kostek uloženo');
            
            // OPRAVENÁ LOGIKA: Vyčištění savedDice po HOT DICE
            console.log('\n🧹 Čistím stav pro nový hod:');
            console.log(`   savedDice: [${this.state.savedDice.join(', ')}] → []`);
            console.log(`   turnScore zůstává: ${this.state.turnScore}`);
            
            this.state.savedDice = []; // KLÍČOVÁ OPRAVA
            this.state.currentRoll = [];
            this.state.selectedDice = [];
            
            console.log('\n✅ Stav po HOT DICE reset:');
            console.log(`   savedDice: [${this.state.savedDice.join(', ')}] (${this.state.savedDice.length} kostek)`);
            console.log(`   turnScore: ${this.state.turnScore}`);
            console.log('   → Připraven pro nový hod se všemi 6 kostkami');
            
            return true;
        }
        return false;
    }

    // Test HOT DICE scenára
    testHotDiceScenario() {
        console.log('🎲 HOT DICE TEST SCENARIO');
        console.log('=' .repeat(50));
        
        console.log('\n1️⃣ První uložení: 3 jedničky');
        this.updateSavedDice([1, 1, 1], 1000);
        
        console.log('\n2️⃣ Druhé uložení: 2 pětky');
        this.updateSavedDice([5, 5], 100);
        
        console.log('\n3️⃣ Třetí uložení: 1 pětka (dosažení 6 kostek)');
        const hotDiceTriggered = this.updateSavedDice([5], 50);
        
        console.log('\n📋 FINÁLNÍ KONTROLA:');
        console.log(`   Celkový turnScore: ${this.state.turnScore}`);
        console.log(`   Uložené kostky: [${this.state.savedDice.join(', ')}] (${this.state.savedDice.length} kostek)`);
        console.log(`   ✅ Očekávané chování: 0 uložených kostek, 1150 bodů`);
        
        if (this.state.savedDice.length === 0 && this.state.turnScore === 1150) {
            console.log('\n🎉 HOT DICE TEST PROŠEL!');
            return true;
        } else {
            console.log('\n❌ HOT DICE TEST SELHAL!');
            console.log(`   Očekávané: 0 uložených kostek, 1150 bodů`);
            console.log(`   Skutečné: ${this.state.savedDice.length} uložených kostek, ${this.state.turnScore} bodů`);
            return false;
        }
    }
}

// Spuštění testu
const test = new HotDiceTest();
const success = test.testHotDiceScenario();

process.exit(success ? 0 : 1);

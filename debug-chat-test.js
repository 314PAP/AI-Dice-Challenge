// Rychlý test pro developer console
// Spustit v prohlížeči na http://localhost:5176

console.log('🧪 Testování chat funkcí...');

// Test 1: Ověříme, že proxy funkce existuje
console.log('1. Test proxy funkce:');
console.log('   window.addChatMessage:', typeof window.addChatMessage);
console.log('   window.addChatMessageBootstrap:', typeof window.addChatMessageBootstrap);

// Test 2: Přidáme systémovou zprávu
console.log('2. Přidáváme systémovou zprávu...');
if (typeof window.addChatMessage === 'function') {
    window.addChatMessage('system', '🧪 TEST: Toto je testovací systémová zpráva - měla by být ŽLUTÁ');
    console.log('   ✅ Systémová zpráva přidána');
} else {
    console.log('   ❌ Funkce addChatMessage není dostupná');
}

// Test 3: Přidáme různé typy zpráv
console.log('3. Přidáváme různé typy zpráv...');
if (typeof window.addChatMessage === 'function') {
    window.addChatMessage('player', '🧪 TEST: Hráčská zpráva (zelená)');
    window.addChatMessage('ai', '🧪 TEST: AI zpráva (modrá)');
    window.addChatMessage('error', '🧪 TEST: Chybová zpráva (červená)');
    console.log('   ✅ Všechny typy zpráv přidány');
}

// Test 4: Zkontrolujeme CSS proměnné
console.log('4. Kontrola CSS proměnných:');
const root = document.documentElement;
const computedStyle = getComputedStyle(root);
console.log('   --neon-yellow:', computedStyle.getPropertyValue('--neon-yellow'));
console.log('   --neon-green:', computedStyle.getPropertyValue('--neon-green'));
console.log('   --neon-blue:', computedStyle.getPropertyValue('--neon-blue'));
console.log('   --neon-red:', computedStyle.getPropertyValue('--neon-red'));

// Test 5: Zkontrolujeme chat outer container
console.log('5. Kontrola chat outer container:');
const chatOuter = document.querySelector('.chat-outer-container');
if (chatOuter) {
    const style = getComputedStyle(chatOuter);
    console.log('   box-shadow:', style.boxShadow);
    console.log('   transition:', style.transition);
    console.log('   ✅ Chat outer container nalezen');
} else {
    console.log('   ❌ Chat outer container nenalezen');
}

// Test 6: Zkontrolujeme systémové zprávy
console.log('6. Kontrola systémových zpráv:');
const systemMessages = document.querySelectorAll('.system-message .neon-yellow');
console.log('   Počet systémových zpráv s .neon-yellow:', systemMessages.length);
if (systemMessages.length > 0) {
    const firstSystemMessage = systemMessages[0];
    const style = getComputedStyle(firstSystemMessage);
    console.log('   Barva první systémové zprávy:', style.color);
    console.log('   Text-shadow:', style.textShadow);
    console.log('   ✅ Systémové zprávy nalezeny');
} else {
    console.log('   ❌ Žádné systémové zprávy s .neon-yellow nenalezeny');
}

console.log('🧪 Test dokončen. Zkontrolujte výsledky výše a vizuálně v aplikaci.');

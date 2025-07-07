// Debug script pro analýzu problémů s aplikací
console.log('🔍 DEBUGGING APPLICATION...');

// 1. Kontrola základních DOM elementů
function checkDOMElements() {
    console.log('\n=== DOM ELEMENTS CHECK ===');
    
    const elements = [
        'gameContent',
        'gameMobileContent', 
        'chatPanel',
        'chatPanelMobileContainer'
    ];
    
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            console.log(`✅ ${id}:`, {
                exists: true,
                innerHTML: el.innerHTML.length > 0 ? `${el.innerHTML.length} chars` : 'EMPTY',
                classes: el.className,
                computed: {
                    display: window.getComputedStyle(el).display,
                    visibility: window.getComputedStyle(el).visibility,
                    opacity: window.getComputedStyle(el).opacity
                }
            });
        } else {
            console.log(`❌ ${id}: NOT FOUND`);
        }
    });
}

// 2. Kontrola CSS proměnných
function checkCSSVariables() {
    console.log('\n=== CSS VARIABLES CHECK ===');
    
    const root = document.documentElement;
    const computedStyle = window.getComputedStyle(root);
    
    const variables = [
        '--neon-green',
        '--neon-blue',
        '--neon-orange',
        '--neon-pink'
    ];
    
    variables.forEach(varName => {
        const value = computedStyle.getPropertyValue(varName);
        console.log(`${varName}:`, value || 'NOT DEFINED');
    });
}

// 3. Kontrola načtených stylů
function checkLoadedStyles() {
    console.log('\n=== LOADED STYLESHEETS ===');
    
    const stylesheets = Array.from(document.styleSheets);
    stylesheets.forEach((sheet, index) => {
        try {
            console.log(`${index + 1}. ${sheet.href || 'inline'}`);
        } catch (e) {
            console.log(`${index + 1}. [CORS blocked or error]`);
        }
    });
}

// 4. Kontrola Bootstrap tříd
function checkBootstrapClasses() {
    console.log('\n=== BOOTSTRAP CLASSES CHECK ===');
    
    // Zkusíme najít prvky s Bootstrap třídami
    const bootstrapSelectors = [
        '.container-fluid',
        '.d-flex',
        '.h-100',
        '.row',
        '.col-md-8',
        '.col-md-4'
    ];
    
    bootstrapSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        console.log(`${selector}: ${elements.length} elements`);
    });
}

// 5. Kontrola chyb v konzoli
function checkConsoleErrors() {
    console.log('\n=== CONSOLE ERRORS CHECK ===');
    
    // Přepíšeme console.error pro zachycení chyb
    const originalError = console.error;
    const errors = [];
    
    console.error = function(...args) {
        errors.push(args);
        originalError.apply(console, args);
    };
    
    setTimeout(() => {
        console.log('Zachycené chyby:', errors);
    }, 1000);
}

// Spuštění diagnostiky
setTimeout(() => {
    checkDOMElements();
    checkCSSVariables();
    checkLoadedStyles();
    checkBootstrapClasses();
    checkConsoleErrors();
}, 2000);

// Export pro použití v konzoli
window.debugApp = {
    checkDOMElements,
    checkCSSVariables,
    checkLoadedStyles,
    checkBootstrapClasses
};

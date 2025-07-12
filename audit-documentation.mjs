// Audit dokumentace v hlavičkách souborů - hledání nesrovnalostí
import { readFile } from 'fs/promises';
import { join } from 'path';

const filesToCheck = [
    'src/js/game/diceMechanics.js',
    'src/js/ai/aiPlayerController.js',
    'src/js/game/gameState.js',
    'src/js/ai/chatSystem.js'
];

console.log('=== AUDIT DOKUMENTACE V HLAVIČKÁCH ===\n');

for (const file of filesToCheck) {
    try {
        const content = await readFile(file, 'utf-8');
        const lines = content.split('\n');
        
        console.log(`📁 SOUBOR: ${file}`);
        
        // Najdeme sekci s proměnnými
        let variablesSection = '';
        let inVariablesSection = false;
        
        for (const line of lines) {
            if (line.includes('SEZNAM PROMĚNNÝCH') || line.includes('SEZNAM POUŽÍVANÝCH')) {
                inVariablesSection = true;
                variablesSection += line + '\n';
                continue;
            }
            
            if (inVariablesSection) {
                if (line.includes('*/') || line.includes('MOŽNÉ DUPLICITY')) {
                    variablesSection += line + '\n';
                    break;
                }
                variablesSection += line + '\n';
            }
        }
        
        if (variablesSection) {
            console.log('📝 Dokumentace proměnných:');
            console.log(variablesSection);
        } else {
            console.log('❌ Žádná dokumentace proměnných nenalezena');
        }
        
        // Zkontroluj exporty
        const exports = content.match(/export\s+(const|function|class)\s+(\w+)/g) || [];
        console.log('📤 Exportované funkce/objekty:');
        exports.forEach(exp => console.log(`  - ${exp}`));
        
        console.log(''.padEnd(50, '-') + '\n');
        
    } catch (error) {
        console.error(`❌ Chyba při čtení ${file}:`, error.message);
    }
}

console.log('=== AUDIT DOKONČEN ===');

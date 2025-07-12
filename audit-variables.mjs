// Audit všech změněných proměnných v dokumentaci souborů
import { readFile } from 'fs/promises';

const filesToAudit = [
    'src/js/game/diceMechanics.js',
    'src/js/ai/aiPlayerController.js',
    'src/js/game/gameState.js',
    'src/js/ai/chatSystem.js'
];

console.log('=== AUDIT ZMĚNĚNÝCH PROMĚNNÝCH V DOKUMENTACI ===\n');

async function findVariablesInCode(content) {
    const lines = content.split('\n');
    const variables = new Set();
    
    // Hledáme let, const, var deklarace
    const variableRegex = /\b(?:let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    
    for (const line of lines) {
        let match;
        while ((match = variableRegex.exec(line)) !== null) {
            variables.add(match[1]);
        }
    }
    
    // Hledáme přiřazení proměnných
    const assignmentRegex = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g;
    
    for (const line of lines) {
        let match;
        while ((match = assignmentRegex.exec(line)) !== null) {
            if (!['export', 'import', 'return', 'this'].includes(match[1])) {
                variables.add(match[1]);
            }
        }
    }
    
    return Array.from(variables).sort();
}

function extractDocumentedVariables(content) {
    const lines = content.split('\n');
    let inVariablesSection = false;
    let documentedVars = [];
    
    for (const line of lines) {
        if (line.includes('SEZNAM PROMĚNNÝCH')) {
            inVariablesSection = true;
            continue;
        }
        
        if (inVariablesSection) {
            if (line.includes('*/') || line.includes('MOŽNÉ DUPLICITY')) {
                break;
            }
            
            // Extrahuj proměnné z řádku
            const vars = line.match(/\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g);
            if (vars) {
                documentedVars.push(...vars.filter(v => 
                    !['lokální', 'metodách', 'stav', 'objekty', 'instance', 'SEZNAM', 'PROMĚNNÝCH', 'NOVÉ', 'PO', 'OPRAVÁCH', 'pro', 'bez', 'správné', 'řízení', 'AI', 'rozhodování', 'HLAVNÍ', 'STATE', 'pole', 'hráčů', 'index', 'aktivního', 'hráče', 'kostky', 'stole', 'posledním', 'hodu', 'odložené', 'během', 'aktuálního', 'tahu', 'označené', 'odložení', 'akumulované', 'body', 'cílové', 'skóre', 'výhru', 'obvykle', 'flag', 'ukončení', 'hry', 'vítězný', 'probíhající', 'zpracování'].includes(v)
                ));
            }
        }
    }
    
    return [...new Set(documentedVars)].sort();
}

for (const file of filesToAudit) {
    try {
        const content = await readFile(file, 'utf-8');
        
        console.log(`📁 SOUBOR: ${file}`);
        console.log(''.padEnd(50, '='));
        
        const actualVars = await findVariablesInCode(content);
        const documentedVars = extractDocumentedVariables(content);
        
        console.log(`📝 Dokumentované proměnné (${documentedVars.length}):`);
        console.log(`   ${documentedVars.join(', ')}`);
        
        console.log(`💻 Skutečné proměnné v kódu (${actualVars.length}):`);
        console.log(`   ${actualVars.slice(0, 20).join(', ')}${actualVars.length > 20 ? '...' : ''}`);
        
        // Najdi chybějící v dokumentaci
        const missing = actualVars.filter(v => !documentedVars.includes(v));
        const extra = documentedVars.filter(v => !actualVars.includes(v));
        
        if (missing.length > 0) {
            console.log(`❌ CHYBÍ V DOKUMENTACI (${missing.length}):`);
            console.log(`   ${missing.join(', ')}`);
        }
        
        if (extra.length > 0) {
            console.log(`⚠️  NAVÍC V DOKUMENTACI (${extra.length}):`);
            console.log(`   ${extra.join(', ')}`);
        }
        
        if (missing.length === 0 && extra.length === 0) {
            console.log('✅ DOKUMENTACE JE KOMPLETNÍ');
        }
        
        console.log('\n');
        
    } catch (error) {
        console.error(`❌ Chyba při čtení ${file}:`, error.message);
    }
}

console.log('=== AUDIT DOKONČEN ===');

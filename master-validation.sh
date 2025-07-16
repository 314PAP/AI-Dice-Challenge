#!/bin/bash

# 🎲 AI DICE CHALLENGE - MASTER VALIDATION SYSTEM
# ══════════════════════════════════════════════════════════════════════
# Sjednocený test systém - spouští všechny kontroly po každém zápisu
# Rychlé validace + kompletní testy + live monitoring
# ══════════════════════════════════════════════════════════════════════

set -e  # Zastaví při chybě

# 🎨 BAREVNÉ VÝSTUPY
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# 📊 STATISTIKY
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNINGS=0

# 🔧 HELPER FUNKCE
print_header() {
    echo -e "\n${CYAN}════════════════════════════════════════════════${NC}"
    echo -e "${WHITE}$1${NC}"
    echo -e "${CYAN}════════════════════════════════════════════════${NC}"
}

print_step() {
    echo -e "\n${BLUE}$1${NC}"
    echo -e "${BLUE}────────────────────────────────────────────────${NC}"
}

check_result() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "${RED}❌ $2${NC}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
}

warning_result() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    WARNINGS=$((WARNINGS + 1))
}

# 🚀 ZAČÁTEK MASTER VALIDACE
print_header "🎲 AI DICE CHALLENGE - MASTER VALIDATION"
echo -e "${WHITE}Datum:${NC} $(date)"
echo -e "${WHITE}Commit:${NC} $(git rev-parse --short HEAD 2>/dev/null || echo 'N/A')"
echo -e "${WHITE}Branch:${NC} $(git branch --show-current 2>/dev/null || echo 'N/A')"

# ═══════════════════════════════════════════════════════════════════════
# 🔍 FÁZE 1: QUICK VALIDATION (rychlé kontroly)
# ═══════════════════════════════════════════════════════════════════════

print_step "🔍 FÁZE 1: RYCHLÉ KONTROLY"

# Kontrola základních souborů
echo "📁 Kontroluji existenci klíčových souborů..."
for file in "package.json" "index.html" "src/js/main.js" "src/styles/main.css"; do
    if [ -f "$file" ]; then
        check_result 0 "Soubor $file existuje"
    else
        check_result 1 "Soubor $file chybí"
    fi
done

# Git stav
echo -e "\n📋 Git stav:"
UNCOMMITTED=$(git status --porcelain | wc -l)
if [ $UNCOMMITTED -gt 0 ]; then
    warning_result "Máte $UNCOMMITTED necommitovaných změn"
    git status --short
else
    check_result 0 "Git workspace je čistý"
fi

# ═══════════════════════════════════════════════════════════════════════
# 🎨 FÁZE 2: CSS & STYLE VALIDATION
# ═══════════════════════════════════════════════════════════════════════

print_step "🎨 FÁZE 2: CSS & STYLE VALIDACE"

# Spuštění CSS validace
echo "🔍 Spouštím CSS validaci..."
if ./css-validation.sh > /tmp/css-validation.log 2>&1; then
    check_result 0 "CSS validace prošla"
else
    check_result 1 "CSS validace selhala"
    echo -e "${RED}Poslední řádky z CSS validace:${NC}"
    tail -10 /tmp/css-validation.log
fi

# Smart CSS validace pro změny
echo -e "\n🧠 Spouštím smart CSS validaci..."
if ./smart-css-validation.sh > /tmp/smart-css-validation.log 2>&1; then
    check_result 0 "Smart CSS validace prošla"
else
    check_result 1 "Smart CSS validace selhala"
    echo -e "${RED}Poslední řádky ze smart validace:${NC}"
    tail -10 /tmp/smart-css-validation.log
fi

# ═══════════════════════════════════════════════════════════════════════
# 🧪 FÁZE 3: FUNKČNÍ TESTY
# ═══════════════════════════════════════════════════════════════════════

print_step "🧪 FÁZE 3: FUNKČNÍ TESTY"

# Test herní logiky
if [ -f "test-farkle-comprehensive.js" ]; then
    echo "🎲 Testuji herní logiku..."
    if timeout 30s node test-farkle-comprehensive.js > /tmp/game-logic.log 2>&1; then
        check_result 0 "Herní logika funguje"
    else
        check_result 1 "Herní logika selhala"
        echo -e "${RED}Poslední řádky z testů logiky:${NC}"
        tail -5 /tmp/game-logic.log
    fi
else
    warning_result "Test herní logiky nenalezen"
fi

# Test real game simulace
if [ -f "test-real-game-simulation.js" ]; then
    echo "🎮 Testuji real game simulaci..."
    if timeout 30s node test-real-game-simulation.js > /tmp/real-game.log 2>&1; then
        check_result 0 "Real game simulace funguje"
    else
        check_result 1 "Real game simulace selhala"
        echo -e "${RED}Poslední řádky z real game testů:${NC}"
        tail -5 /tmp/real-game.log
    fi
else
    warning_result "Test real game simulace nenalezen"
fi

# ═══════════════════════════════════════════════════════════════════════
# 🏗️ FÁZE 4: BUILD & DEPLOYMENT CHECK
# ═══════════════════════════════════════════════════════════════════════

print_step "🏗️ FÁZE 4: BUILD & DEPLOYMENT"

# Vite build test
echo "📦 Testuji Vite build..."
if timeout 60s npm run build > /tmp/build.log 2>&1; then
    check_result 0 "Vite build úspěšný"
    
    # Kontrola velikosti bundle
    if [ -d "dist" ]; then
        BUNDLE_SIZE=$(du -sh dist | cut -f1)
        echo -e "${GREEN}📊 Bundle velikost: $BUNDLE_SIZE${NC}"
        
        # Kontrola, že kritické soubory existují
        for file in "dist/index.html" "dist/assets"/*.js "dist/assets"/*.css; do
            if ls $file 1> /dev/null 2>&1; then
                check_result 0 "Build obsahuje $(basename $file)"
            else
                check_result 1 "Build neobsahuje $(basename $file)"
            fi
        done
    fi
else
    check_result 1 "Vite build selhal"
    echo -e "${RED}Poslední řádky z build logu:${NC}"
    tail -10 /tmp/build.log
fi

# ═══════════════════════════════════════════════════════════════════════
# 🔐 FÁZE 5: SECURITY & PERFORMANCE
# ═══════════════════════════════════════════════════════════════════════

print_step "🔐 FÁZE 5: SECURITY & PERFORMANCE"

# NPM audit
echo "🔒 Spouštím npm audit..."
if npm audit --audit-level moderate > /tmp/audit.log 2>&1; then
    check_result 0 "Npm audit bez kritických problémů"
else
    check_result 1 "Npm audit našel problémy"
    echo -e "${RED}Npm audit výsledky:${NC}"
    tail -5 /tmp/audit.log
fi

# Kontrola velikosti JS souborů
echo -e "\n📊 Kontroluji velikost JS souborů..."
JS_FILES=$(find src -name "*.js" -type f)
TOTAL_JS_LINES=0

for file in $JS_FILES; do
    LINES=$(wc -l < "$file")
    TOTAL_JS_LINES=$((TOTAL_JS_LINES + LINES))
    if [ $LINES -gt 500 ]; then
        warning_result "Soubor $file má $LINES řádků (možná moc velký)"
    fi
done

if [ $TOTAL_JS_LINES -lt 8000 ]; then
    check_result 0 "Celková velikost JS: $TOTAL_JS_LINES řádků (v normě)"
else
    check_result 1 "Celková velikost JS: $TOTAL_JS_LINES řádků (příliš velké)"
fi

# ═══════════════════════════════════════════════════════════════════════
# 📊 FINÁLNÍ REPORT
# ═══════════════════════════════════════════════════════════════════════

print_header "📊 FINÁLNÍ REPORT"

echo -e "${WHITE}📈 STATISTIKY:${NC}"
echo -e "  ${GREEN}✅ Úspěšné: $PASSED_CHECKS${NC}"
echo -e "  ${RED}❌ Neúspěšné: $FAILED_CHECKS${NC}"
echo -e "  ${YELLOW}⚠️  Varování: $WARNINGS${NC}"
echo -e "  ${BLUE}📊 Celkem: $TOTAL_CHECKS testů${NC}"

# Výpočet úspěšnosti
if [ $TOTAL_CHECKS -gt 0 ]; then
    SUCCESS_RATE=$(( (PASSED_CHECKS * 100) / TOTAL_CHECKS ))
    echo -e "  ${PURPLE}🎯 Úspěšnost: $SUCCESS_RATE%${NC}"
else
    SUCCESS_RATE=0
fi

echo ""

# Finální rozhodnutí
if [ $FAILED_CHECKS -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo -e "${GREEN}🎉 PERFEKTNÍ! Všechny testy prošly bez varování!${NC}"
        echo -e "${GREEN}🚀 Commit může pokračovat${NC}"
        exit 0
    else
        echo -e "${YELLOW}✅ Testy prošly, ale jsou varování${NC}"
        echo -e "${YELLOW}⚠️  Doporučuji zkontrolovat varování před commitem${NC}"
        exit 0
    fi
else
    echo -e "${RED}❌ FAIL! $FAILED_CHECKS testů selhalo${NC}"
    echo -e "${RED}🛑 Commit by neměl pokračovat${NC}"
    
    # Návody na opravu
    echo -e "\n${CYAN}🔧 NÁVODY NA OPRAVU:${NC}"
    echo -e "${WHITE}• CSS problémy:${NC} zkontroluj src/styles/ a dodržuj Bootstrap pravidla"
    echo -e "${WHITE}• JS problémy:${NC} zkontroluj src/js/ a logiku"
    echo -e "${WHITE}• Build problémy:${NC} npm run dev a zkontroluj console"
    echo -e "${WHITE}• Security:${NC} npm audit fix"
    
    exit 1
fi

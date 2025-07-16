#!/bin/bash

# 🎲 AI DICE CHALLENGE - HLAVNÍ AUTOMATICKÝ TEST SYSTÉM
# ══════════════════════════════════════════════════════════════════════
# Spouští se automaticky při startu VS Code a hlídá změny
# ══════════════════════════════════════════════════════════════════════

# Barvy pro výstup
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Banner
echo ""
echo -e "${PURPLE}🎲 AI DICE CHALLENGE - AUTOMATICKÝ TEST SYSTÉM${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo ""

# Kontrola, že jsme v správném adresáři
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Nejste ve správném adresáři AI Dice Challenge projektu!${NC}"
    exit 1
fi

# Funkce pro spuštění všech testů
run_all_tests() {
    echo -e "${CYAN}🔄 Spouštím kompletní testovací suite...${NC}"
    echo ""
    
    # 1. Validace systému
    echo -e "${YELLOW}1️⃣ Systémová validace...${NC}"
    if [ -f "skripty/validace/verify-copilot-system.sh" ]; then
        bash skripty/validace/verify-copilot-system.sh
    else
        echo -e "${RED}❌ Systémová validace nenalezena${NC}"
    fi
    
    echo ""
    
    # 2. CSS validace
    echo -e "${YELLOW}2️⃣ CSS/Bootstrap validace...${NC}"
    if [ -f "skripty/validace/smart-css-validation.sh" ]; then
        bash skripty/validace/smart-css-validation.sh
    else
        echo -e "${RED}❌ CSS validace nenalezena${NC}"
    fi
    
    echo ""
    
    # 3. Herní logika testy
    echo -e "${YELLOW}3️⃣ Testování herní logiky...${NC}"
    if [ -f "skripty/testy/test-farkle-comprehensive.js" ]; then
        echo -e "${BLUE}Spouštím comprehensive Farkle test...${NC}"
        node skripty/testy/test-farkle-comprehensive.js
    else
        echo -e "${RED}❌ Comprehensive test nenalezen${NC}"
    fi
    
    echo ""
    
    # 4. Simulace skutečné hry
    echo -e "${YELLOW}4️⃣ Simulace skutečné hry...${NC}"
    if [ -f "skripty/testy/test-real-game-simulation.js" ]; then
        echo -e "${BLUE}Spouštím simulaci skutečné hry...${NC}"
        node skripty/testy/test-real-game-simulation.js
    else
        echo -e "${RED}❌ Real game simulation nenalezena${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}✅ Všechny testy dokončeny!${NC}"
    echo ""
}

# Funkce pro rychlé testy při změnách
run_quick_tests() {
    echo -e "${CYAN}⚡ Spouštím rychlé testy...${NC}"
    echo ""
    
    # Pouze CSS validace a základní system check
    if [ -f "skripty/validace/smart-css-validation.sh" ]; then
        bash skripty/validace/smart-css-validation.sh
    fi
    
    echo ""
    echo -e "${GREEN}✅ Rychlé testy dokončeny!${NC}"
}

# Hlavní logika
if [ "$1" = "--quick" ]; then
    run_quick_tests
elif [ "$1" = "--full" ]; then
    run_all_tests
elif [ "$1" = "--auto" ]; then
    # Automatický režim - zeptá se uživatele
    echo -e "${YELLOW}🤖 Automatický test systém detekoval změny${NC}"
    echo ""
    echo "Chcete spustit testy?"
    echo "1) Rychlé testy (CSS + validace)"
    echo "2) Kompletní testy (všechno)"
    echo "3) Přeskočit"
    echo ""
    read -p "Vaše volba (1-3): " choice
    
    case $choice in
        1)
            run_quick_tests
            ;;
        2)
            run_all_tests
            ;;
        3)
            echo -e "${BLUE}ℹ️ Testy přeskočeny${NC}"
            ;;
        *)
            echo -e "${YELLOW}⚠️ Neplatná volba, spouštím rychlé testy${NC}"
            run_quick_tests
            ;;
    esac
else
    # Výchozí - zobrazí nápovědu
    echo -e "${YELLOW}📋 POUŽITÍ:${NC}"
    echo ""
    echo "  ./skripty/hlavni-test.sh --quick     # Rychlé testy"
    echo "  ./skripty/hlavni-test.sh --full      # Kompletní testy"
    echo "  ./skripty/hlavni-test.sh --auto      # Interaktivní režim"
    echo ""
    echo -e "${BLUE}🔧 DOSTUPNÉ PŘÍKAZY:${NC}"
    echo "  npm run test       # Spustí tento script s --auto"
    echo "  npm run test:quick # Rychlé testy"
    echo "  npm run test:full  # Kompletní testy"
    echo ""
    
    # Pokud není parametr, spustí interaktivní režim
    "$0" --auto
fi

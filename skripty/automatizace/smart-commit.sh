#!/bin/bash

# 🎲 AI DICE CHALLENGE - SMART COMMIT & PUSH SYSTÉM
# ══════════════════════════════════════════════════════════════════════
# Automatická validace → Commit → Push s možností vlastní zprávy
# ══════════════════════════════════════════════════════════════════════

# Barvy pro výstup
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo -e "${PURPLE}🚀 SMART COMMIT & PUSH SYSTÉM${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo ""

# Kontrola, že jsme v git repository
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Nejste v git repository!${NC}"
    exit 1
fi

# Kontrola, že jsme v správném adresáři projektu
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Nejste v root adresáři AI Dice Challenge projektu!${NC}"
    exit 1
fi

echo -e "${CYAN}🔍 Kontroluji změny v kódu...${NC}"
echo -e "${BLUE}────────────────────────────────────────────────────────────────────${NC}"

# Zkontroluj, zda jsou nějaké změny
if git diff --quiet && git diff --staged --quiet; then
    echo -e "${BLUE}ℹ️  Žádné změny k commitu${NC}"
    exit 0
fi

# Zobraz přehled změn
echo -e "${YELLOW}📝 ZMĚNY K COMMITU:${NC}"
echo -e "${BLUE}────────────────────────────────────────────────────────────────────${NC}"
git status --short

echo ""
echo -e "${YELLOW}📊 DETAILY ZMĚN:${NC}"
echo -e "${BLUE}────────────────────────────────────────────────────────────────────${NC}"
git diff --stat

echo ""
echo -e "${YELLOW}📋 POVINNÁ VALIDACE PŘED COMMITEM:${NC}"
echo -e "${BLUE}────────────────────────────────────────────────────────────────────${NC}"

# Spuštění validace pomocí nového test systému
if [ -f "skripty/hlavni-test.sh" ]; then
    echo -e "${CYAN}Spouštím rychlé testy...${NC}"
    if ! ./skripty/hlavni-test.sh --quick; then
        echo ""
        echo -e "${RED}🚨 VALIDACE SELHALA!${NC}"
        echo -e "${BLUE}────────────────────────────────────────────────────────────────────${NC}"
        echo -e "${RED}❌ Nelze commitnout - opravte všechny chyby!${NC}"
        echo -e "${YELLOW}💡 Spusťte: npm run test:quick${NC}"
        echo -e "${YELLOW}🔧 Opravte problémy a spusťte znovu${NC}"
        echo ""
        exit 1
    fi
else
    # Fallback na starý systém
    echo -e "${YELLOW}⚠️ Používám starý validační systém...${NC}"
    if [ -f "skripty/validace/smart-css-validation.sh" ]; then
        if ! ./skripty/validace/smart-css-validation.sh; then
            echo ""
            echo -e "${RED}🚨 VALIDACE SELHALA!${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ Validační systém nenalezen!${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}✅ VALIDACE ÚSPĚŠNÁ!${NC}"
echo -e "${BLUE}────────────────────────────────────────────────────────────────────${NC}"

echo ""
echo -e "${YELLOW}❓ VOLBY PRO COMMIT:${NC}"
echo -e "${BLUE}────────────────────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}1) ${NC}Stiskni ${GREEN}ENTER${NC} pro automatickou commit zprávu"
echo -e "${CYAN}2) ${NC}Napiš ${YELLOW}vlastní commit zprávu${NC}"
echo -e "${CYAN}3) ${NC}Napiš ${RED}'exit'${NC} pro zrušení"
echo ""
read -p "💬 Tvoje volba: " commit_message

# Zpracování vstupu
if [ "$commit_message" = "exit" ]; then
    echo -e "${BLUE}🚫 Commit zrušen uživatelem${NC}"
    exit 0
fi

if [ -z "$commit_message" ]; then
    # Automatická commit zpráva na základě změn
    echo ""
    echo -e "${CYAN}🤖 Generuji automatickou commit zprávu...${NC}"
    
    # Detekce typu změn
    js_changes=$(git diff --name-only | grep -c "\.js$" || true)
    css_changes=$(git diff --name-only | grep -c "\.css$" || true)
    html_changes=$(git diff --name-only | grep -c "\.html$" || true)
    test_changes=$(git diff --name-only | grep -c "test" || true)
    config_changes=$(git diff --name-only | grep -E "(package\.json|\.vscode|config)" | wc -l || true)
    
    # Inteligentní generování zprávy
    if [ "$test_changes" -gt 0 ]; then
        commit_message="test: aktualizace testů a validací - $(date '+%Y-%m-%d %H:%M')"
    elif [ "$config_changes" -gt 0 ]; then
        commit_message="config: konfigurace a nástroje - $(date '+%Y-%m-%d %H:%M')"
    elif [ "$js_changes" -gt 0 ] && [ "$css_changes" -gt 0 ]; then
        commit_message="feat: JS + CSS vylepšení - $(date '+%Y-%m-%d %H:%M')"
    elif [ "$js_changes" -gt 0 ]; then
        commit_message="feat: herní logika a JS - $(date '+%Y-%m-%d %H:%M')"
    elif [ "$css_changes" -gt 0 ]; then
        commit_message="style: UI/UX a CSS styling - $(date '+%Y-%m-%d %H:%M')"
    elif [ "$html_changes" -gt 0 ]; then
        commit_message="feat: HTML struktura - $(date '+%Y-%m-%d %H:%M')"
    else
        commit_message="feat: různé vylepšení - $(date '+%Y-%m-%d %H:%M')"
    fi
    
    echo -e "${GREEN}📝 Automatická zpráva: ${YELLOW}$commit_message${NC}"
fi

echo ""
echo -e "${CYAN}🚀 PROVÁDÍM COMMIT & PUSH...${NC}"
echo -e "${BLUE}────────────────────────────────────────────────────────────────────${NC}"

# Add všechny změny
echo -e "${CYAN}📁 Přidávám soubory...${NC}"
git add .

# Commit
echo -e "${CYAN}💾 Commituji změny...${NC}"
if git commit -m "$commit_message"; then
    echo -e "${GREEN}✅ Commit úspěšný!${NC}"
    
    # Push
    echo -e "${CYAN}📤 Pushování do remote repository...${NC}"
    if git push; then
        echo ""
        echo -e "${GREEN}🎉 ÚSPĚCH! Změny byly pushnuta do remote repository${NC}"
        echo -e "${BLUE}────────────────────────────────────────────────────────────────────${NC}"
        echo -e "${CYAN}📊 Commit hash: ${YELLOW}$(git rev-parse --short HEAD)${NC}"
        echo -e "${CYAN}🌐 Branch: ${YELLOW}$(git branch --show-current)${NC}"
        echo -e "${CYAN}💬 Zpráva: ${YELLOW}$commit_message${NC}"
    else
        echo ""
        echo -e "${RED}⚠️ Push selhal - zkontrolujte remote repository${NC}"
        echo -e "${YELLOW}💡 Commit byl úspěšný, pouze push selhal${NC}"
        echo -e "${YELLOW}🔧 Zkuste: git push${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Commit selhal!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ HOTOVO! Všechny změny jsou v remote repository${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo ""

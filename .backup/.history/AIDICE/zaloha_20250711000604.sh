#!/bin/bash

# ===================================================================
# AUTOMATICKÝ ZÁLOHOVACÍ SKRIPT PRO PROJEKT AIDICE
# ===================================================================
# Použití: ./zaloha.sh "Volitelný popis změn"
# Nebo stačí: ./zaloha.sh
# ===================================================================

# Barvy pro lepší čitelnost výstupu
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vytištění barevného nadpisu
echo -e "${BLUE}==========================================${NC}"
echo -e "${GREEN}       AUTOMATICKÁ ZÁLOHA PROJEKTU       ${NC}"
echo -e "${BLUE}==========================================${NC}"

# Zjištění aktuálního data a času pro commit message
current_date=$(date "+%d.%m.%Y %H:%M:%S")

# Zjištění aktuální větve
current_branch=$(git branch --show-current)
if [ -z "$current_branch" ]; then
    current_branch="main"
fi

# Použití vlastního popisu změn nebo výchozí zprávy
if [ -z "$1" ]; then
    # Žádný popis nebyl zadán, použijeme výchozí zprávu
    commit_message="Automatická záloha projektu ${current_date}"
    
    echo -e "${YELLOW}Nebyl zadán popis změn, použije se výchozí zpráva:${NC}"
    echo -e "${BLUE}\"${commit_message}\"${NC}"
else
    # Byl zadán popis změn, použijeme jej
    commit_message="$1 - ${current_date}"
    
    echo -e "${YELLOW}Použije se zadaný popis změn:${NC}"
    echo -e "${BLUE}\"${commit_message}\"${NC}"
fi

echo -e "${YELLOW}\nZahájena záloha na větvi:${NC} ${GREEN}${current_branch}${NC}\n"

# 1. Přidání všech změn do stage
echo -e "${YELLOW}1. Přidávám všechny změny do stage...${NC}"
git add .
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Změny byly úspěšně přidány do stage${NC}"
else
    echo -e "${RED}✗ Nastala chyba při přidávání změn do stage${NC}"
    exit 1
fi

# Zjištění, zda jsou nějaké změny k záloze
if git diff --cached --quiet; then
    echo -e "${YELLOW}! Žádné změny k záloze. Ukončuji.${NC}"
    exit 0
fi

# 2. Vytvoření commitu
echo -e "\n${YELLOW}2. Vytvářím commit s popisem...${NC}"
git commit -m "$commit_message"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Commit byl úspěšně vytvořen${NC}"
else
    echo -e "${RED}✗ Nastala chyba při vytváření commitu${NC}"
    exit 1
fi

# 3. Push na vzdálený repozitář
echo -e "\n${YELLOW}3. Nahrávám změny na GitHub (${current_branch})...${NC}"
git push origin $current_branch
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Změny byly úspěšně nahrány na GitHub${NC}"
else
    echo -e "${RED}✗ Nastala chyba při nahrávání změn na GitHub${NC}"
    echo -e "${YELLOW}! Zkontrolujte připojení k internetu nebo oprávnění k repozitáři${NC}"
    exit 1
fi

# Úspěšné dokončení
echo -e "\n${GREEN}==========================================${NC}"
echo -e "${GREEN}    ZÁLOHA BYLA ÚSPĚŠNĚ DOKONČENA     ${NC}"
echo -e "${GREEN}==========================================${NC}"
echo -e "Větev: ${BLUE}${current_branch}${NC}"
echo -e "Čas: ${BLUE}${current_date}${NC}"
echo -e "Popis: ${BLUE}${commit_message}${NC}"

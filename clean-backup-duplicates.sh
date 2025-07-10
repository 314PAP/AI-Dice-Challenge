#!/bin/bash

# Skript pro vyčištění duplicitních záloh v projektu

# Barvy pro výstup
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🧹 Čistím nepotřebné zálohy a duplicity...${NC}"

# 1. Zkontrolujeme adresář .backup/.history/AIDICE
BACKUP_DIR="../.backup/.history/AIDICE"
if [ -d "$BACKUP_DIR" ]; then
    echo -e "${BLUE}Nalezen adresář se zálohami: $BACKUP_DIR${NC}"
    
    # Zjistíme počet souborů a složek v zálohovacím adresáři
    FILE_COUNT=$(find "$BACKUP_DIR" -type f | wc -l)
    DIR_COUNT=$(find "$BACKUP_DIR" -type d | wc -l)
    
    echo -e "Počet souborů: ${YELLOW}$FILE_COUNT${NC}"
    echo -e "Počet adresářů: ${YELLOW}$DIR_COUNT${NC}"
    
    # Zeptáme se, zda chcete odstranit duplicitní zálohy
    echo -e "${RED}⚠️ VAROVÁNÍ: Tato akce odstraní duplicitní zálohy se stejným obsahem${NC}"
    echo -e "Pokračovat? (a/n)"
    read -r odpoved
    
    if [ "$odpoved" == "a" ] || [ "$odpoved" == "A" ]; then
        echo -e "${YELLOW}Odstraňuji duplicitní zálohy...${NC}"
        
        # Najdeme duplicity podle MD5 hashe
        find "$BACKUP_DIR" -type f -exec md5sum {} \; | sort | uniq -w32 --all-repeated=separate | cut -d' ' -f3 | xargs -r rm -v
        
        # Znovu spočítáme počet souborů po odstranění duplicit
        FILE_COUNT_AFTER=$(find "$BACKUP_DIR" -type f | wc -l)
        REMOVED_FILES=$((FILE_COUNT - FILE_COUNT_AFTER))
        
        echo -e "${GREEN}✅ Odstranění dokončeno${NC}"
        echo -e "Odstraněno souborů: ${RED}$REMOVED_FILES${NC}"
        echo -e "Zůstalo souborů: ${GREEN}$FILE_COUNT_AFTER${NC}"
    else
        echo -e "${BLUE}Akce zrušena${NC}"
    fi
else
    echo -e "${RED}❌ Adresář se zálohami nenalezen: $BACKUP_DIR${NC}"
fi

# 2. Vyčistíme dočasné soubory VS Code
echo -e "\n${YELLOW}2. Čistím dočasné soubory VS Code...${NC}"
VSCODE_CACHE_DIR="$HOME/.config/Code"
if [ -d "$VSCODE_CACHE_DIR" ]; then
    echo -e "${BLUE}Nalezen adresář VS Code: $VSCODE_CACHE_DIR${NC}"
    echo -e "${RED}⚠️ VAROVÁNÍ: Tato akce vymaže cache VS Code, což může vyřešit problém se sledováním souborů${NC}"
    echo -e "Pokračovat? (a/n)"
    read -r odpoved
    
    if [ "$odpoved" == "a" ] || [ "$odpoved" == "A" ]; then
        echo -e "${YELLOW}Odstraňuji VS Code cache...${NC}"
        
        # Zavřeme VS Code, pokud běží
        pkill -f "code" 2>/dev/null
        sleep 1
        
        # Odstraníme cache soubory
        rm -rf "$VSCODE_CACHE_DIR/Cache" "$VSCODE_CACHE_DIR/CachedData" "$VSCODE_CACHE_DIR/CachedExtensions" "$VSCODE_CACHE_DIR/Code Cache" 2>/dev/null
        rm -rf "$VSCODE_CACHE_DIR/User/workspaceStorage/*/state.vscdb" 2>/dev/null
        
        echo -e "${GREEN}✅ VS Code cache byl vyčištěn${NC}"
        echo -e "${BLUE}Nyní můžete restartovat VS Code${NC}"
    else
        echo -e "${BLUE}Akce zrušena${NC}"
    fi
else
    echo -e "${RED}❌ Adresář VS Code nenalezen: $VSCODE_CACHE_DIR${NC}"
fi

echo -e "\n${GREEN}==============================================${NC}"
echo -e "${GREEN}       ČIŠTĚNÍ DOKONČENO       ${NC}"
echo -e "${GREEN}==============================================${NC}"

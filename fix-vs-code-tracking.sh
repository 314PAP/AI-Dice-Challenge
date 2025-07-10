#!/bin/bash

# Skript pro komplexní vyřešení problémů s VS Code sledováním souborů
# Tento skript provádí následující:
# 1. Commituje všechny změny
# 2. Vyčistí VS Code cache
# 3. Resetuje sledování souborů
# 4. Aktualizuje .gitignore

# Barvy pro lepší čitelnost
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== KOMPLEXNÍ ŘEŠENÍ PROBLÉMŮ S VS CODE SLEDOVÁNÍM ===${NC}"

# 1. Uložíme všechny změny v Gitu
echo -e "\n${YELLOW}1. Ukládám aktuální změny do Gitu...${NC}"
git add .
git commit -m "🔄 Hromadný commit pro vyřešení problémů se sledováním souborů"
git push

# 2. Vytvoříme seznam adresářů a souborů, které VS Code sleduje, ale nemá sledovat
echo -e "\n${YELLOW}2. Kontroluji a upravuji .gitignore...${NC}"
cat > .gitignore << EOL
# IDE a systémové soubory
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
.idea/
*.iml
*.swp
.DS_Store
Thumbs.db

# Build a závislosti
node_modules/
dist/
build/
coverage/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Zálohy a historie
.backup/
.history/
archive/
src/styles/archive/
dokumentybtrap/

# Ostatní
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
EOL

echo -e "${GREEN}✅ .gitignore byl aktualizován${NC}"

# 3. Resetujeme sledování souborů
echo -e "\n${YELLOW}3. Resetuji sledování souborů v Git...${NC}"
git rm -r --cached .
git add .
git commit -m "🔄 Resetováno sledování souborů podle .gitignore"
git push

# 4. Vyčistíme cache VS Code
echo -e "\n${YELLOW}4. Vyčistíme cache VS Code...${NC}"
echo -e "${RED}⚠️  POZOR: VS Code musí být zavřený!${NC}"
echo -e "${YELLOW}Je VS Code zavřené? (a/n): ${NC}"
read -p "Pokračovat s čištěním cache? (a/n): " odpoved

if [[ "$odpoved" == "a" || "$odpoved" == "A" ]]; then
    echo -e "${YELLOW}Pokračuji s čištěním cache...${NC}"
    
    # Získáme cestu k VS Code cache
    VSCODE_CACHE_DIR="$HOME/.config/Code"
    
    if [ -d "$VSCODE_CACHE_DIR" ]; then
        # Vytvoříme zálohu workspaceStorage pro jistotu
        echo -e "${YELLOW}Vytvářím zálohu VS Code dat...${NC}"
        mkdir -p ~/.vscode-backup
        cp -r "$VSCODE_CACHE_DIR/User/workspaceStorage" ~/.vscode-backup/ 2>/dev/null
        
        # Smažeme cache soubory bezpečnějším způsobem
        echo -e "${YELLOW}Mažu cache VS Code...${NC}"
        rm -rf "$VSCODE_CACHE_DIR/Cache" 2>/dev/null
        rm -rf "$VSCODE_CACHE_DIR/CachedData" 2>/dev/null
        rm -rf "$VSCODE_CACHE_DIR/CachedExtensions" 2>/dev/null
        rm -rf "$VSCODE_CACHE_DIR/Code Cache" 2>/dev/null
        find "$VSCODE_CACHE_DIR/User/workspaceStorage" -name "state.vscdb" -delete 2>/dev/null
        
        echo -e "${GREEN}✅ Cache VS Code byl vyčištěn${NC}"
        echo -e "${BLUE}Poznámka: Záloha VS Code dat byla vytvořena v ~/.vscode-backup${NC}"
    else
        echo -e "${RED}Adresář VS Code cache nebyl nalezen v $VSCODE_CACHE_DIR${NC}"
        echo -e "${YELLOW}Zkouším alternativní umístění...${NC}"
        
        # Zkusíme najít cache VS Code na jiných místech
        ALT_PATHS=("$HOME/.config/Code - OSS" "$HOME/Library/Application Support/Code" "$HOME/AppData/Roaming/Code")
        
        for alt_path in "${ALT_PATHS[@]}"; do
            if [ -d "$alt_path" ]; then
                echo -e "${GREEN}Nalezen alternativní VS Code adresář: $alt_path${NC}"
                
                # Vytvoříme zálohu
                mkdir -p ~/.vscode-backup
                cp -r "$alt_path/User/workspaceStorage" ~/.vscode-backup/ 2>/dev/null
                
                # Smažeme cache
                rm -rf "$alt_path/Cache" 2>/dev/null
                rm -rf "$alt_path/CachedData" 2>/dev/null
                rm -rf "$alt_path/CachedExtensions" 2>/dev/null
                rm -rf "$alt_path/Code Cache" 2>/dev/null
                find "$alt_path/User/workspaceStorage" -name "state.vscdb" -delete 2>/dev/null
                
                echo -e "${GREEN}✅ Cache VS Code byl vyčištěn z alternativního umístění${NC}"
                break
            fi
        done
    fi
else
    echo -e "${BLUE}Čištění cache bylo přeskočeno.${NC}"
fi

# 5. Oprava sledování VS Code souborů
echo -e "\n${YELLOW}5. Obnovuji sledované soubory v Gitu...${NC}"

# Přidáme všechny soubory zpět
git add .

# Kontrolujeme, zda jsou změny k commitnutí
if ! git diff --cached --quiet; then
    git commit -m "🔄 Obnoveny sledované soubory po resetu"
    git push
    echo -e "${GREEN}✅ Změny byly commitnuty a pushnuty${NC}"
else
    echo -e "${BLUE}Žádné změny k commitnutí${NC}"
fi

echo -e "\n${YELLOW}6. Ruční postup řešení problémů s VS Code:${NC}"
echo -e "${BLUE}Pokud problém přetrvává, zkuste následující příkazy manuálně:${NC}"
echo -e "  1) ${YELLOW}cd ~/.config/Code${NC}"
echo -e "  2) ${YELLOW}rm -rf Cache CachedData CachedExtensions \"Code Cache\"${NC}"
echo -e "  3) ${YELLOW}find User/workspaceStorage -name \"state.vscdb\" -delete${NC}"

echo -e "\n${GREEN}==============================================${NC}"
echo -e "${GREEN}       KOMPLEXNÍ ŘEŠENÍ DOKONČENO       ${NC}"
echo -e "${GREEN}==============================================${NC}"
echo -e "Co dělat dál:"
echo -e "1. ${BLUE}Znovu otevřete VS Code${NC}"
echo -e "2. ${BLUE}Zkontrolujte, zda problém byl vyřešen${NC}"
echo -e "3. ${BLUE}Pro GitKraken: Pokud nechcete rozšíření instalovat, klikněte na 'Nikdy'${NC}"
echo -e "4. ${BLUE}Pokud stále vidíte mnoho změněných souborů, zkuste:${NC}"
echo -e "   a) ${YELLOW}Zavřít VS Code úplně (všechna okna)${NC}"
echo -e "   b) ${YELLOW}Smazat cache ručně příkazy výše${NC}"
echo -e "   c) ${YELLOW}Restartovat počítač${NC}"
echo -e "${GREEN}==============================================${NC}"

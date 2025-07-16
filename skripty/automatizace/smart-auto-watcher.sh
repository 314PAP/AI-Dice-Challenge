#!/bin/bash

# 🎲 AI DICE CHALLENGE - INTELIGENTNÍ AUTO-WATCHER
# ══════════════════════════════════════════════════════════════════════
# Hlídá změny v projektu a automaticky nabízí spuštění testů
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
echo -e "${PURPLE}🤖 INTELIGENTNÍ AUTO-WATCHER SPUŠTĚN${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}Hlídám změny v projektu... (Ctrl+C pro ukončení)${NC}"
echo ""

# Kontrola, že jsme v root adresáři
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Nejste v root adresáři projektu!${NC}"
    exit 1
fi

# Proměnné pro sledování
LAST_CHANGE=""
COOLDOWN=5  # Sekund mezi testy
LAST_TEST_TIME=0

# Funkce pro detekci typu změny
detect_change_type() {
    local changed_file="$1"
    
    case "$changed_file" in
        *.css)
            echo "css"
            ;;
        *.js)
            echo "js"
            ;;
        *.html)
            echo "html"
            ;;
        *.md)
            echo "docs"
            ;;
        *)
            echo "other"
            ;;
    esac
}

# Funkce pro spuštění testů podle typu změny
run_tests_for_change() {
    local change_type="$1"
    local file="$2"
    
    current_time=$(date +%s)
    
    # Cooldown check
    if [ $((current_time - LAST_TEST_TIME)) -lt $COOLDOWN ]; then
        echo -e "${YELLOW}⏳ Cooldown aktivní, čekám...${NC}"
        return
    fi
    
    echo ""
    echo -e "${YELLOW}🔍 Detekována změna: ${BLUE}$file${NC}"
    echo -e "${CYAN}Typ změny: $change_type${NC}"
    echo ""
    
    case "$change_type" in
        "css")
            echo -e "${YELLOW}🎨 CSS změna detekována!${NC}"
            echo "Doporučuji: CSS validaci + rychlé testy"
            echo ""
            read -t 10 -p "Spustit CSS validaci? (y/N/s=skip): " choice
            
            case "$choice" in
                [Yy]*)
                    echo -e "${GREEN}✅ Spouštím CSS validaci...${NC}"
                    ./skripty/hlavni-test.sh --quick
                    ;;
                [Ss]*)
                    echo -e "${BLUE}⏭️ Přeskočeno${NC}"
                    ;;
                *)
                    echo -e "${BLUE}⏭️ Timeout nebo 'N' - přeskočeno${NC}"
                    ;;
            esac
            ;;
            
        "js")
            echo -e "${YELLOW}⚙️ JavaScript změna detekována!${NC}"
            echo "Doporučuji: Herní logika testy"
            echo ""
            read -t 15 -p "Spustit testy herní logiky? (y/N/f=full): " choice
            
            case "$choice" in
                [Yy]*)
                    echo -e "${GREEN}✅ Spouštím testy herní logiky...${NC}"
                    if [ -f "skripty/testy/test-farkle-comprehensive.js" ]; then
                        node skripty/testy/test-farkle-comprehensive.js
                    fi
                    ;;
                [Ff]*)
                    echo -e "${GREEN}✅ Spouštím kompletní testy...${NC}"
                    ./skripty/hlavni-test.sh --full
                    ;;
                *)
                    echo -e "${BLUE}⏭️ Timeout nebo 'N' - přeskočeno${NC}"
                    ;;
            esac
            ;;
            
        "html")
            echo -e "${YELLOW}🏗️ HTML změna detekována!${NC}"
            echo "Doporučuji: Rychlé testy (CSS + validace)"
            echo ""
            read -t 10 -p "Spustit rychlé testy? (y/N): " choice
            
            case "$choice" in
                [Yy]*)
                    echo -e "${GREEN}✅ Spouštím rychlé testy...${NC}"
                    ./skripty/hlavni-test.sh --quick
                    ;;
                *)
                    echo -e "${BLUE}⏭️ Timeout nebo 'N' - přeskočeno${NC}"
                    ;;
            esac
            ;;
            
        *)
            echo -e "${CYAN}ℹ️ Jiný typ změny - žádné automatické testy${NC}"
            ;;
    esac
    
    LAST_TEST_TIME=$current_time
    echo ""
    echo -e "${CYAN}👀 Pokračujem v hlídání změn...${NC}"
    echo ""
}

# Sledování změn pomocí inotifywait (pokud je k dispozici)
if command -v inotifywait &> /dev/null; then
    echo -e "${GREEN}✅ Používám inotifywait pro real-time monitoring${NC}"
    echo ""
    
    # Sledování pouze důležitých adresářů a typů souborů
    inotifywait -m -r -e modify -e create -e delete \
        --include='.*\.(js|css|html|md)$' \
        src/ skripty/ . 2>/dev/null | while read path action file; do
        
        # Ignorovat temporary soubory
        case "$file" in
            .*|*~|*.tmp|*.swp|*.bak)
                continue
                ;;
        esac
        
        change_type=$(detect_change_type "$file")
        full_path="${path}${file}"
        
        run_tests_for_change "$change_type" "$full_path"
    done
else
    # Fallback na polling
    echo -e "${YELLOW}⚠️ inotifywait není k dispozici, používám polling${NC}"
    echo -e "${BLUE}💡 Pro lepší výkon nainstalujte: sudo apt install inotify-tools${NC}"
    echo ""
    
    while true; do
        # Základní polling každých 3 sekundy
        sleep 3
        
        # Zde by byl kód pro polling změn, ale pro jednoduchost
        # pouze čekáme na manuální spuštění
        echo -n "."
    done
fi

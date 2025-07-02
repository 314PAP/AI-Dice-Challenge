#!/bin/bash
# Skript pro vyčištění pracovního prostoru od starých souborů

echo "🧹 Čištění pracovního prostoru od starých souborů..."

# Vytvoření adresáře pro archiv, pokud neexistuje
ARCHIVE_DIR="archive/old-files/backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$ARCHIVE_DIR"
echo "📁 Vytvořen archivní adresář: $ARCHIVE_DIR"

# Přesun všech souborů s _old v názvu do archivu
find . -name "*_old*" -type f | while read -r file; do
    # Vytvoření cesty v archivu
    rel_path=$(echo "$file" | sed 's|^\./||')
    archive_path="$ARCHIVE_DIR/$rel_path"
    archive_dir=$(dirname "$archive_path")
    
    # Vytvoření adresářové struktury v archivu
    mkdir -p "$archive_dir"
    
    # Přesun souboru
    cp "$file" "$archive_path"
    echo "🔄 Archivován: $rel_path"
done

echo "✅ Soubory archivovány do: $ARCHIVE_DIR"

# Zjistit, zda existují nějaké zombie procesy
echo "🔍 Kontrola běžících Node procesů..."
zombie_processes=$(ps aux | grep node | grep -v grep)
if [ -n "$zombie_processes" ]; then
    echo "⚠️ Nalezeny Node procesy, které mohou být zombies:"
    echo "$zombie_processes"
    echo "💡 Pro ukončení použijte: pkill node"
else
    echo "✅ Žádné neukončené Node procesy nenalezeny"
fi

# Kontrola necommitovaných změn
echo "🔍 Kontrola necommitovaných změn v Gitu..."
uncommitted=$(git status --porcelain)
if [ -n "$uncommitted" ]; then
    echo "⚠️ Máte necommitované změny:"
    git status --short
else
    echo "✅ Všechny změny byly commitovány"
fi

# Kontrola volného místa
echo "🔍 Kontrola volného místa na disku..."
df -h .

echo "🧹 Čištění dokončeno!"
echo "💡 Pro ukončení všech Node procesů použijte: pkill node"
echo "💡 Pro odstranění archivovaných souborů použijte: git clean -fd"

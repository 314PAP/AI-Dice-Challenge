#!/bin/bash

# Script pro přepínání mezi striktním a tolerantním pre-commit hookem

SCRIPT_DIR="$(dirname "$0")"
HUSKY_DIR="$SCRIPT_DIR/.husky"
STRICT_HOOK="$HUSKY_DIR/pre-commit"
LENIENT_HOOK="$HUSKY_DIR/pre-commit.lenient"
BACKUP_HOOK="$HUSKY_DIR/pre-commit.backup"

# Funkce pro zobrazení nápovědy
show_help() {
  echo "Použití: $0 [strict|lenient|status]"
  echo ""
  echo "Parametry:"
  echo "  strict   - Nastaví striktní režim kontroly kódu (ESLint chyby zastaví commit)"
  echo "  lenient  - Nastaví tolerantní režim kontroly kódu (commit projde i s chybami)"
  echo "  status   - Zobrazí aktuálně nastavený režim"
  echo ""
}

# Kontrola existence adresáře .husky
if [ ! -d "$HUSKY_DIR" ]; then
  echo "❌ Adresář .husky nebyl nalezen. Jste v kořenovém adresáři projektu?"
  exit 1
fi

# Zpracování argumentů
case "$1" in
  strict)
    # Kontrola existence zálohy striktního hooku
    if [ -f "$BACKUP_HOOK" ]; then
      cp "$BACKUP_HOOK" "$STRICT_HOOK"
      echo "✅ Nastaven striktní režim kontroly kódu (ESLint chyby zastaví commit)."
    else
      echo "❌ Záloha striktního hooku nenalezena. Spusťte nejprve 'lenient'."
    fi
    ;;
  
  lenient)
    # Vytvoření zálohy striktního hooku, pokud ještě neexistuje
    if [ ! -f "$BACKUP_HOOK" ] && [ -f "$STRICT_HOOK" ]; then
      cp "$STRICT_HOOK" "$BACKUP_HOOK"
    fi
    
    # Kopírování tolerantního hooku
    if [ -f "$LENIENT_HOOK" ]; then
      cp "$LENIENT_HOOK" "$STRICT_HOOK"
      chmod +x "$STRICT_HOOK"
      echo "✅ Nastaven tolerantní režim kontroly kódu (commit projde i s chybami)."
    else
      echo "❌ Tolerantní hook nenalezen."
    fi
    ;;
  
  status)
    if cmp -s "$STRICT_HOOK" "$LENIENT_HOOK"; then
      echo "🔍 Aktuálně je nastaven TOLERANTNÍ režim kontroly kódu."
    else
      echo "🔍 Aktuálně je nastaven STRIKTNÍ režim kontroly kódu."
    fi
    ;;
  
  *)
    show_help
    ;;
esac

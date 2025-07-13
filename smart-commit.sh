#!/bin/bash

# 🎲 AI DICE CHALLENGE - SMART COMMIT & PUSH
# ══════════════════════════════════════════════

echo ""
echo "🚀 SMART COMMIT & PUSH - AI DICE CHALLENGE"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Kontrola, že jsme v git repository
if [ ! -d ".git" ]; then
    echo "❌ Nejste v git repository!"
    exit 1
fi

echo "🔍 Kontroluji změny v kódu..."
echo "────────────────────────────────────────────────────────────────────"

# Zkontroluj, zda jsou nějaké změny
if git diff --quiet && git diff --staged --quiet; then
    echo "ℹ️  Žádné změny k commitu"
    exit 0
fi

echo "📋 POVINNÁ VALIDACE PŘED COMMITEM:"
echo "────────────────────────────────────────────────────────────────────"

# Spuštění validace
if ! ./css-validation.sh; then
    echo ""
    echo "🚨 VALIDACE SELHALA!"
    echo "────────────────────────────────────────────────────────────────────"
    echo "❌ Nelze commitnout - opravte všechny chyby!"
    echo "💡 Spusťte: npm run validate"
    echo "🔧 Opravte problémy a spusťte znovu"
    echo ""
    exit 1
fi

echo ""
echo "✅ VALIDACE ÚSPĚŠNÁ!"
echo "────────────────────────────────────────────────────────────────────"

# Zobraz změny
echo "📝 ZMĚNY K COMMITU:"
echo "────────────────────────────────────────────────────────────────────"
git status --short

echo ""
echo "📊 DETAILY ZMĚN:"
echo "────────────────────────────────────────────────────────────────────"
git diff --stat

echo ""
echo "❓ POTVRĎ COMMIT A PUSH:"
echo "────────────────────────────────────────────────────────────────────"
echo "🔹 Stiskni ENTER pro commit s automatickou zprávou"
echo "🔹 Nebo napiš vlastní commit zprávu:"
read -p "💬 " commit_message

if [ -z "$commit_message" ]; then
    # Automatická commit zpráva na základě změn
    if git diff --name-only | grep -q "\.js$"; then
        if git diff --name-only | grep -q "\.css$"; then
            commit_message="feat: JS + CSS updates - $(date '+%Y-%m-%d %H:%M')"
        else
            commit_message="feat: JS code updates - $(date '+%Y-%m-%d %H:%M')"
        fi
    elif git diff --name-only | grep -q "\.css$"; then
        commit_message="style: CSS updates - $(date '+%Y-%m-%d %H:%M')"
    else
        commit_message="feat: Code updates - $(date '+%Y-%m-%d %H:%M')"
    fi
    echo "📝 Automatická zpráva: $commit_message"
fi

echo ""
echo "🚀 PROVÁDÍM COMMIT & PUSH..."
echo "────────────────────────────────────────────────────────────────────"

# Add všechny změny
git add .

# Commit
if git commit -m "$commit_message"; then
    echo "✅ Commit úspěšný!"
    
    # Push
    echo "📤 Pushování do remote repository..."
    if git push; then
        echo "🎉 ÚSPĚCH! Změny byly pushnuta do remote repository"
    else
        echo "⚠️ Push selhal - zkontrolujte remote repository"
        exit 1
    fi
else
    echo "❌ Commit selhal!"
    exit 1
fi

echo ""
echo "✅ HOTOVO! Všechny změny jsou v remote repository"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

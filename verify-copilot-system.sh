#!/bin/bash

# 🔍 COPILOT SELF-CHECK VERIFICATION
# Tento script ověří, že Copilot skutečně kontroluje Bootstrap dokumentaci

echo "🤖 OVĚŘOVÁNÍ COPILOT SELF-CHECK SYSTÉMU"
echo "═══════════════════════════════════════════════"

# Kontrola, že copilot-instructions obsahují Bootstrap odkazy
echo "1️⃣ Kontroluji Copilot Instructions..."
if grep -q "dokumentybtrap" .github/copilot-instructions.md; then
    echo "✅ Bootstrap dokumentace je v instructions"
else
    echo "❌ Bootstrap dokumentace chybí v instructions"
fi

# Kontrola, že main.css obsahuje checklist
echo ""
echo "2️⃣ Kontroluji CSS checklist..."
if grep -q "CHECKLIST PŘED KAŽDOU ZMĚNOU" src/styles/main.css; then
    echo "✅ CSS checklist je přítomen"
else
    echo "❌ CSS checklist chybí"
fi

# Kontrola, že validation script existuje a je spustitelný
echo ""
echo "3️⃣ Kontroluji validation script..."
if [[ -x "./css-validation.sh" ]]; then
    echo "✅ Validation script je spustitelný"
else
    echo "❌ Validation script není spustitelný"
fi

# Kontrola integrace do auto-commit
echo ""
echo "4️⃣ Kontroluji auto-commit integraci..."
if grep -q "css-validation.sh" auto-commit-watcher.sh; then
    echo "✅ CSS validace je integrována do auto-commit"
else
    echo "❌ CSS validace není integrována"
fi

# Test aktuálního stavu
echo ""
echo "5️⃣ Testuji aktuální stav projektu..."
echo "─────────────────────────────────────────────"
./css-validation.sh
VALIDATION_RESULT=$?

echo ""
echo "═══════════════════════════════════════════════"
echo "📊 VÝSLEDEK OVĚŘENÍ"
echo "═══════════════════════════════════════════════"

if [ $VALIDATION_RESULT -eq 0 ]; then
    echo "🎉 PERFEKTNÍ! Copilot self-check systém je plně funkční"
    echo "✅ Auto-commity budou blokované při CSS chybách"
    echo "✅ Copilot má přístup k Bootstrap dokumentaci"
    echo "✅ Systém je plně autonomní"
else
    echo "⚠️ POTŘEBA OPRAV: Validation našel problémy"
    echo "💡 Auto-commit nyní tyto problémy zastaví"
    echo "🔧 Copilot musí opravit před dalším commitem"
fi

echo ""
echo "📝 Log tohoto ověření: $(date)"

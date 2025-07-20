#!/bin/bash

# 🎲 Jednoduché monitorování JS změn s automatickými testy

echo "🔍 JS Monitor aktivní - sledování src/js/"

# Test funkčnosti po změně
test_after_change() {
    local file="$1"
    echo "📝 Změna: $file"
    
    # Rychlá syntax kontrola
    if ! node -c "$file" 2>/dev/null; then
        echo "❌ SYNTAX ERROR v $file"
        return 1
    fi
    
    # Rychlé testy
    if npm run test:quick >/dev/null 2>&1; then
        echo "✅ Testy prošly po změně $file"
    else
        echo "❌ TESTY SELHALY po změně $file"
    fi
}

# Sledování změn
inotifywait -m -r -e modify --format '%w%f' src/js/ 2>/dev/null | while read file
do
    if [[ "$file" == *.js ]]; then
        sleep 1
        test_after_change "$file"
    fi
done

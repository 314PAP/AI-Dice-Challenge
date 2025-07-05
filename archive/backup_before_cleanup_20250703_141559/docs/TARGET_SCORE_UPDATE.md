# 🎯 Úprava Zobrazení Cílového Skóre

## ✅ Dokončené Změny

### 🗑️ Odebráno:
- **Velký scoreboard oddíl** (`<div class="scoreboard">`) z HTML
- **CSS pro .scoreboard** - úplně odebráno z stylů
- **Zbytečné místo** - hra je teraz kompaktnější

### ➕ Přidáno:
- **Malý target-info** element v game-controls oblasti
- **Diskrétní styling** - malý text, nízká opacity (70%)
- **Responzivní velikosti** pro různé obrazovky:
  - Desktop: 12px
  - Tablet: 11px 
  - Mobil: 10px

### 📱 Výhody:
1. **Méně místa** - kompaktnější design
2. **Lepší mobilní zobrazení** - více prostoru pro důležité prvky
3. **Diskrétní informace** - cíl je stále viditelný, ale nenápadný
4. **Zachována funkcionalita** - stejné ID, takže JavaScript funguje beze změn

## 🎨 Implementace:

### HTML změna:
```html
<!-- PŘED -->
<div class="scoreboard">
    <h3>Cíl: <span id="targetScoreDisplay">10000</span> bodů</h3>
</div>

<!-- PO -->
<div class="target-info" id="targetInfo">
    Cíl: <span id="targetScoreDisplay">10000</span>
</div>
```

### CSS styling:
```css
.target-info {
    color: var(--text-secondary);
    font-family: 'Orbitron', monospace;
    font-weight: 400;
    font-size: 12px;
    margin: 5px 0;
    text-align: center;
    opacity: 0.7;
}
```

## 📍 Umístění:
Malý cílový text je teď umístěn přímo pod "Skóre tahu" v herní oblasti, takže je vždy viditelný během hry, ale nezabírá zbytečně místo.

---

**✨ Výsledek**: Kompaktnější, mobilně-přívětivější design s diskrétním zobrazením cílového skóre!

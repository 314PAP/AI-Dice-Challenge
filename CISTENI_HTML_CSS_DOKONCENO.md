# ČIŠTĚNÍ HTML A CSS - ODSTRANĚNÍ INLINE STYLŮ

## Provedené úpravy

### 🗂️ **ARCHIVACE SOUBORŮ**
Přesunuto do `cleanup_archive/`:
- `html_files/` - všechny testovací HTML soubory
- Duplicitní a testovací soubory (mobile_test.html, test-clean-index.html, atd.)
- Starší verze template souborů

### 🧹 **ODSTRANĚNÍ INLINE STYLŮ**

#### Template soubory opraveny:
1. **`src/templates/chat.html`**
   - Odstraněn `style="border: none !important; outline: none !important;"`
   - Odstraněn `style="color: #39ff14; font-size: 1.25rem;"`
   - Odstraněn `text-white` class
   - Přidána CSS třída `.chat-send-btn`

2. **`src/templates/chat-mobile-bootstrap.html`**
   - Odstraněny `style="visibility:visible !important; opacity: 1 !important;"`
   - Odstraněn `text-white` class

3. **`src/templates/game-controls.html`**
   - Odstraněn `style="margin-top: 4rem; padding-top: 2rem;"`
   - Odstraněny třídy `neon-border-*`, `neon-text-*`, `bg-dark`, `rounded`
   - Odstraněny `class="rounded-circle"` z avatarů
   - Nahrazeny neonové Bootstrap třídy správnými CSS třídami

4. **`src/templates/game-controls-mobile.html`**
   - Odstraněny všechny `style="font-size: *; height: *; flex: *"`
   - Odstraněny `style="max-width: 70px; width: 30px; height: 30px"`
   - Nahrazeny CSS třídami `.mobile-*`

5. **`src/templates/game-menu-mobile.html`**
   - Odstraněn `style="font-size: clamp(...)"`
   - Odstraněn `style="min-height: clamp(...)"`
   - Přidány CSS třídy `.mobile-dice-icon`, `.mobile-target-input`

6. **`src/templates/game-menu-mobile-bootstrap.html`**
   - Odstraněny všechny `style="visibility:visible !important; opacity: 1 !important;"`

7. **`src/templates/chat-mobile.html`**
   - Odstraněn `style="font-size: clamp(...)"`
   - Přidána CSS třída `.chat-send-icon-mobile`

### 🎨 **NOVÉ CSS TŘÍDY**

#### V `players.css`:
```css
/* Mobilní styly */
.player-mobile { max-width: 70px; padding: 0.25rem; }
.mobile-avatar { width: 30px; height: 30px; }
.mobile-player-name { font-size: 0.6rem; }
.mobile-player-score { font-size: 0.6rem; }
.mobile-game-title { font-size: 0.9rem; }
.mobile-game-status { font-size: 0.7rem; }
.mobile-turn-info { font-size: 0.7rem; }
.mobile-target-info { font-size: 0.7rem; }
.mobile-control-btn { height: 35px; font-size: 0.7rem; flex: 1; min-width: 80px; }
.mobile-quit-btn { height: 35px; font-size: 0.8rem; }

/* Opravy základních stylů */
.player { background: var(--black-bg) !important; }
.turn-info, .current-turn-score, .target-info { 
  background: transparent !important; 
  border: none !important; 
}
```

#### V `chat.css`:
```css
.chat-send-btn { color: var(--neon-green) !important; font-size: 1.25rem !important; }
.chat-send-icon-mobile { font-size: clamp(0.8rem, calc(0.7rem + 0.3vh + 0.2vw), 1.2rem); }
.mobile-dice-icon { font-size: clamp(1rem, calc(0.8rem + 1vh + 0.5vw), 2rem); }
.mobile-target-input { min-height: clamp(1.5rem, calc(1.2rem + 1vh), 2.5rem); }
```

### 🛡️ **BOOTSTRAP OVERRIDE**
Vytvořen `bootstrap-override.css` pro přepsání problematických Bootstrap stylů:
- Odstranění všech bílých barev
- Černé pozadí místo šedého
- Neonové barvy pro všechny komponenty
- Přepsání form controls, buttons, cards, modals, atd.

### 📝 **VÝSLEDEK**

#### ✅ **VYŘEŠENO:**
1. **Žádné inline styly** - všechny převedeny na CSS třídy
2. **Žádné bílé barvy** - vše má neonové barvy
3. **Černé pozadí** místo šedého u všech komponent
4. **Bez šedých rámečků** - pouze neonové efekty podle typu
5. **Čistý HTML** - pouze sémantické třídy
6. **Správná struktura** - CSS třídy místo inline stylů

#### 🎯 **OPRAVENYCH PROBLÉMŮ:**
- Avatary: černé pozadí místo šedého
- Texty: neonové barvy podle typu hráče
- Informační panely: bez rámečků, pouze neonový text
- Tlačítka: správné neonové styly
- Chat: bílý text jen v input poli, jinak neonové barvy
- Mobilní verze: kompaktní a funkční bez inline stylů

---

**Datum:** 2025-01-05
**Status:** ✅ DOKONČENO
**Další kroky:** Testování funkčnosti všech komponent

## Import structure
```
bootstrap-responsive.css    # Základní barvy a proměnné
neon-effects.css           # Neonové efekty
buttons.css                # Neonová tlačítka
game-menu.css              # Hlavní menu
game-controls.css          # Herní ovládání
players.css                # Hráči a avatary
dice.css                   # Kostky
chat.css                   # Chat
modals.css                 # Modální okna
bootstrap-override.css     # Přepsání Bootstrap stylů (POSLEDNÍ!)
```

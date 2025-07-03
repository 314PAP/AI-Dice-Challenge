# 🎲 FARKLE PRAVIDLA - OPRAVA A SJEDNOCENÍ

## ✅ OPRAVENÉ PROBLÉMY

### 1. **Minimum 300 bodů pro ukončení tahu**
- **PŘED**: Hráč musel mít 300 bodů, AI pouze 250 bodů
- **PO**: VŠICHNI (hráč i AI) musí mít minimálně 300 bodů pro ukončení tahu
- **Soubory upravené**:
  - `src/js/game/controllers/gameFlowController.js` (line 113)
  - `src/js/ai/aiPlayer.js` (lines 183, 206, adaptiveThreshold function)

### 2. **AI strategie s respektováním 300 bodového minima**
```javascript
// GEMINI - konzervativní, ale min 300
const geminiThreshold = Math.max(300, targetScore * 0.05) * scorePressure;

// CHATGPT - mírně rizikový, ale min 300  
const chatgptThreshold = Math.max(300, targetScore * 0.04) * scorePressure;

// CLAUDE - adaptivní, ale min 300
const claudeThreshold = Math.max(300, adaptiveThreshold(totalScore, targetScore)) * scorePressure;
```

### 3. **Adaptivní práh pro Claude AI**
- Vrací minimálně 300 bodů v jakékoliv fázi hry
- Začátek hry: max(300, 500)
- Střed hry: max(300, 400) 
- Pozdní hra: max(300, 350)
- Konec hry: 300

## 🎨 BARVY - ODSTRANĚNÍ BÍLÉ

### Kompletně odstraněno:
- `--white-text: #ffffff` → nahrazeno `--text-primary: var(--neon-green)`
- Všechny `color: var(--white-text)` → `color: var(--text-primary)`
- Bílé puntíky na kostkách → neonově zelené `%2339ff14`
- Bílé rgba hodnoty v animacích → neonově zelené

### Barevná paleta:
- **Hlavní**: Oranžová (#ff8c00), Modrá (#00bfff), Zelená (#39ff14)
- **GPT pouze**: Růžová (#ff1493)  
- **Varování/Chyby**: Červená (#ff0040) + Žlutá (#ffff00)

## 📏 LAYOUT - OPTIMALIZACE VÝŠKY

### Desktop rozložení:
- `height: calc(100vh - 80px)` místo původních 15px
- Chat panel a herní oblast mají stejnou výšku
- `overflow: hidden` pro zabránění přetečení
- Kompaktní header a responzivní breakpointy

## 🔧 SOUBORY UPRAVENÉ

### JavaScript (Farkle logika):
- `src/js/game/controllers/gameFlowController.js`
- `src/js/ai/aiPlayer.js`

### CSS (Barvy a layout):
- `src/styles/base/variables.css`
- `src/styles/components/dice/base.css`
- `src/styles/components/dice/values.css`
- `src/styles/components/chat/messages.css`
- `src/styles/components/chat/input.css`
- `src/styles/components/chat.css`
- `src/styles/components/game/setup.css`
- `src/styles/base/typography/base.css`
- `src/styles/animations/keyframes/neon.css`
- `src/styles/layout/grid/main.css`

## ✅ TESTOVÁNÍ

- ✅ Build bez chyb: `npm run build`
- ✅ Dev server běží: `npm run dev`
- ✅ Farkle pravidla sjednocena pro všechny hráče
- ✅ Bílá barva kompletně odstraněna
- ✅ Layout optimalizován pro desktop (100vh)

## 🎯 VÝSLEDEK

1. **Všichni hráči** (lidský i AI) musí mít **300+ bodů** pro ukončení tahu
2. **Žádná bílá barva** - pouze povolené neonové barvy
3. **Perfektní desktop layout** - chat a hra na jedné obrazovce
4. **Konzistentní Farkle pravidla** podle uložených pravidel

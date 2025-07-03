# 🌈 Zesílení neonových efektů u hráčů

## 📝 Popis změn

Byly provedeny úpravy pro zesílení neonového zvýraznění u hráčů tak, aby všichni svítili stejně intenzivně.
Pozadí avatarů zůstává stále černé, pouze okraje svítí silnějším neonem v příslušné barvě hráče.

## 🛠️ Provedené změny:

### 1. Úprava animací (activePlayerAnimation.css)
- Zesíleny hodnoty box-shadow v animaci player-active-pulse
- Přidány další úrovně stínování pro výraznější neonový efekt
- Použity proměnné --glow-large a --glow-intense místo slabších variant

### 2. Úprava stylů pro aktivní hráče (active-states.css)
- Zesíleny hodnoty box-shadow pro všechny typy hráčů (human, gemini, chatgpt, claude)
- Zvýšena hodnota opacity u efektů ze 0.6 na 0.8
- Rozšířeny stíny z 50px na 55px pro viditelnější záření

### 3. Úprava inline stylů v JavaScript (scoreboard.js)
- Zesíleny hodnoty box-shadow v inline stylech pro aktivního hráče
- Přidána další úroveň stínování (0 0 45px)
- Zvětšeny hodnoty rozostření ze 10px/20px na 15px/30px/45px

### 4. Úprava stylů pro vítěze (gameFlowController.js a winner.css)
- Zesíleny hodnoty box-shadow pro zvýraznění vítěze
- Upravena animace winner-pulse pro výraznější pulzování
- Sjednoceny hodnoty záření pro všechny typy hráčů

## ✅ Výsledek

- Všichni hráči nyní svítí stejně intenzivně
- Neonový efekt je výraznější, ale stále respektuje černé pozadí avatarů
- Barvy zůstávají specifické pro jednotlivé typy hráčů:
  - Zelená pro lidského hráče
  - Modrá pro Gemini AI
  - Růžová pro ChatGPT
  - Oranžová pro Claude

Efekt je nyní viditelnější a lépe odpovídá neonovému vizuálnímu stylu hry.

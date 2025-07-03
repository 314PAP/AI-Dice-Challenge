# 🎲 AI Kostková Výzva

Moderní implementace hry Farkle s AI protivníky v neonovém designu podle PIPAP.CZ stylingu.

## ✨ Vlastnosti

### 🎮 Gameplay
- **Hra Farkle** s přesnými pravidly (10 000 bodů k vítězství)
- **3 AI hráči**: Gemini, ChatGPT, Claude s unikátními osobnostmi a strategiemi
- **Hot Dice mechanika** - pokračování při odložení všech 6 kostek
- **Finální kolo** - ostatní hráči mají poslední šanci po dosažení cíle
- **Inteligentní bodování** - postupky, tři páry, násobitelé za 4/5/6 stejných
- **Povinné odložení** bodujících kostek před dalším hodem

### 🎨 Design
- **Neonový styl** inspirovaný PIPAP.CZ - zelená, oranžová, modrá
- **Orbitron font** pro futuristický vzhled
- **Animované efekty** - pulzující bordery, glow efekty
- **Originální AI ikony** - každý AI má svou vizuální identitu
- **Responzivní design** pro všechna zařízení

### 💬 AI Chat
- **Kontextové reakce** AI na herní události
- **Osobnosti** - každý AI má své charakteristické chování
- **Realtimový chat** s neonovými efekty
- **Automatické zprávy** při významných okamžicích

## 🚀 Spuštění

```bash
# Instalace závislostí
npm install

# Spuštění dev serveru
npm run dev

# Build pro produkci
npm run build
```

## 📁 Struktura projektu

```
src/
├── js/
│   ├── game/          # Herní logika a stav
│   ├── ai/            # AI osobnosti a rozhodování
│   ├── ui/            # UI kontrolery a animace
│   └── utils/         # Pomocné funkce
├── styles/
│   ├── main.css       # Základní styly a layout
│   ├── game.css       # Herní prvky (stůl, kostky, hráči)
│   ├── components.css # Tlačítka, formuláře, modály
│   └── chat.css       # Chat panel a zprávy
└── main.js            # Vstupní bod aplikace
```

## � Herní mechaniky

### Bodování
- **Jednička**: 100 bodů
- **Pětka**: 50 bodů
- **Tři stejné**: (hodnota × 100), tři jedničky = 1000
- **Postupka 1-6**: 1500 bodů
- **Tři páry**: 1500 bodů
- **4/5/6 stejných**: násobení základního skóre

### AI Strategie
- **Gemini**: Konzervativní, opatrný přístup
- **ChatGPT**: Vyvážený, přátelský styl
- **Claude**: Agresivní, riskantní hraní
5. **Komunikujte s AI** přes chat během hry

### Bodování
- **Jedničky**: 100 bodů za kus
- **Pětky**: 50 bodů za kus  
- **3x stejné číslo**: číslo × 100 bodů (3x jedničky = 1000)
- **Farkle**: Žádné bodující kostky = 0 bodů

## 🏗️ Struktura projektu

```
src/
├── js/
│   ├── game/           # Herní logika
│   │   ├── gameState.js    # Správa stavu hry
│   │   ├── gameController.js # Hlavní řídící logika
│   │   └── diceLogic.js    # Mechaniky kostek
│   ├── ai/             # AI systém
│   │   ├── personalities.js # Definice AI osobností
│   │   ├── aiController.js  # AI reakce a odpovědi
│   │   └── aiPlayer.js     # AI herní logika
│   ├── ui/             # UI komponenty
│   │   ├── gameUI.js       # Herní UI
│   │   ├── uiController.js # UI event listenery
│   │   ├── chatController.js # Chat systém
│   │   └── speechBubbles.js # Bubliny nad hráči
│   └── utils/          # Pomocné funkce
│       ├── helpers.js      # Obecné utility
│       └── storage.js      # LocalStorage funkce
├── styles/             # CSS styly
│   ├── main.css           # Hlavní styly
│   ├── components.css     # UI komponenty
│   ├── game.css          # Herní prvky
│   └── chat.css          # Chat styly
└── main.js            # Vstupní bod aplikace
```

## 🤖 AI Osobnosti

### Gemini (G) - Analytický
- Barva: Modrá (#2b78e4)
- Styl: Datově orientovaný, precizní
- Strategie: Konzervativní, minimalizuje riziko

### ChatGPT (⚡) - Přátelský  
- Barva: Zelená (#74aa9c)
- Styl: Nadšený, povzbudivý
- Strategie: Vyvážená, optimistická

### Claude (C) - Filozofický
- Barva: Šedá (#717387)  
- Styl: Zamyšlený, moudřý
- Strategie: Vyvážená, uvážlivá

## 💾 Ukládání dat

Hra automaticky ukládá:
- **Historie chatu** (posledních 50 zpráv)
- **Výsledky her** s podpisy hráčů
- **Nastavení hry**

Data jsou uložena v localStorage prohlížeče.

## 🛠️ Technologie

- **Vite** - Build tool a dev server
- **Vanilla JavaScript** - ES6+ moduly
- **CSS3** - Moderní styly s Grid a Flexbox
- **LocalStorage** - Trvalé ukládání dat

## 🎨 Vlastní úpravy

### Přidání nové AI osobnosti

1. Rozšiřte `aiPersonalities` v `src/js/ai/personalities.js`
2. Přidejte CSS styly v `src/styles/game.css`
3. Aktualizujte HTML template pro nového hráče

### Úprava herních pravidel

Upravte logiku v `src/js/game/diceLogic.js` pro změnu:
- Bodování kombinací
- Počet kostek
- Minimální skóre pro ukončení tahu

## 📝 Licence

MIT License - viz LICENSE soubor pro detaily.

## 🤝 Přispívání

1. Forkněte repozitář
2. Vytvořte feature branch (`git checkout -b feature/nova-funkce`)
3. Commitněte změny (`git commit -am 'Přidána nová funkce'`)
4. Pushněte do branch (`git push origin feature/nova-funkce`)
5. Vytvořte Pull Request

## 🐛 Hlášení chyb

Nalezli jste chybu? [Vytvořte issue](../../issues) s detailním popisem problému.

## 📞 Kontakt

Pro otázky a návrhy mě kontaktujte na [email@example.com](mailto:email@example.com).

---

**Vytvořeno s ❤️ a moderními web technologiemi**

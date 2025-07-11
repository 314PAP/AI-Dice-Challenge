# 🎲 AI Dice Challenge

Modulární kostková hra s AI osobnostmi postavená na **Pure Bootstrap 5.3.2** a neonovém designu.

## ✨ Hlavní funkce

- 🎯 **Pure Bootstrap** - 100% responzivní design
- 🤖 **AI Personalities** - Interaktivní chat s 3 AI osobnostmi (Gemini, ChatGPT, Claude)
- 🎲 **Farkle Game Logic** - Kompletní implementace pravidel hry Farkle
- 🌈 **Neonový design** - Sci-fi vzhled s 6 neonovými barvami
- ⚡ **ES6 moduly** - Čistá modulární architektura
- 📱 **Mobile-first** - Optimalizováno pro všechna zařízení

## 🚀 Rychlý start

```bash
# Klonování
git clone https://github.com/314PAP/AI-Dice-Challenge.git
cd AI-Dice-Challenge

# Instalace
npm install

# Spuštění dev serveru
npm start
```

## 🎨 Neonová barevná paleta

```css
--neon-green: #39ff14    /* Hlavní barva, texty hráče */
--neon-blue: #194DD1     /* AI Gemini, prvky UI */
--neon-purple: #FF00FF   /* AI ChatGPT */
--neon-orange: #FF8800   /* AI Claude, akční tlačítka */
--neon-red: #ff3131      /* Varovné prvky */
--neon-yellow: #ffff00   /* Systémové zprávy */
--neon-black: #000000    /* Pozadí */
```

## 📱 Responzivní layout

### Desktop (≥576px):
- **Game Area**: 67% šířky (Bootstrap col-sm-8)
- **Chat Area**: 33% šířky (Bootstrap col-sm-4) 
- **Poměr**: 2:1 optimální pro hru

### Mobile (<576px):
- **Vertikální stack** layout
- **Game Area**: 60vh
- **Chat Area**: 40vh

## � Herní pravidla (Farkle)

### Cíl hry
Dosáhnout nastaveného cílového skóre (výchozí 10,000 bodů).

### Bodování
- **Trojice**: 3× stejná kostka = hodnota × 100 bodů (kromě jedniček)
- **Trojice jedniček**: 3× jednička = 1,000 bodů
- **Jednotlivé jedničky**: 100 bodů za každou
- **Jednotlivé pětky**: 50 bodů za každou

### Průběh tahu
1. Hráč hodí všemi 6 kostkami
2. Vybere bodované kostky
3. Může pokračovat s zbývajícími kostkami nebo ukončit tah
4. Pokud žádná kostka nedává body = "Farkle" (ztráta všech bodů tahu)

## 🏗️ Architektura

### CSS (Bootstrap-first)
- **Primární**: Bootstrap utility třídy
- **Sekundární**: Neonová rozšíření (text-neon-green, border-neon-blue, atd.)
- **Minimální vlastní CSS**: Pouze pro neonové efekty

### JavaScript (ES6 moduly)
```
src/js/
├── game/         # Herní logika a stav
├── ai/           # Chat systém a AI osobnosti  
├── ui/           # UI komponenty a renderování
└── utils/        # Pomocné funkce a konstanty
```

## 🤖 AI Osobnosti

### Gemini (Modrá)
- **Strategie**: Analytická
- **Risk tolerance**: 0.7 (vysoká)
- **Styl**: Chytrý, strategický

### ChatGPT (Purpurová)  
- **Strategie**: Vyvážená
- **Risk tolerance**: 0.5 (střední)
- **Styl**: Přátelský, povídavý

### Claude (Oranžová)
- **Strategie**: Opatrná
- **Risk tolerance**: 0.3 (nízká)  
- **Styl**: Promyšlený, opatrný

## 🔧 Technologie

- **Frontend**: HTML5, ES6+ JavaScript
- **Styling**: Bootstrap 5.3.2, Custom neon CSS
- **Icons**: Bootstrap Icons
- **Build**: Vite 5+ (alternativně Python HTTP server)
- **Fonts**: Orbitron (Google Fonts)

## � Struktura projektu

```
├── index.html                    # Hlavní HTML soubor
├── src/
│   ├── main.js                   # Vstupní bod aplikace
│   ├── js/                       # JavaScript moduly
│   │   ├── game/                 # Herní logika
│   │   ├── ai/                   # AI a chat systém
│   │   ├── ui/                   # UI komponenty
│   │   └── utils/                # Pomocné funkce
│   └── styles/                   # CSS soubory
│       ├── main.css              # Hlavní CSS
│       ├── colors-bootstrap-simple.css  # Neonové barvy
│       ├── responsive-bootstrap.css     # Responzivní systém
│       └── components/           # Komponenty CSS
└── package.json                  # NPM konfigurace
```

## 🧪 Testování

1. **Bootstrap test**: `test-bootstrap-pure.html` - čistý Bootstrap layout
2. **Barevný test**: `test-buttons-colors.html` - ověření neonových barev
3. **Responzivní test**: Resize okna nebo DevTools device toolbar

## � Development Status

### ✅ Dokončeno
- Bootstrap responzivní layout
- Neonový design systém
- Chat UI s barevnými AI osobnostmi
- Loading screen s animacemi
- Modulární JavaScript architektura
- CSS optimalizace a čištění

### ⚠️ Zbývá dokončit
- Kompletní herní logika (funkcionalita kostek)
- AI rozhodovací algoritmy
- Síň slávy persistence
- Pokročilé animace

## 📄 Dokumentace

**Hlavní dokumentace**: [`KOMPLETNI_DOKUMENTACE_SYSTEMU.md`](./KOMPLETNI_DOKUMENTACE_SYSTEMU.md)

Obsahuje:
- Detailní CSS/JS architektura
- Pokyny pro Copilota
- Identifikované problémy a řešení
- Barevný systém a utility třídy

## 🤝 Přispívání

1. Fork projektu
2. Dodržuj Bootstrap-first přístup
3. Používej neonovou barevnou paletu
4. Zachovej modularitu (max 150 řádků/soubor)
5. Testuj na různých zařízeních

## 📄 Licence

MIT License - viz [LICENSE](./LICENSE)

---

**Verze**: 1.0  
**Status**: 🚧 Aktivní vývoj  
**Poslední update**: 11. července 2025


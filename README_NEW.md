# 🎲 AI Kostková Výzva (AI Dice Challenge)

Interaktivní kostková hra s pokročilými AI personality, chat systémem a cyberpunk designem.

## 🌟 Hlavní funkce

### 🎮 Herní mechaniky
- **Farkle pravidla** - kostková hra s rizikem a strategií
- **Nastavitelné cílové skóre** - 1000-50000 bodů
- **Realistická AI** - tři různé AI personality s unikátními reakcemi
- **Hall of Fame** - ukládání nejlepších výsledků lokálně

### 🤖 AI Personalities
- **Gemini** 📊 - Analytická AI s focus na statistiky a data
- **ChatGPT** 😎 - Zábavná AI s humor a casual attitude
- **Claude** 🧘 - Filozofická AI s moudrostí a kontemplací

### 💬 Pokročilý chat systém
- **Kontextové odpovědi** - AI reagují na hru i na vaše zprávy
- **Easter eggs** - speciální reakce na klíčová slova
- **AI banter** - AI si mezi sebou vyměňují repliky
- **Trash talk** - hecování při špatných hodech
- **Interaktivní komunikace** - reálný pocit hraní s AI

### 🎨 Design & UX
- **Neonový cyberpunk theme** - černé pozadí s neonovými barvami
- **Plně responzivní** - funguje na desktop, tablet i mobil
- **Animace a efekty** - smooth transitions a hover efekty
- **Orbitron font** - futuristický monospace písmo

## 🏗️ Technická architektura

### 📁 Struktura projektu
```
src/
├── styles/          # CSS moduly
│   ├── main.css     # Základní layout a styly
│   ├── game.css     # Herní prvky, kostky, hráči
│   ├── components.css # Tlačítka, modály, komponenty
│   └── chat.css     # Chat systém
├── js/              # JavaScript moduly
│   ├── ai/          # AI kontrolery a personalities
│   ├── game/        # Herní logika a state
│   ├── ui/          # UI kontrolery a DOM manipulace
│   └── utils/       # Utility funkce
└── main.js          # Entry point
```

### 🛠️ Technologie
- **Vite** - Modern build tool
- **Vanilla JavaScript** - ES6+ moduly
- **CSS Grid/Flexbox** - Moderní layout
- **LocalStorage** - Perzistence dat
- **GitHub Actions** ready

## 🚀 Spuštění projektu

### Prerequisites
- Node.js 18+
- npm nebo yarn

### Instalace
```bash
git clone https://github.com/314PAP/AI-Dice-Challenge.git
cd AI-Dice-Challenge
npm install
```

### Development
```bash
npm run dev
```
Aplikace běží na `http://localhost:5173`

### Build
```bash
npm run build
```

## 🎯 Jak hrát

1. **Nastavte cílové skóre** (doporučeno 10000 bodů)
2. **Hoďte kostky** - získáte 6 kostek s čísly 1-6
3. **Vyberte scoring kostky**:
   - Jedničky = 100 bodů každá
   - Pětky = 50 bodů každá
   - Trojice = hodnota × 100 (1-1-1 = 1000 bodů)
4. **Rozhodněte se**:
   - 💰 **Odložit vybrané** - uložit body a pokračovat
   - 🔄 **Ukončit tah** - ztratit points z tahu
   - 🎲 **Hodit znovu** - risknout pro více bodů
5. **FARKLE** - pokud nevypadnou žádné scoring kostky, ztratíte všechny body z tahu!

### 🏆 Vítězství
- Dosáhněte cílového skóre jako první
- Zapište se do Hall of Fame se svým podpisem
- Vychloubejte se AI kamarádům! 😄

## 🔧 Development

### 📝 Commit konvence
```
🎲 feat: nová herní funkce
🎨 style: úpravy designu
🐛 fix: oprava chyby
📚 docs: dokumentace
♻️ refactor: refaktoring kódu
🧪 test: testy
⚡ perf: optimalizace
```

### 🌟 Přispívání
1. Fork repozitář
2. Vytvořte feature branch
3. Commitněte změny
4. Pushnněte branch
5. Vytvořte Pull Request

## 📄 License

MIT License - viz [LICENSE](LICENSE) soubor.

## 👨‍💻 Autor

**PIPAP** - [314PAP](https://github.com/314PAP)

---

*Vytvořeno s ❤️ a velkým množstvím ☕*

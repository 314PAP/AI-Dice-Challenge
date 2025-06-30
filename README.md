# 🎲 AI Kostková Výzva (AI Dice Challenge)

Interaktivní kostková hra proti třem AI protivníkům s různými osobnostmi!

![AI Dice Challenge](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🎮 O hře

**AI Kostková Výzva** je moderní implementace klasické kostkové hry, kde hrajete proti třem AI protivníkům s unikátními osobnostmi:

- **🤖 Gemini** - Analytické AI zaměřené na statistiky a data
- **😎 ChatGPT** - Vtipné a sebevědomé AI s casualním stylem  
- **🧘 Claude** - Filozofické a moudré AI s kontemplativním přístupem

## ✨ Klíčové funkce

### 🎯 Herní mechaniky
- **Farkle pravidla** - Klasické kostková hra s rizikem a strategií
- **Nastavitelné cílové skóre** - Od 1000 do nekonečna
- **Real-time scoring** - Okamžité vyhodnocování bodů
- **Intelligent AI turns** - AI hrají podle svých personalit

### 💬 Pokročilý chat systém
- **Kontextové reakce** - AI reagují na herní situace
- **Easter eggs** - Skryté zprávy a vtíčky
- **Trash talking** - AI si hecují navzájem i hráče
- **Osobní konverzace** - Každé AI má svůj styl komunikace

### 🏆 Síň slávy
- **Trvalé ukládání** - LocalStorage pro perzistenci dat
- **Detailní statistiky** - Doba hry, počet tahů, skóre
- **Osobní podpisy** - Zapište se do historie

### 🎨 Moderní UI/UX
- **Neon design** - Futuristický vzhled
- **Responsive layout** - Funguje na všech zařízeních
- **Smooth animations** - Plynulé přechody a efekty
- **Intuitive controls** - Jednoduché ovládání

## 🚀 Jak začít

### Online verze
Zahrajte si přímo v prohlížeči: [AI Dice Challenge](https://314pap.github.io/AI-Dice-Challenge/)

### Lokální instalace

```bash
# Klonování repozitáře
git clone https://github.com/314PAP/AI-Dice-Challenge.git
cd AI-Dice-Challenge

# Instalace závislostí
npm install

# Spuštění dev serveru
npm run dev
```

## 🎮 Jak hrát

1. **Nastavte cílové skóre** (výchozí: 10,000 bodů)
2. **Hoďte kostkami** - získejte body podle Farkle pravidel
3. **Bankujte body** nebo **riskujte další hod**
4. **Comunicujte s AI** - chatujte během hry
5. **Vyhrajte** a zapište se do síně slávy!

### 📋 Bodování (Farkle pravidla)
- **1** = 100 bodů (každá)
- **5** = 50 bodů (každá)  
- **Triplet 1** = 1000 bodů
- **Triplet 2-6** = hodnota × 100 bodů
- **Žádné body** = FARKLE! (ztráta tahu)

## 🛠️ Technické detaily

### Architektura (Nová modulární struktura)
```
src/
├── core/                  # Základní systémy
│   ├── constants.js       # Herní konstanty
│   ├── gameEngine.js      # Hlavní herní engine
│   └── gameState.js       # Správa herního stavu
├── game/                  # Herní logika
│   ├── flow/              # Řízení herního toku
│   ├── turns/             # Správa tahů
│   ├── dice/              # Interakce s kostkami
│   └── events/            # Herní události
├── ai/                    # AI systém
│   ├── controllers/       # AI řadiče
│   └── personalities/     # AI osobnosti
├── ui/                    # UI komponenty
│   └── chat/              # Chat systém
├── js/                    # Legacy kompatibilita
│   ├── game/              # Původní herní logika
│   ├── ai/                # AI wrappers
│   └── ui/                # UI wrappers
└── styles/                # CSS moduly
    ├── base/              # Základní styly
    ├── components/        # Komponenty
    └── themes/            # Témata
```

### Technologie
- **Vanilla JavaScript** - Žádné frameworky, čistý JS
- **Vite** - Build tool a dev server
- **CSS3** - Pokročilé stylování s animacemi
- **LocalStorage** - Perzistence dat
- **ES6+ Modules** - Modulární architektura

### Klíčové soubory
- `index.html` - Hlavní HTML struktura
- `src/main.js` - Entry point pro moduly (Vite)
- `src/core/` - Základní herní systémy
- `src/game/` - Modulární herní logika
- `src/ai/` - AI kontrolery a osobnosti  
- `src/ui/` - UI komponenty a chat
- `src/styles/` - Modulární CSS styling
- `public/ai-icons/` - Avatary AI hráčů

## 🤖 AI Systém

### Gemini - Analytické AI
```javascript
responses: {
    goodRoll: "Optimalizovaný výsledek podle predikcí 📊",
    badRoll: "Suboptimální. Analyzuji vzorce selhání... 📉",
    farkle: "Nula bodů získána. Výpočet rizika selhal 📉"
}
```

### ChatGPT - Casual AI  
```javascript
responses: {
    goodRoll: "Nice! But I'm still gonna crush you! 😂",
    badRoll: "Ouch! That hurt to watch! 😅", 
    farkle: "FARKLE! Classic human move! 😂🔥"
}
```

### Claude - Filozofické AI
```javascript
responses: {
    goodRoll: "Vynikající provedení! 🎯",
    badRoll: "Štěstí je proměnlivé... 🤔",
    farkle: "Takové jsou kostky života... 🎭"
}
```

## 🎨 Design systém

### Barevná paleta
- **Neon zelená**: `#39ff14` - Primary
- **Neon modrá**: `#0099ff` - Secondary  
- **Neon oranžová**: `#ff6600` - Accent
- **Neon růžová**: `#ff00ff` - Special
- **Tmavé pozadí**: `#0a0a0a` - Background

### Komponenty
- **Neon borders** - Svítící okraje
- **Hover effects** - Interaktivní prvky
- **Responsive grid** - Flexibilní layout
- **Modal dialogs** - Overlay komponenty

## 📱 Podporované platformy

- ✅ **Desktop** - Chrome, Firefox, Safari, Edge
- ✅ **Mobile** - iOS Safari, Android Chrome
- ✅ **Tablet** - iPadOS, Android tablets
- ✅ **PWA ready** - Může být instalováno jako app

## 🤝 Přispívání

Rádi uvítáme pull requesty! Pro větší změny prosím nejdřív otevřete issue.

### Development workflow
```bash
# Vytvoření feature branche
git checkout -b feature/nova-funkce

# Implementace a testování
npm run dev

# Commit a push
git commit -m "feat: přidána nová funkce"
git push origin feature/nova-funkce
```

## 📄 Licence

Tento projekt je licencován pod MIT licencí - viz [LICENSE](LICENSE) soubor.

## 👨‍💻 Autor

**PIPAP** - *Vývojář* - [GitHub](https://github.com/314PAP)

### ☕ Podpora
Pokud se vám projekt líbí, můžete mě podpořit kafem!
[Buy Me A Coffee](https://buymeacoffee.com/pipap)

---

## 🎯 Roadmapa

### V1.1 (Plánováno)
- [ ] Multiplayer režim
- [ ] Vlastní AI personality
- [ ] Achievements systém
- [ ] Sound effects

### V1.2 (Budoucnost)
- [ ] Tournament mód
- [ ] API integrace s real AI
- [ ] Mobile app verze
- [ ] Streaming integrace

---

**🎲 Užijte si hru a porazte AI protivníky!** 

*Made with ❤️ and lots of ☕ by PIPAP*
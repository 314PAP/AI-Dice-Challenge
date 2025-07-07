# 🎲 AI Dice Challenge

Moderní kostková hra s AI protihráči v neonovém retro-futuristickém stylu.

## 🚀 Rychlé spuštění

```bash
npm install
npm run dev
```

Otevřete [http://localhost:5173](http://localhost:5173) v prohlížeči.

## 🎮 O hře

AI Dice Challenge je implementace klasické hry **Farkle** s AI protihráči:
- **Gemini** (modrá) - Strategický a opatrný
- **ChatGPT** (růžová) - Kreativní a rizikový  
- **Claude** (oranžová) - Vyvážený a analytický

### Pravidla
- Hoďte kostkami a vyberte skórující kombinace
- Dosáhněte cílového skóre (standardně 10,000 bodů)
- Vyvarujte se FARKLE (žádné skórující kostky)

## 🎨 Design

Neonový retro-futuristický design s:
- Responzivním layoutem (desktop + mobilní)
- Smooth animacemi a hover efekty
- Bootstrap-first přístupem
- Modulární CSS architekturou

## 🛠️ Technické detaily

- **Frontend**: Vanilla JS + Bootstrap 5
- **Build tool**: Vite
- **Styling**: Modulární CSS s CSS proměnnými
- **Architektura**: Komponentový přístup s templates

## 📁 Struktura projektu

```
src/
├── main-simple.js          # Hlavní aplikační logika
├── styles/                 # Modulární CSS
│   ├── variables/         # CSS proměnné (barvy, velikosti)
│   └── components/        # Komponenty (tlačítka, kostky, chat)
└── templates/             # HTML šablony
    ├── game-menu.html     # Hlavní menu
    ├── game-controls.html # Desktop herní ovládání
    └── game-controls-mobile.html # Mobilní ovládání
```

## 🎯 Status projektu

✅ **DOKONČENO** - Plně funkční hra připravená k použití

Více informací v [PROJECT_STATUS.md](PROJECT_STATUS.md)

## 📦 Git archiv

Vývojové větve byly archivovány do `git-archive/`. 
Aktivní je pouze větev `main`.

---

*Vytvořeno s ❤️ pomocí GitHub Copilot*

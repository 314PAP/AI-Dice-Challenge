# 🎵 AI Dice Challenge - Zvukový systém

## 📝 Popis

8-bit retro zvukový systém pro AI Dice Challenge, který využívá čistou Web Audio API pro generování zvuků a `Howler.js` pro přehrávání. Všechny zvuky jsou generovány procedurálně bez dalších závislostí.

## 🎮 Podporované zvuky

| Zvuk | Trigger | Popis |
|------|---------|-------|
| `diceRoll` | Házení kostkami | Square wave, střední frekvence |
| `diceClick` | Klik na kostku | Rychlý sharp beep |
| `score` | Úspěšné skórování | Sawtooth wave, stoupající |
| `farkle` | Neúspěšný hod | Triangle wave, klesající |
| `menuHover` | Hover na tlačítko | Sine wave, jemný |
| `aiTurn` | AI hraje tah | Sawtooth, robotický |

## 🎼 Speciální sekvence

- `playDiceSequence(diceCount)` - Postupné hádzanie kostek s odmením
- `playSuccessSequence()` - Dvojitý úspěch efekt

## 🛠️ Technické detaily

### Použité knihovny

```json
{
  "howler": "^2.2.4"  // Audio playback engine
}
```

### Architektura

```
soundSystem.js (Singleton)
├── Howl objekty pro každý zvuk
├── Web Audio API pro generování zvuků
├── Procedurální vytváření WAV dat
├── Automatic initialization on first click
└── Volume & enable/disable controls
```

### Generování zvuků

Každý zvuk je generován pomocí různých wave typů:

```javascript
// Příklad: Square wave pro dice roll
const frequency = 400; // Hz
const duration = 0.2;   // sekundy
const waveType = 'square';

// Generuje se procedurálně a konvertuje na WAV
```

### Inicializace

Zvukový systém se inicializuje automaticky při prvním user interaction (klik/touch) kvůli Web Audio API požadavkům prohlížečů.

```javascript
// Automatická inicializace v main.js
initializeSoundSystem() {
    const initOnFirstClick = () => {
        soundSystem.init();
        // Odstraní listenery po použití
    };
    
    document.addEventListener('click', initOnFirstClick);
    document.addEventListener('touchstart', initOnFirstClick);
}
```

## 🎯 Použití

### Import
```javascript
import soundSystem from './src/js/utils/soundSystem.js';
```

### Základní přehrání
```javascript
soundSystem.play('diceRoll');
soundSystem.play('score', 0.8); // s volume multiplikátorem
```

### Ovládání
```javascript
soundSystem.setVolume(0.5);  // 50% hlasitost
soundSystem.toggle();        // zapnout/vypnout
soundSystem.stopAll();       // zastavit všechny zvuky
```

## 🔧 Integrace do hry

### GameLogic.js
- `diceRoll` při házení kostek
- `score` při úspěšném hodu  
- `farkle` při neúspěšném hodu

### UIComponents.js
- `diceClick` při kliknutí na kostku
- `menuHover` při hover na tlačítka

### AIPlayerController.js
- `aiTurn` při začátku AI tahu

## 📱 Responzivita

Zvukový systém respektuje:
- ✅ Prefers-reduced-motion (automatické vypnutí)
- ✅ Mobile touch events
- ✅ Performance throttling
- ✅ Memory management (lazy loading)

## 🧪 Testování

Spusťte `test-sounds.html` pro interaktivní testování všech zvuků:

```bash
npm run dev
# Otevřete http://localhost:5175/test-sounds.html
```

Test obsahuje:
- Všechny individuální zvuky
- Sekvence a kombinace
- Ovládání hlasitosti
- Enable/disable toggle
- Real-time log

## ⚙️ Konfigurace

### Parametry jsfxr

Všechny zvuky jsou definovány jako pole 24 parametrů pro jsfxr:

```javascript
[
    wave_type,    // 0=square, 1=sawtooth, 2=triangle, 3=noise
    base_freq,    // Základní frekvence (0.0-1.0)
    freq_limit,   // Limit frekvence
    freq_ramp,    // Změna frekvence v čase
    // ... 20 dalších parametrů
]
```

### Výkonnost

- Všechny zvuky jsou pre-generovány při inicializaci
- Používá Web Audio API pro nízkou latenci
- Automatické uvolňování paměti
- Throttlované hover efekty

## 🚀 Rozšíření

Pro přidání nového zvuku:

1. Definujte jsfxr parametry v `generateSounds()`
2. Přidejte do `this.sounds[nazev]`
3. Použijte `soundSystem.play('nazev')`

## 📊 Kompatibilita

- ✅ Chrome 66+
- ✅ Firefox 60+
- ✅ Safari 14+
- ✅ Edge 79+
- 📱 Mobile browsers (s omezením autoplay)

## 🔧 Troubleshooting

### Zvuk nehraje
1. Zkontrolujte console pro chyby
2. Ověřte, že došlo k user interaction
3. Zkontrolujte, zda není zvuk vypnutý

### Performance problémy
1. Snižte volume nebo vypněte zvuky
2. Zkontrolujte paměť (dev tools)
3. Restartujte aplikaci

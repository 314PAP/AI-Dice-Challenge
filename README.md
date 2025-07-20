# 🎲 AI Dice Challenge 1.0

**Moderní kostkářská hra s AI protivníky postavená na Bootstrap 5 a ES6 modulech**

## 🎯 O hře

AI Dice Challenge je implementace hry Farkle s pokročilými AI protivníky. Cílem je dosáhnout **10,000 bodů** jako první hráč.

### 🎮 Hlavní funkce

- **3 AI protivníci** s různými strategiemi
- **Real-time chat systém** s AI reakcemi
- **Hot Dice mechanika** - při odložení všech kostek musíte pokračovat
- **Plně responzivní UI** postavené na Bootstrap 5

## 🚀 Rychlý start

```bash
# Naklonování a spuštění
git clone https://github.com/314PAP/AI-Dice-Challenge.git
cd AI-Dice-Challenge
npm install
npm run dev
```

## 🤖 AI protivníci

- **Gemini** 🔵 - Analytický stratég (riskantní)
- **ChatGPT** 🟣 - Vyvážený hráč (střední riziko)
- **Claude** 🟠 - Opatrný taktik (konzervativní)

## 📋 Pravidla

Podrobná pravidla najdete v [PRAVIDLA.md](PRAVIDLA.md)

### Základní mechanika

- **Cíl**: 10,000 bodů
- **První vstup**: Minimálně 300 bodů
- **Farkle**: Žádná skórující kombinace = ztráta všech bodů v tahu
- **Hot Dice**: Při odložení všech 6 kostek musíte pokračovat

### Bodování

- **1** = 100 bodů, **5** = 50 bodů
- **Tři stejných**: 1,1,1 = 1,000; ostatní = hodnota × 100
- **Tři páry** = 1,500 bodů
- **Postupka** (1,2,3,4,5,6) = 2,000 bodů
- **Čtyři stejných**: dvojnásobek tří stejných

## 🔧 Technologie

- **Bootstrap 5** - responzivní UI
- **ES6 moduly** - modulární architektura
- **Animační knihovny** - smooth efekty
- **Python HTTP server** - lokální vývoj

## 📁 Struktura

```
src/js/ai/     # AI logika a osobnosti
src/js/game/   # Herní mechaniky
src/js/ui/     # UI komponenty
skripty/       # Automatizace a testy
```

## 📄 Licence

MIT License

---

## ⭐ Osobní projekt

Moje první hra pomocí **Vibecodingu** - dělal jsem to s GitHub Copilotem - Claude Sonnet 4. Trvalo to od 30. června do 20. července 2025 (21 dní intenzivního kódění), několikrát už byla hra skoro hotová, ale buď se mi zaběhla ovce, nebo jsem se rozhodl něco změnit od základů.

### 💸 Realita vývoje

- **💰 Utraceno**: $42,93 za Copilota
- **☕ Káva**: Všechku jsem vypil
- **🧠 Nervy**: V kyblíku, ale dal jsem to dokupy!

### 🛠️ Použité technologie

- **GitHub Copilot + Claude Sonnet 4** - AI asistenti
- **Bootstrap 5** - responzivní framework
- **ES6 moduly** - čistá JavaScript architektura
- **CSS knihovny** - Animate.css, Hover.css pro profesionální animace
- **Git** - pokročilé verzování s 370+ commits
- **VS Code** - s custom auto-backup systémem

### 📈 Vývojové statistiky

- **🗓️ Doba vývoje**: 21 dní (30.6. - 20.7.2025)
- **📊 Commits**: 370+ verzí s automatickým zálohováním
- **🧪 Testování**: Komprehenzivní test suite pro Farkle logiku
- **📱 Responzivita**: Mobile-first design s Bootstrap grid systémem
- **🔄 Refaktorů**: Několik kompletních přepisů

### 💝 Podpořte projekt

Tak mi můžete třeba koupit kafe, bo jsem všechku toho vypil! [☕ Buy me a coffee](https://buymeacoffee.com/pipap)

---

*Vytvořeno s ❤️ pomocí moderních web technologií*

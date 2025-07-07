# 📖 Doplnění pravidel - Bodování kombinací

## 🎯 Problém
V pravidlech hry chybějí dvě důležité kombinace z klasického Farkle:
- **3 dvojice** - důležitá kombinace v klasickém Farkle
- **Postupka** (1-2-3-4-5-6) - další běžná kombinace

## 🔧 Provedené doplňky

### 1. Přidána kombinace "3 dvojice"
- **Bodování**: 1 500 bodů
- **Popis**: Tři páry různých čísel (např. 1-1, 3-3, 5-5)
- **Barva**: Žlutá (neon-yellow)

### 2. Přidána kombinace "Postupka"
- **Bodování**: 1 500 bodů  
- **Popis**: Sekvence 1-2-3-4-5-6 (každé číslo jednou)
- **Barva**: Žlutá (neon-yellow)

## 📋 Kompletní bodovací tabulka

### Základní kombinace:
- **Každá 1**: 100 bodů
- **Každá 5**: 50 bodů

### Trojice:
- **Tři 1**: 1 000 bodů
- **Tři 2**: 200 bodů
- **Tři 3**: 300 bodů
- **Tři 4**: 400 bodů
- **Tři 5**: 500 bodů
- **Tři 6**: 600 bodů

### Větší kombinace:
- **Čtyři stejné**: Trojice × 2
- **Pět stejných**: Trojice × 4
- **Šest stejných**: Trojice × 8

### Speciální kombinace:
- **🟡 Tři dvojice**: 1 500 bodů
- **🟡 Postupka (1-2-3-4-5-6)**: 1 500 bodů

## 🎨 Styling
- Nové kombinace používají žlutou barvu (`neon-yellow`)
- Konzistentní s ostatními pravidly
- Bootstrap-first layout zachován

## 🎮 Herní logika
⚠️ **Poznámka**: Tyto kombinace jsou přidány pouze do pravidel pro informaci. 
Pokud chcete, aby byly i funkčně implementovány ve hře, bylo by potřeba:
1. Upravit logiku detekce kombinací v herním kódu
2. Přidat funkce pro rozpoznávání těchto kombinací
3. Implementovat bodování ve skórovacím systému

Aktuálně jsou pravidla kompletní a odpovídají klasickému Farkle!

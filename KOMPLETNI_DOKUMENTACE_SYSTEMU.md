# 🎲 AI DICE CHALLENGE - KOMPLETNÍ DOKUMENTACE SYSTÉMU

**Datum vytvoření**: 11. července 2025  
**Verze**: 1.0  
**Status**: HLAVNÍ DOKUMENTACE - všechny ostatní dokumentace jsou zastaralé

---

## 📋 OBSAH

1. [Současný stav systému](#současný-stav-systému)
2. [CSS architektura](#css-architektura)
3. [JavaScript architektura](#javascript-architektura)
4. [Identifikované problémy](#identifikované-problémy)
5. [Herní pravidla](#herní-pravidla)
6. [Úkoly k dokončení](#úkoly-k-dokončení)
7. [Pokyny pro Copilota](#pokyny-pro-copilota)

---

## 🎯 SOUČASNÝ STAV SYSTÉMU

### ✅ CO FUNGUJE
- **Bootstrap layout** - 100% responzivní bez vlastního CSS
- **Menu systém** - kompletně nastylované s neonovými barvami
- **Chat UI** - vizuálně správné, fungující scrollbar
- **Modularita** - čistě rozdělený kód do ES6 modulů
- **Loading screen** - černé pozadí s neonovými efekty a delším trváním
- **Chat zprávy** - zelená barva pro uživatele (opraveno CSS kolize)

### ⚠️ CO POTŘEBUJE OPRAVU
- **Herní plocha** - nefunkční design a logika po startu hry (HLAVNÍ PRIORITA)

---

## 🎨 CSS ARCHITEKTURA

### 📁 Struktura CSS souborů

```
src/styles/
├── main.css                    ← HLAVNÍ CSS soubor
├── colors-bootstrap-simple.css ← Aktivní barevný systém
├── colors-bootstrap.css        ← PRÁZDNÝ soubor
├── responsive-bootstrap.css    ← Responzivní systém
├── critical.css               ← PRÁZDNÝ soubor
├── responsive-heights.css     ← PRÁZDNÝ soubor
├── responsive-text.css        ← PRÁZDNÝ soubor
├── components/
│   ├── neon-buttons.css       ← Neonová tlačítka
│   ├── chat.css               ← Chat komponenta
│   ├── dice.css               ← Herní kostky
│   └── neon-spinner.css       ← Loading animace
└── forms/
    └── neon-forms.css         ← Formulářové prvky
```

### 🎨 Definované CSS třídy

#### Barevné proměnné (colors-bootstrap-simple.css)
```css
:root {
  --neon-green: #39ff14;
  --neon-blue: #194DD1;
  --neon-purple: #FF00FF;
  --neon-orange: #FF8800;
  --neon-red: #ff3131;
  --neon-yellow: #ffff00;
  --neon-black: #000000;
}
```

#### Utility třídy pro text
```css
.text-neon-green   → zelená s neonovým stínem
.text-neon-blue    → modrá s neonovým stínem
.text-neon-purple  → purpurová s neonovým stínem
.text-neon-orange  → oranžová s neonovým stínem
.text-neon-red     → červená s neonovým stínem
.text-neon-yellow  → žlutá s neonovým stínem
```

#### Utility třídy pro okraje
```css
.border-neon-green   → zelený okraj
.border-neon-blue    → modrý okraj
.border-neon-purple  → purpurový okraj
.border-neon-orange  → oranžový okraj
.border-neon-red     → červený okraj
.border-neon-yellow  → žlutý okraj
```

#### Neonová tlačítka
```css
.btn-neon[data-neon-color="green"]   → zelené neonové tlačítko
.btn-neon[data-neon-color="blue"]    → modré neonové tlačítko
.btn-neon[data-neon-color="purple"]  → purpurové neonové tlačítko
.btn-neon[data-neon-color="orange"]  → oranžové neonové tlačítko
.btn-neon[data-neon-color="red"]     → červené neonové tlačítko
.btn-neon[data-neon-color="yellow"]  → žluté neonové tlačítko
```

### 🔍 IDENTIFIKOVANÉ CSS PROBLÉMY

1. **Prázdné CSS soubory**
   - `colors-bootstrap.css` - prázdný
   - `critical.css` - prázdný  
   - `responsive-heights.css` - prázdný
   - `responsive-text.css` - prázdný

2. **Chat roller problem**
   - Lokace: `src/styles/components/chat.css`
   - Problém: Více definic pro `.chat-message-user` způsobuje modrý místo zeleného

3. **Loading screen**
   - Problém: Bílé pozadí místo černého
   - Řešení: Přidat `bg-neon-black` třídu

---

## ⚙️ JAVASCRIPT ARCHITEKTURA

### 📁 Struktura JS modulů

```
src/js/
├── main.js                 ← Hlavní vstupní bod
├── game/
│   ├── gameState.js        ← Centrální stav hry
│   └── diceMechanics.js    ← Logika kostek
├── ai/
│   ├── chatSystem.js       ← Chat management
│   ├── personalities.js   ← AI osobnosti
│   └── aiInteractions.js  ← PRÁZDNÝ soubor
├── ui/
│   ├── gameUI.js          ← Herní rozhraní
│   ├── chatUI.js          ← Chat rozhraní
│   ├── uiComponents.js    ← UI komponenty
│   ├── autocomplete.js    ← Chat autocomplete
│   └── animations.js      ← PRÁZDNÝ soubor
└── utils/
    ├── constants.js       ← Konstanty
    ├── colors.js          ← Barevné utility
    ├── helpers.js         ← Pomocné funkce
    └── spinnerManager.js  ← Spinner management
```

### 🎯 Funkční moduly

#### GameState (gameState.js)
- **Funkcionalita**: Centrální správa herního stavu
- **Status**: ✅ Funkční
- **Používá**: Správné Bootstrap třídy

#### ChatSystem (chatSystem.js)
- **Funkcionalita**: Správa chatových zpráv
- **Status**: ✅ Funkční
- **Problém**: AI odpovědi používají správné barvy, ale CSS se přebíjí

#### GameUI (gameUI.js)  
- **Funkcionalita**: Renderování herního rozhraní
- **Status**: ⚠️ Částečně funkční
- **Problém**: Herní obrazovka nefunguje po startu

#### ChatUI (chatUI.js)
- **Funkcionalita**: Renderování chatu
- **Status**: ✅ Funkční
- **Problém**: Barvy rolleru se přebíjí

### 🔍 IDENTIFIKOVANÉ JS PROBLÉMY

1. **Prázdné JS soubory**
   - `aiInteractions.js` - prázdný
   - `animations.js` - prázdný

2. **GameUI nefunkčnost**
   - Po startu hry se zobrazí nesprávný design
   - Logika kostek nefunguje správně
   - Problém v `renderGameScreen()` metodě

3. **Barevné kolize v JS**
   - JavaScript používá správné barvy z `colors.js`
   - Problem je v CSS specificitě, ne v JS kódu

---

## 🎲 HERNÍ PRAVIDLA

### Základní pravidla hry Farkle

1. **Cíl hry**: Dosáhnout nastaveného cílového skóre (výchozí 10,000 bodů)

2. **Bodování**:
   - **Trojice**: 3× stejná kostka = hodnota × 100 bodů (kromě jedniček)
   - **Trojice jedniček**: 3× jednička = 1,000 bodů  
   - **Jednotlivé jedničky**: 100 bodů za každou
   - **Jednotlivé pětky**: 50 bodů za každou

3. **Průběh tahu**:
   - Hráč hodí všemi 6 kostkami
   - Vybere bodované kostky
   - Může pokračovat s zbývajícími kostkami nebo ukončit tah
   - Pokud žádná kostka nedává body = "Farkle" (ztráta všech bodů tahu)

4. **Vítězství**: První hráč, který dosáhne cílového skóre

---

## 🚨 ÚKOLY K DOKONČENÍ

### 1. CSS OPRAVY (Vysoká priorita)

#### A) Oprava rolleru zpráv v chatu
```css
/* Problem v chat.css - více definic pro .chat-message-user */
/* Řešení: Sjednotit definice a zajistit zelenou barvu */
```

#### B) Oprava loading screen
```css
/* Přidat bg-neon-black místo bílého pozadí */
```

#### C) Vyčištění prázdných CSS souborů
- Odstranit prázdné soubory nebo je naplnit obsahem

### 2. JAVASCRIPT OPRAVY (Vysoká priorita)

#### A) Oprava GameUI.renderGameScreen()
- Implementovat správný design herní plochy
- Zajistit funkčnost kostek
- Přidat správné Bootstrap třídy

#### B) Vyčištění prázdných JS souborů
- Naplnit `aiInteractions.js` a `animations.js` nebo je odstranit

### 3. LOADING SCREEN VYLEPŠENÍ (Střední priorita)
- Prodloužit dobu načítání
- Přidat pěkné animace
- Černé pozadí s neonovými efekty

### 4. SYSTÉMOVÉ ÚKOLY (Nízká priorita)
- Odstranit zastaralé dokumentace
- Vyčistit CSS konfliktní definice
- Optimalizovat modularitu

---

## 🤖 POKYNY PRO COPILOTA

### ⚡ HLAVNÍ ZÁSADY

1. **VŽDY používej Bootstrap utility třídy** místo vlastního CSS
2. **NIKDY nepřepisuj Bootstrap** - pouze rozšiřuj
3. **Kontroluj CSS specificity** - vyhni se konfliktům
4. **Zachovej neonový design** - konzistentní barvy
5. **Modularita first** - maximálně 150 řádků na soubor

### 🎨 CSS GUIDELINES

#### Barevný systém
```javascript
// VŽDY používej tyto barvy z colors.js
CONSOLE_COLORS = {
    neonGreen: '#39ff14',
    neonBlue: '#194DD1', 
    neonPurple: '#FF00FF',
    neonOrange: '#FF8800',
    neonRed: '#ff3131',
    neonYellow: '#ffff00',
    neonBlack: '#000000'
}
```

#### Bootstrap třídy priority
```css
/* PREFEROVANÝ postup pro barvy */
1. .text-neon-green    (naše utility)
2. .text-success       (Bootstrap) 
3. vlastní CSS         (pouze když nezbývá)
```

### 🔧 JavaScript GUIDELINES

#### Importy
```javascript
// VŽDY importuj z centrálních modulů
import { CONSOLE_COLORS } from './js/utils/colors.js';
import gameState from './js/game/gameState.js';
```

#### Event handling
```javascript
// VŽDY používej Bootstrap eventy kde možno
// Příklad: 'shown.bs.modal', 'hidden.bs.collapse'
```

### 🎯 AKTUÁLNÍ PRIORITY

1. **NEJDŘÍVE**: Opravit CSS kolize v chatu (modrý→zelený roller)
2. **POTOM**: Opravit loading screen pozadí  
3. **NAKONEC**: Implementovat funkční herní plochu

### 🚫 CO NEDĚLAT

- ❌ Neměnit Bootstrap core třídy
- ❌ Nevytvářet nové CSS soubory bez konzultace
- ❌ Nepřepisovat funkční Bootstrap layout
- ❌ Nepoužívat inline styly
- ❌ Nevytvářet duplicitní definice

### ✅ CO DĚLAT

- ✅ Používat Bootstrap utility classes
- ✅ Rozšiřovat pomocí neon-* tříd
- ✅ Testovat na všech breakpointech
- ✅ Zachovat modularitu
- ✅ Konzultovat před většími změnami

---

## 📞 KONTAKT A ÚDRŽBA

Tato dokumentace je **LIVING DOCUMENT** - aktualizuj ji při každé významné změně.

**Poslední aktualizace**: 11. července 2025  
**Další kontrola**: Po dokončení CSS oprav

---

*Tato dokumentace nahrazuje všechny předchozí dokumenty. Při práci s projektem se řiď výhradně tímto dokumentem.*

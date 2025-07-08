# Plán optimalizace mobilního layoutu a responzivity

## Identifikované problémy

1. **Nesoulad CSS a JS komponent pro kostky**
   - V CSS máme definice pro `neon-dice-container` a `dice-face`
   - V JS se používá třída `.dice` bez odpovídající CSS definice
   - Je potřeba zajistit konzistenci a plnou responzivitu

2. **Responzivita pro různé orientace mobilů**
   - Layout není optimalizován pro mobily v landscape orientaci
   - Potřebujeme zajistit plné využití prostoru bez fixních rozměrů

3. **Využití Bootstrap utility tříd**
   - Některé vlastní CSS definice lze nahradit Bootstrapem

## Navrhované řešení

### 1. Refaktorizace kostek

- Sjednotit třídy mezi CSS a JS
- Využít flexbox pro automatické rozvržení kostek
- Odstranit fixní rozměry a použít relativní jednotky
- Zajistit konzistentní styly pro různé velikosti obrazovky

### 2. Landscape orientace

- Upravit layout pro detekci landscape orientace
- Přizpůsobit rozložení pro lepší využití prostoru
- Implementovat speciální CSS pro landscape média query

### 3. Obecná responzivita

- Zajistit, aby se text vždy přizpůsobil dostupné šířce
- Optimalizovat padding/margin pro různé velikosti obrazovek
- Použít Bootstrap grid systém konzistentně v celé aplikaci

## Implementační priority

1. Sjednocení CSS pro kostky a jejich JS implementace
2. Optimalizace pro landscape orientaci na mobilech
3. Vylepšení responzivity textu a komponent
4. Přehodnocení struktury souborů pro lepší modularitu

## Testovací scénáře

- Mobil (portrait/landscape)
- Tablet (portrait/landscape)
- Desktop (různé šířky)
- TV/velké monitory

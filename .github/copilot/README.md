# AI Dice Game - Dokumentační pokyny

Tento adresář obsahuje dokumentaci a pokyny pro vývoj AI Dice Game. Dokumenty slouží jako referenční příručky pro GitHub Copilot a vývojáře pracující na projektu.

## Obsah dokumentace

### [Základní instrukce pro Copilot](instructions.md)
Hlavní dokument s pokyny pro GitHub Copilot, který definuje základní principy vývoje, strukturu projektu a kódovací standardy.

### [Bootstrap implementační pokyny](bootstrap-guidelines.md)
Detailní pokyny pro implementaci a refaktorování kódu s využitím Bootstrapu, včetně utility-first přístupu, komponent a responzivního designu.

### [Modularizační strategie](modularization-strategy.md)
Strategie pro efektivní rozdělování velkých souborů na menší moduly, včetně praktických příkladů pro JavaScript, HTML a CSS.

### [Neonový design - implementační příručka](neon-design-guide.md)
Podrobné informace o implementaci neonového designu pomocí Bootstrapu a CSS proměnných, včetně příkladů konkrétních komponent.

### [AI komponenty - implementační příručka](ai-components-guide.md)
Pokyny pro implementaci AI komponent, jejich osobností a interakcí s hráčem, včetně chatovacího systému a reakcí na herní události.

## Klíčové principy

1. **Používání Bootstrapu**
   - Preferujeme Bootstrap utility třídy nad vlastním CSS
   - Nahrazujeme inline styly a vlastní CSS Bootstrap třídami
   - Používáme Bootstrap komponenty jako základ pro vlastní UI

2. **Modularita**
   - Soubory maximálně 150 řádků (ideálně 50-100)
   - Jeden modul = jedna odpovědnost
   - Rozdělování velkých souborů na menší moduly

3. **Neonový design**
   - Konzistentní napříč aplikací
   - Implementovaný pomocí CSS proměnných
   - Rozšiřuje Bootstrap komponenty

4. **AI osobnosti**
   - Každá AI má jedinečné vlastnosti a chování
   - Modularizované do samostatných komponent
   - Reagují kontextově na herní události

## Proces refaktoringu

1. Identifikujte velké soubory a inline styly
2. Navrhněte modularizaci a použití Bootstrap tříd
3. Vytvořte samostatné komponenty s vlastními CSS a JS soubory
4. Zajistěte zachování neonového designu a konzistence
5. Testujte funkčnost a responzivitu

## Návrhy pro další vylepšení

- Implementace lazy-loading pro nekriticické komponenty
- Vytvoření vlastních Bootstrap komponent pro opakující se vzory
- Optimalizace výkonu animací a efektů
- Rozšíření AI osobností o více kontextových odpovědí
- Zlepšení přístupnosti UI

---

Tyto pokyny jsou aktualizovány při významných změnách projektu. Pro nejnovější verzi se vždy podívejte na tento adresář.

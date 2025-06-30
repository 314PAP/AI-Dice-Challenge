# 🤝 Přispívání do AI Kostkové Výzvy

Děkujeme za zájem o přispívání! Tento projekt je open source a rádi uvítáme vaši pomoc.

## 🚀 Jak začít

1. **Fork** repozitář
2. **Clone** váš fork lokálně
3. **Vytvořte branch** pro vaši změnu
4. **Implementujte** změnu
5. **Otestujte** funkcionalitu
6. **Commitněte** s popisnou zprávou
7. **Pushněte** do vašeho forku
8. **Vytvořte Pull Request**

## 🛠️ Development Setup

```bash
# Clone projektu
git clone https://github.com/VASE_UZIVATELSKE_JMENO/AI-Dice-Challenge.git
cd AI-Dice-Challenge

# Instalace závislostí
npm install

# Spuštění dev serveru
npm run dev

# Build pro produkci
npm run build
```

## 📋 Coding Guidelines

### JavaScript
- Používejte ES6+ syntax
- Preferujte `const` a `let` před `var`
- Používejte arrow functions kde je to vhodné
- Přidejte JSDoc komentáře pro složité funkce
- Žádné `console.log` v produkčním kódu

### CSS
- Používejte CSS custom properties (variables)
- Následujte BEM naming convention
- Responsive design je povinný
- Neon theme consistency

### Git Commits
Používáme [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: přidána nová AI personalita
fix: oprava bodování při Farkle
docs: aktualizace README
style: úprava neon efektů
refactor: reorganizace AI logiky
test: přidány testy pro dice logic
```

## 🎯 Prioritní oblasti

### 🔥 High Priority
- 🐛 Bug fixes
- 📱 Mobile optimalizace
- ♿ Accessibility improvements
- 🌐 Internacionalizace

### 🚀 Features
- 🤖 Nové AI personality
- 🎮 Herní módy
- 🏆 Achievement systém
- 🔊 Sound effects

### 📚 Dokumentace
- Code komentáře
- API dokumentace
- Návody pro uživatele

## 🧪 Testování

Před odesláním PR prosím otestujte:

- [ ] **Desktop browsers** (Chrome, Firefox, Safari, Edge)
- [ ] **Mobile browsers** (iOS Safari, Android Chrome)
- [ ] **Herní logika** (kostky, bodování, AI)
- [ ] **Chat systém** (zprávy, reakce)
- [ ] **Responsive design** (různé velikosti obrazovek)
- [ ] **Síň slávy** (ukládání/načítání)

## 🎨 Design Guidelines

### Barevná paleta
```css
--neon-green: #39ff14;
--neon-blue: #0099ff;
--neon-orange: #ff6600;
--neon-pink: #ff00ff;
--dark-bg: #0a0a0a;
```

### UI Komponenty
- Konzistentní neon borders
- Smooth hover animace
- Responsive grid layout
- Modal overlay systém

## 🤖 AI Systém

Při přidávání nových AI personalities:

1. **Definujte personality** v `aiPersonalities` objektu
2. **Přidejte responses** pro všechny game events
3. **Implementujte decision logic** 
4. **Testujte interactions** s ostatními AI
5. **Přidejte avatar** do `/public/ai-icons/`

### Příklad AI personality:
```javascript
newAI: {
    name: 'Nové AI',
    color: '#vlastni-barva',
    responses: {
        hello: ["Uvítací zpráva"],
        goodRoll: ["Reakce na dobrý hod"],
        badRoll: ["Reakce na špatný hod"],
        farkle: ["Reakce na farkle"],
        chat: ["Obecné chat odpovědi"]
    }
}
```

## 📝 Pull Request Process

1. **Aktualizujte README** pokud je potřeba
2. **Přidejte testy** pro novou funkcionalitu
3. **Zajistěte backward compatibility**
4. **Popište změny** v PR description
5. **Přidejte screenshots** pro UI změny

## 🚫 Co neděláme

- Breaking changes bez diskuze
- Kód bez testování
- Featury bez dokumentace
- Kopírování cizího kódu bez licence
- Komplexní frameworky (zůstáváme vanilla)

## 🆘 Pomoc a otázky

- 📝 **Issues** - pro bug reporty a feature requesty
- 💬 **Discussions** - pro obecné otázky
- 📧 **Email** - pipap@example.com pro soukromé dotazy

## 🏆 Contributors

Všichni přispěvatelé budou přidáni do Hall of Fame!

---

**Děkujeme za pomoc s vylepšováním AI Kostkové Výzvy!** 🎲✨

*Happy coding!* 💻❤️

# 🤖 SELF-MAINTAINING CSS SYSTEM

## 🎯 Jak funguje automatická kontrola

Tento systém zajišťuje, že Copilot **NIKDY** neporuší CSS pravidla bez manuálních připomínek.

### 📋 Automatické kontroly

#### 1. **Pre-commit validation**
```bash
./css-validation.sh
```
- ❌ Blokuje inline styly
- ❌ Blokuje vlastní CSS mimo povolené soubory  
- ⚠️ Varuje před nestandardními z-index
- ✅ Kontroluje odkazy na Bootstrap dokumentaci

#### 2. **CSS Checklist v main.css**
Před každou změnou:
- [ ] Zkontroloval jsem `dokumentybtrap/`?
- [ ] Nepoužívám inline styly?
- [ ] Používám naše CSS třídy?
- [ ] Animace jsou z knihoven?

#### 3. **Copilot Instructions**
- ✅ Bootstrap dokumentace vždy dostupná
- ✅ Kritická pravidla jasně definovaná
- ✅ Samokontrola checklist

### 🚨 Povolené akce

**CSS:**
- ✅ Bootstrap utility třídy z `dokumentybtrap/`
- ✅ Naše neon-* třídy z `colors-bootstrap-simple.css`
- ✅ CSS animace z existujících knihoven

**ZAKÁZANÉ:**
- ❌ `style="..."` inline styly
- ❌ Vlastní CSS mimo 3 povolené soubory
- ❌ Ruční CSS animace místo knihoven

### 🔄 Self-maintaining postup

1. **Copilot zkontroluje** `dokumentybtrap/[component].md`
2. **Použije Bootstrap** utility třídy
3. **Pokud Bootstrap nemá** → naše neon-* třídy  
4. **Spustí validaci** před commitem
5. **Opraví chyby** automaticky

### 📁 Struktura systému

```
.github/copilot-instructions.md  # Master pravidla
src/styles/main.css              # CSS checklist
css-validation.sh                # Automatická kontrola
dokumentybtrap/                  # Bootstrap reference
```

## 🎯 Záruka fungování

- ✅ **100% automatická kontrola** - žádné manuální připomínky
- ✅ **Self-validating** - Copilot si kontroluje sám sebe  
- ✅ **Bootstrap-first** - vždy preferuje dokumentaci
- ✅ **Error-blocking** - kritické chyby zastaví commit

**Výsledek:** Copilot dodržuje pravidla bez vašich neustálých připomínek!

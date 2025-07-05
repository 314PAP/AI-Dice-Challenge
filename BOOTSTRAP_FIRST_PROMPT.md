# 🚀 BOOTSTRAP-FIRST PŘÍSTUP - PROMPT PRO AI

## 📋 **ZÁKLADNÍ PRAVIDLA**

### ✅ **VŽDY PREFERUJ:**
1. **Bootstrap utility třídy** před vlastním CSS
2. **Sémantické HTML** s Bootstrap třídami
3. **Minimální vlastní CSS** - jen pro neonové efekty a specifické branding
4. **Žádné !important** pokud není nezbytně nutné

### ❌ **NIKDY NEDĚL:**
1. **Vlastní CSS** pro věci které Bootstrap už má
2. **Komplexní media queries** - použij Bootstrap breakpointy
3. **Inline styly** v HTML
4. **Bojování s Bootstrapem** pomocí !important

---

## 🎯 **BOOTSTRAP UTILITY TŘÍDY - CHEAT SHEET**

### **📐 Layout & Spacing:**
- `d-flex, flex-column, align-items-center` - flexbox layout
- `w-auto, mw-100, w-25, w-50, w-75, w-100` - šířky
- `px-1 až px-5, py-1 až py-5` - padding
- `mx-auto, text-center` - centrování
- `gap-1 až gap-5` - mezery mezi prvky

### **📱 Responzivní variace:**
- `px-2 px-md-4` - padding mobil/desktop
- `fs-6 fs-md-5` - font size mobil/desktop
- `d-none d-md-block` - skrytí/zobrazení dle zařízení
- `col-12 col-md-6` - grid systém

### **📝 Typography:**
- `fs-1 až fs-6` - font velikosti
- `fw-bold, fw-normal` - font weight
- `text-nowrap` - text na jednom řádku
- `text-truncate` - ořezání textu s ...

### **🎨 Vzhled:**
- `btn, btn-outline-*` - tlačítka
- `border, border-0` - rámečky
- `rounded, rounded-pill` - zaoblené rohy

---

## 🛠️ **PRAKTICKÉ PŘÍKLADY**

### **Responzivní tlačítko:**
```html
<button class="btn btn-primary 
              w-auto mw-100           <!-- šířka podle obsahu -->
              px-3 py-2 px-md-4 py-md-3  <!-- responzivní padding -->
              fs-6 fs-md-5            <!-- responzivní font -->
              text-nowrap">           <!-- text na jednom řádku -->
  <i class="icon me-2"></i>
  Text tlačítka
</button>
```

### **Responzivní input:**
```html
<input class="form-control 
             w-auto mx-auto         <!-- šířka podle obsahu, centrované -->
             text-center            <!-- centrovaný text -->
             fs-6 fs-md-5"          <!-- responzivní font -->
       style="min-width: 120px; max-width: 200px;">
```

### **Responzivní layout:**
```html
<div class="d-flex flex-column flex-md-row  <!-- mobilní stack, desktop row -->
           align-items-center              <!-- centrované -->
           gap-2 gap-md-4">               <!-- responzivní mezery -->
  <!-- obsah -->
</div>
```

---

## 🎮 **SPECIFICKY PRO NAŠI HERU**

### **CSS - pouze neonové efekty:**
```css
.neon-btn {
  border: 2px solid currentColor;
  background: transparent;
  transition: all 0.3s ease;
  /* Bootstrap utility třídy řeší zbytek */
}

.neon-btn:hover {
  box-shadow: 0 0 15px currentColor;
  background: rgba(255,255,255,0.1);
}
```

### **HTML - Bootstrap třídy:**
```html
<button class="btn neon-btn neon-green 
              w-auto px-3 py-2 
              fs-6 text-nowrap">
  Content
</button>
```

---

## 🔧 **DEBUGGING CHECKLIST**

### **Pokud něco nefunguje:**
1. ✅ **Zkontroluj HTML** - používáš Bootstrap třídy?
2. ✅ **Zkontroluj CSS** - bojuješ s Bootstrapem?
3. ✅ **Zkontroluj !important** - lze to udělat jinak?
4. ✅ **Zkontroluj breakpointy** - používáš Bootstrap responsivity?

### **Bootstrap breakpointy:**
- `xs` - < 576px (default, bez sufixu)
- `sm` - ≥ 576px
- `md` - ≥ 768px  
- `lg` - ≥ 992px
- `xl` - ≥ 1200px
- `xxl` - ≥ 1400px

---

## 💡 **MOTTO:**

> **"Pokud to Bootstrap umí, nepiš vlastní CSS!"**

**Bootstrap je jako švýcarský armádní nůž - má nástroj na všechno. Náš úkol je použít správný nástroj, ne vymýšlet nový.**

---

*Vytvořeno: 5. leden 2025*  
*Pro projekt: AI Kostková Výzva*

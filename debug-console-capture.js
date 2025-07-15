const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Zachytíme console logy
  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    console.log(`[${type.toUpperCase()}] ${text}`);
  });
  
  // Zachytíme chyby
  page.on('pageerror', (err) => {
    console.log('[PAGE_ERROR]', err.message);
  });
  
  try {
    await page.goto('http://localhost:8000/debug-ui-buttons.html');
    
    // Počkáme na načtení
    await page.waitForTimeout(3000);
    
    // Spustíme debug test
    await page.evaluate(() => {
      if (typeof startDebugTest === 'function') {
        startDebugTest();
      }
    });
    
    // Počkáme na dokončení
    await page.waitForTimeout(5000);
    
    // Zkontrolujeme tlačítka
    await page.evaluate(() => {
      if (typeof checkButtons === 'function') {
        checkButtons();
      }
    });
    
    await page.waitForTimeout(2000);
    
  } catch (err) {
    console.log('[ERROR]', err.message);
  }
  
  await browser.close();
})();

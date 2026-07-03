const express = require('express');
const { chromium } = require('playwright');

const app = express();
app.use(express.json());

app.post('/create-product', async (req, res) => {
  const { email, password } = req.body;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://printify.com/app/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const emailSelectors = ['#username', 'input[name="username"]', 'input[type="email"]', 'input[name="email"]'];
    let filled = false;
    for (const sel of emailSelectors) {
      const el = await page.$(sel);
      if (el) {
        await el.fill(email);
        filled = true;
        break;
      }
    }

    if (!filled) {
      const screenshot = await page.screenshot({ encoding: 'base64' });
      await browser.close();
      return res.status(500).json({ error: 'No se encontró campo de email', screenshot });
    }

    const passwordSelectors = ['input[type="password"]', 'input[name="password"]', '#password'];
    for (const sel of passwordSelectors) {
      const el = await page.$(sel);
      if (el) {
        await el.fill(password);
        break;
      }
    }

    await page.waitForTimeout(1000);
    const screenshot = await page.screenshot({ encoding: 'base64' });
    await browser.close();

    res.json({ status: 'login_form_filled', screenshot });
  } catch (err) {
    const screenshot = await page.screenshot({ encoding: 'base64' }).catch(() => null);
    await browser.close();
    res.status(500).json({ error: err.message, screenshot });
  }
});

app.get('/', (req, res) => res.send('Printify automation server activo'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

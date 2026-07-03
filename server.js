const express = require('express');
const { chromium } = require('playwright');

const app = express();
app.use(express.json());

app.post('/create-product', async (req, res) => {
  const { email, password, title, description, tags, imageUrl } = req.body;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://printify.com/app/login');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);

    res.json({ status: 'login_attempted', message: 'Revisa el screenshot para confirmar login' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await browser.close();
  }
});

app.get('/', (req, res) => res.send('Printify automation server activo'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

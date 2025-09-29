import { test } from '@playwright/test';
import credentials from '../data/credentials.json' assert { type: 'json' };
import plateDenialData from '../data/generalSettingsPlateDenial.json' assert { type: 'json' };
import { LoginPage } from '../pages/loginPage.js';
import { GeneralSettingsPage } from '../pages/generalSettingsPage.js';
import { PlateDenialPage } from '../pages/generalSettingsPlateDenialPage.js';

test.use({ headless: false, browserName: 'chromium', timeout: 120000 });

test('UI_GeneralSettingsPlateDenail_Test [@smoke] Configure Plate Denial Settings', async ({ page }) => {
  // Step 1: Login
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await page.waitForTimeout(2000);

  await loginPage.login(credentials.username, credentials.password);
  await page.waitForTimeout(2000);

  // Step 2: Navigate to Plate Denial via General Settings
  const generalSettingsPage = new GeneralSettingsPage(page);
  await generalSettingsPage.openGeneralSettings();
  await page.waitForTimeout(2000);

  await generalSettingsPage.openPlateDenial();
  await page.waitForTimeout(2000);

  // Step 3: Configure Plate Denial
  console.log('🔑 Configuring Plate Denial with the following values:');
  for (const [key, value] of Object.entries(plateDenialData)) {
    console.log(`   ${key}: ${value}`);
  }

  const plateDenialPage = new PlateDenialPage(page);
  await plateDenialPage.configurePlateDenial(plateDenialData);
  await page.waitForTimeout(3000);

  console.log('✅ Plate Denial settings configured successfully.');
});

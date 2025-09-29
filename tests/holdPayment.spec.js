import { test } from '@playwright/test';
import credentials from '../data/credentials.json' assert { type: 'json' };
import { LoginPage } from '../pages/loginPage.js';
import { GeneralSettingsPage } from '../pages/generalSettingsPage.js';
import { HoldPaymentPage } from '../pages/generalSettingsHoldPaymentPage.js';

test.use({ headless: false, browserName: 'chromium', timeout: 120000 });

test('UI_GeneralSettingsHoldPayment_Test [@smoke] Configure Hold Payment Settings', async ({ page }) => {
  // Step 1: Login
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await page.waitForTimeout(2000);

  await loginPage.login(credentials.username, credentials.password);
  await page.waitForTimeout(2000);

  // Step 2: Navigate to Hold Payment via General Settings
  const generalSettingsPage = new GeneralSettingsPage(page);
  await generalSettingsPage.openGeneralSettings();
  await page.waitForTimeout(2000);

  await generalSettingsPage.openHoldPayment();
  await page.waitForTimeout(2000);

  // Step 3: Configure Hold Payment
  const holdPaymentPage = new HoldPaymentPage(page);
  await holdPaymentPage.configureHoldPayment('RegularNFDD');
  await page.waitForTimeout(2000);

  console.log('Hold Payment Settings configured and test completed.');
});

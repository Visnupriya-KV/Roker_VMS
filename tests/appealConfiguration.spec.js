import { test } from '@playwright/test';
import credentials from '../data/credentials.json' assert { type: 'json' };
import appealData from '../data/appealConfiguration.json' assert { type: 'json' };
import { LoginPage } from '../pages/loginPage.js';
import { GeneralSettingsPage } from '../pages/generalSettingsPage.js';
import { AppealConfigurationPage } from '../pages/appealConfigurationPage.js';

test.use({ headless: false, browserName: 'chromium', timeout: 180000 });

test('UI_GeneralSettingsAppealConfiguration_Test [@smoke] Configure Appeal Settings', async ({ page }) => {
  // Step 1: Login
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(credentials.username, credentials.password);
  await page.waitForTimeout(1000); // visual pause

  // Step 2: Navigate to Appeal Configuration via General Settings
  const generalSettings = new GeneralSettingsPage(page);
  await generalSettings.openGeneralSettings();
  await page.waitForTimeout(1000);
  await generalSettings.openAppealConfiguration();
  await page.waitForTimeout(1000);

  // Step 3: Configure Appeal Settings
  const appealPage = new AppealConfigurationPage(page);

  console.log('Opening Appeal Configuration...');
  await appealPage.configureAppeal(appealData);

  console.log('Appeal Configuration completed.');
});

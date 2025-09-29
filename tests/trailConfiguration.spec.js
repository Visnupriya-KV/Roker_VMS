import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.js';
import { GeneralSettingsPage } from '../pages/generalSettingsPage.js';
import { TrialConfigurationPage } from '../pages/trialConfigurationPage.js';
import trialData from '../data/trialConfiguration.json' assert { type: 'json' };
import credentials from '../data/credentials.json' assert { type: 'json' };

test.use({ headless: false, browserName: 'chromium', timeout: 180000 });

test('UI_GeneralSettingTrialConfiguration_Test [@smoke] Configure Trial Settings', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const generalSettings = new GeneralSettingsPage(page);
  const trialConfigPage = new TrialConfigurationPage(page);

  // Step 1: Login
  await loginPage.goto();
  await loginPage.login(credentials.username, credentials.password);

  // Step 2: Navigate to General Settings → Trial Configuration
  await generalSettings.openGeneralSettings();
  await generalSettings.openTrialConfiguration(); // navigate to Trial Configuration
await trialConfigPage.configureTrial(trialData);
await trialConfigPage.saveTrialConfig();
    console.log('Trial Configuration completed.');


});

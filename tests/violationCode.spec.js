import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.js';
import { SettingsPage } from '../pages/settingsPage.js';
import { ViolationCodePage } from '../pages/violationCodePage.js';
import violationConfig from '../data/violationCode.json' assert { type: 'json' };
import { generateUniqueName } from '../utils/dataGenerator.js';
import credentials from '../data/credentials.json' assert { type: 'json' };


test.use({ headless: false, browserName: 'chromium', timeout: 120000 });

test('UI_ViolationCode_Test [@smoke] Add a new Violation Code', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const settingsPage = new SettingsPage(page);
  const violationPage = new ViolationCodePage(page);

  // Step 1: Login
  await loginPage.goto();
  await loginPage.login(credentials.username, credentials.password);

  // Step 2: Navigate to Settings → Violation Codes
  await settingsPage.openSettings();
  await page.getByRole('link', { name: 'Violation Code(s)' }).click();

  // Step 3: Generate unique violation code
  const uniqueViolation = {
    ...violationConfig,
    code: generateUniqueName(violationConfig.code), // make it unique
    description: generateUniqueName(violationConfig.description)
  };

  console.log("Creating Violation Code:", uniqueViolation);
  console.log("Adding Violation Code", uniqueViolation.code);

  // Step 4: Add Violation Code
  await violationPage.addViolationCode(uniqueViolation);
});

import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.js';
import { CompanyDetailsPage } from '../pages/companyDetailsPage.js';
import credentials from '../data/credentials.json' assert { type: 'json' };

test.use({ headless: false, browserName: 'chromium', timeout: 180000 });

test('UI_GeneralSettingsCompanyDetails_Test [@smoke] Configure Company Details', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const companyPage = new CompanyDetailsPage(page);

  // Step 1: Login
  await loginPage.goto();
  await loginPage.login(credentials.username, credentials.password);

  // Step 2: Open Company Details
  await companyPage.openCompanyDetails();

  // Step 3: Configure Company Details with JSON / predefined value
  const defaultState = 'AB'; // You can also load from JSON if needed
  await companyPage.configureCompanyDetails(defaultState);

  console.log('Company Details test completed successfully.');
});

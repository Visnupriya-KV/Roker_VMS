import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.js';
import { FeeStructurePage } from '../pages/feeStructurePage.js';
import credentials from '../data/credentials.json' assert { type: 'json' };
import feeData from '../data/feeStructure.json' assert { type: 'json' };
import { generateUniqueFeeName } from '../utils/dataGenerator.js';

test.use({ headless: false, browserName: 'chromium', timeout: 120000 });

test.describe('Fee Structure Management', () => {
  test('UI_FeeStructure_Add_Test [@smoke]', async ({ page }) => {
    // Step 1: Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.username, credentials.password);

    // Step 2: Generate random fee data
    const randomFeeData = {
      ...feeData,
      feeName: generateUniqueFeeName(feeData.feeName)
    };
    console.log("Creating Fee Structure:", randomFeeData);

    // Step 3: Add Fee Structure
    const feeStructurePage = new FeeStructurePage(page);
    await feeStructurePage.navigateToFeeStructures();
    await feeStructurePage.addFeeStructure(randomFeeData);
    console.log('Fee Structure added successfully:', randomFeeData.feeName);

  });
});

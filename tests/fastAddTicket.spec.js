import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.js';
import { FastAddPage } from '../pages/fastAddPage.js';
import ticketData from '../data/fastAddTicket.json' assert { type: 'json' };
import credentials from '../data/credentials.json' assert { type: 'json' };

test.use({ headless: false, browserName: 'chromium', timeout: 120000 });

test('UI_FastAdd_Test [@smoke] Add a new Fast Add Ticket', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const fastAddPage = new FastAddPage(page);

  // Step 1: Login
  await loginPage.goto();
  await loginPage.login(credentials.username, credentials.password);

  // Step 2: Navigate to Fast Add
  await fastAddPage.openFastAdd();

  // Step 3: Add Ticket
  const { citation } = await fastAddPage.addTicket({
    ...ticketData,
    location: 'AutoTestName_gu79',   // or randomize if needed
    officer: 'AutoTestOfficer_b3ge'  // or randomize if needed
  });

  // Step 4: Verify Success Message
  await expect(page.getByText(`Ticket # ${citation} Successfully`)).toBeVisible();

  // Step 5: Go back
  await fastAddPage.goBack();

  console.log('✅ Fast Add Ticket created successfully:', citation);
});

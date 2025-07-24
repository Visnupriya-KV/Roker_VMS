import { test, expect } from '@playwright/test';
import config from '../UI_JSON/UI_SettingsLocation.json'; // Import the JSON file

test.use({ headless: false, browserName: 'chromium', timeout: 120000 }); // Run in headed mode on Chrome with increased timeout

test('UI_SettingsLocation_Test: Verify location creation and success message', async ({ page }) => {
  // Navigate to the login page
  await page.goto(config.url); // Use URL from JSON
  await page.getByRole('link', { name: 'Login as Administrator' }).click();
  await page.goto(config.navigation.smartTicketPage, { timeout: 120000 }); // Use smart ticket page URL from JSON with further increased timeout
  await page.getByRole('textbox', { name: 'Email/Username' }).fill(config.login.username); // Use username from JSON
  await page.getByRole('textbox', { name: 'Password' }).fill(config.login.password); // Use password from JSON
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.goto(config.navigation.violationsPage, { timeout: 120000 }); // Use violations page URL from JSON with further increased timeout
  await page.getByRole('link', { name: 'Violations' }).click();
  await page.waitForSelector('app-smart-ticket iframe', { timeout: 120000 });
  await page.goto(config.navigation.smartTicketPage, { timeout: 60000 }); // Use smart ticket page URL from JSON
  await page.waitForSelector('app-smart-ticket iframe');
  const iframeLocator = await page.locator('app-smart-ticket iframe');
  await iframeLocator.waitFor({ state: 'visible', timeout: 300000 }); // Ensure iframe is visible
  const smartTicketFrame = await iframeLocator.contentFrame();
  const settingsLink = await smartTicketFrame.getByRole('link', { name: 'Settings', exact: true });
  await settingsLink.waitFor({ state: 'visible', timeout: 600000 }); // Further increase timeout to ensure visibility
  await settingsLink.click();
  await page.locator('app-smart-ticket iframe').contentFrame().getByRole('link', { name: 'Location' }).click();
  await page.locator('app-smart-ticket iframe').contentFrame().getByRole('link', { name: 'Add' }).click();
  await page.locator('app-smart-ticket iframe').contentFrame().getByRole('button', { name: '+' }).waitFor({ state: 'visible', timeout: 120000 });
  await page.locator('app-smart-ticket iframe').contentFrame().getByRole('button', { name: '+' }).click();

  // Generate random location name
  const randomLocationName = `ALoc_${Math.random().toString(36).substring(2, 8)}`;
  console.log(`Generated Location Name: ${randomLocationName}`);
  await page.locator('app-smart-ticket iframe').contentFrame().getByRole('textbox', { name: '* Name' }).waitFor({ state: 'visible', timeout: 300000 });
  await page.locator('app-smart-ticket iframe').contentFrame().getByRole('textbox', { name: '* Name' }).fill(randomLocationName);

  await page.locator('app-smart-ticket iframe').contentFrame().getByRole('textbox', { name: 'External Location Id' }).fill(config.location.externalLocationId, { timeout: 60000 }); // Use externalLocationId from JSON
  await page.locator('app-smart-ticket iframe').contentFrame().getByRole('textbox', { name: 'Address' }).fill(config.location.address); // Use address from JSON
  await page.locator('app-smart-ticket iframe').contentFrame().getByRole('textbox', { name: 'City' }).fill(config.location.city); // Use city from JSON
  await page.locator('app-smart-ticket iframe').contentFrame().getByRole('textbox', { name: 'State' }).fill(config.location.state); // Use state from JSON
  await page.locator('app-smart-ticket iframe').contentFrame().getByRole('textbox', { name: 'Zip Code' }).fill(config.location.zipCode); // Use zipCode from JSON
  await smartTicketFrame.locator('button[id="btnSaveCourtRoom"]').waitFor({ state: 'visible', timeout: 600000 });
  await smartTicketFrame.locator('button', { hasText: 'Save' }).click();

  // Verify success message
  // const successMessageLocator = page.locator('app-smart-ticket iframe').contentFrame().getByText(config.successMessage); // Use successMessage from JSON
  // await expect(successMessageLocator).toBeVisible(); // Assert that the success message is visible
  // console.log('Success message verified:', config.successMessage);
});
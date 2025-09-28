import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.js';
import { SettingsPage } from '../pages/settingsPage.js';
import { CourtCalendarPage } from '../pages/courtCalendarPage.js';
import courtCalendarData from '../data/courtCalendar.json' assert { type: 'json' };
import { generateRandomNumber, selectRandomOption } from '../utils/dataGenerator.js';
import credentials from '../data/credentials.json' assert { type: 'json' };


test.use({ headless: false, browserName: 'chromium', timeout: 120000 });

test('UI_CourtCalendar_Test [@smoke] Add a new Court Calendar record', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const settingsPage = new SettingsPage(page);
  const courtCalendarPage = new CourtCalendarPage(page);

  // Step 1: Login
  await loginPage.goto();
  await loginPage.login(credentials.username, credentials.password);

  // Step 2: Navigate to Settings → Court Calendar
  await settingsPage.openSettings();
  await page.getByRole('link', { name: 'Court Calendar' }).click();

  // Step 3: Prepare unique random data
  const uniqueCourtCalendar = {
  ...courtCalendarData,
  total: generateRandomNumber(30, 100).toString(),
  available: generateRandomNumber(1, 20).toString()
};

    // Step 4: Add Court Calendar with random court selection
  const selectedCourtText = await courtCalendarPage.addCourtCalendar(uniqueCourtCalendar);

  // Step 5: Log the details
  console.log('Court Calendar added successfully with Total:', uniqueCourtCalendar.total, 'and Available:', uniqueCourtCalendar.available);
});

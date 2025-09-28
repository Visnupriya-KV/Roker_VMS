import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.js';
import { SettingsPage } from '../pages/settingsPage.js';
import { CourtRoomPage } from '../pages/courtRoomPage.js';
import courtroom from '../data/courtroom.json' assert { type: 'json' };
import { generateUniqueName, generateRandomLocation } from '../utils/dataGenerator.js';
import credentials from '../data/credentials.json' assert { type: 'json' };


test.use({ headless: false, browserName: 'chromium', timeout: 120000 });

test('UI_CourtRoom_Test [@smoke] Add a new Court Room', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const settingsPage = new SettingsPage(page);
  const courtRoomPage = new CourtRoomPage(page);

  // Step 1: Login
  await loginPage.goto();
  await loginPage.login(credentials.username, credentials.password);

  // Step 2: Navigate to Settings → Court Room
  await settingsPage.openSettings();
  await page.getByRole('link', { name: 'Court Room' }).click();

  // Step 3: Generate unique Court Room data
  const uniqueCourtRoom = {
    ...courtroom,
    name: generateUniqueName(courtroom.name),
    location: generateRandomLocation()
  };

  console.log("Creating Court Room:", uniqueCourtRoom);

  const notificationText = await courtRoomPage.addCourtRoom(uniqueCourtRoom);

  // Step 4: Assertion
  expect(notificationText).toContain('Court Room saved successfully.');
  console.log('Court Room added successfully:', uniqueCourtRoom.name);
});

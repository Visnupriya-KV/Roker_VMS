import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.js';
import { SettingsPage } from '../pages/settingsPage.js';
import { CourtRoomPage } from '../pages/courtRoomPage.js';
import courtRoomData from '../data/addCourt.json' assert { type: 'json' };
import { generateRandomString,generateRandomLocation } from '../utils/dataGenerator.js';
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

  // Step 3: Prepare unique random data
  const uniqueCourtRoom = {
    ...courtRoomData,
    name: `${courtRoomData.name}_${generateRandomString(4)}`,
    location: generateRandomLocation()
  };

  // Step 4: Add Court Room
  await courtRoomPage.addCourtRoom(uniqueCourtRoom);

  console.log('Court Room added successfully with Name:', uniqueCourtRoom.name, 'at Location:', uniqueCourtRoom.location);
});

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.js';
import { SettingsPage } from '../pages/settingsPage.js';
import { LocationPage } from '../pages/locationPage.js';
import locationData from '../data/location.json' assert { type: 'json' };

// Import utility functions
import { generateUniqueLocationName, generateRandomAddress } from '../utils/dataGenerator.js';

test.use({ headless: false, browserName: 'chromium', timeout: 120000 });

test.describe('Location Management', () => {

  test('UI_SettingsLocation_Test [@smoke] Add a new location', async ({ page }) => {

    // Generate dynamic unique data
    const uniqueLocation = {
      name: generateUniqueLocationName(),
      address: generateRandomAddress(),
      ...locationData
    };

    console.log('Creating location:', uniqueLocation);

    // Step 1: Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('administrator', 'DemoUser@1');

    // Step 2: Navigate to Settings → Location
    const settingsPage = new SettingsPage(page);
    await settingsPage.openSettings();
    await settingsPage.openLocation();

    // Step 3: Add Location
    const locationPage = new LocationPage(page);
    await locationPage.addLocation(uniqueLocation);


    // Step 4: Assertion
    await expect(page.getByText(uniqueLocation.name)).toBeVisible();
    console.log('Location added successfully:', uniqueLocation.name);
  });

});

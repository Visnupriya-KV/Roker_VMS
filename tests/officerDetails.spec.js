import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.js';
import { SettingsPage } from '../pages/settingsPage.js';
import { OfficerPage } from '../pages/officerPage.js';
import officer from '../data/officer.json' assert { type: 'json' };
import { generateUniqueName } from '../utils/dataGenerator.js';
import credentials from '../data/credentials.json' assert { type: 'json' };


test.use({ headless: false, browserName: 'chromium', timeout: 120000 });

test('UI_OfficerDetails_Test [@smoke] Add a new officer', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const settingsPage = new SettingsPage(page);
  const officerPage = new OfficerPage(page);

  await loginPage.goto();
  await loginPage.login(credentials.username, credentials.password);

  // navigate to Settings -> Officer
  await settingsPage.gotoOfficer(); // <-- method now exists

  const uniqueOfficer = {
    ...officer,
    firstName: generateUniqueName(officer.firstName),
    lastName: generateUniqueName(officer.lastName)
  };
  console.log("Created Officer Details", uniqueOfficer);
  console.log("Adding Officer Details");
  await officerPage.addOfficer(uniqueOfficer);

  console.log('Officer added successfully:', uniqueOfficer.firstName, uniqueOfficer.lastName);

});

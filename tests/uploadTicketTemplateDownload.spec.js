import { test } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import credentials from '../data/credentials.json' assert { type: 'json' };
import { LoginPage } from '../pages/loginPage.js';
import { UploadTicketsPage } from '../pages/uploadTicketsTemplateDownloadPage.js';

test.use({ headless: false, browserName: 'chromium', timeout: 120000 });

test('UI_UploadTicketsTemDownload_Test [@smoke] Download and Export Upload Tickets Template', async ({ page }) => {
  // Step 1: Login
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(credentials.username, credentials.password);

  // Step 2: Open Upload Tickets
  const uploadTicketsPage = new UploadTicketsPage(page);
  await uploadTicketsPage.openUploadTickets();

  // Step 3: Wait for download
  const [download] = await Promise.all([
    page.waitForEvent('download'),               // wait for the download event
    uploadTicketsPage.downloadTemplate(),        // trigger download
  ]);

  // Step 4: Save inside exportedTemplates folder
  const exportDir = path.resolve('./exportedTemplates'); // ensure folder path
  if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir, { recursive: true });

  const filename = download.suggestedFilename();           // ✅ method
  const savePath = path.join(exportDir, filename);         // folder + filename

  await download.saveAs(savePath);                         // save the file
  console.log('Template downloaded and saved at:', savePath);
  console.log('✅ Upload Tickets Template downloaded successfully:', filename);

  // Step 5: Verify file exists
  if (fs.existsSync(savePath)) {
    console.log('File exists:', savePath);
  } else {
    throw new Error('File not found after download: ' + savePath);
  }

  // Clean up - delete the file after verification
  // fs.unlinkSync(savePath);
  // console.log('Cleaned up downloaded file:', savePath);
});

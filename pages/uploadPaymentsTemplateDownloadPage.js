// File: pages/uploadPaymentsTemplateDownloadPage.js
import path from 'path';  
export class UploadPaymentsPage {
  constructor(page) {
    this.page = page;
    this.trackLink = page.getByRole('link', { name: 'Track' });
    this.uploadPaymentsLink = page.getByRole('link', { name: 'Upload Payments' });
    this.downloadTemplateButton = page.getByRole('button', { name: 'Download Template' });
  }

  // Navigate to Upload Payments page
  async openUploadPayments() {
      await this.trackLink.click();
      await this.page.waitForLoadState('networkidle');
      await this.uploadPaymentsLink.click();
      await this.page.waitForLoadState('domcontentloaded');
    }
  
    async downloadTemplate(saveDir = './downloads') {
      const downloadPromise = this.page.waitForEvent('download');
      await this.downloadTemplateButton.click();
  
      const download = await downloadPromise;
  
      // Construct path to save file
      const filePath = path.join(saveDir, download.suggestedFilename());
  
      // Save the file
      await download.saveAs(filePath);
  
      console.log('Template downloaded and saved at:', filePath);
      return filePath;
    }
  }
  

import { expect } from '@playwright/test';

export class HoldPaymentPage {
  constructor(page) {
    this.page = page;
    this.stageDropdown = page.locator('#MainContent_ctl01_drpStages');
    this.saveButton = page.locator('#MainContent_ctl01_btnSaveHoldPayment');
    this.successMessage = page.locator('#MainContent_ctl01_pnlSuccessMessage');
  }

  async configureHoldPayment(stageName) {
    console.log(`Configuring Hold Payment with stage: ${stageName}`);

    // Wait for dropdown to be visible and enabled
    await this.stageDropdown.waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForTimeout(1000); // small visual pause

    await this.stageDropdown.selectOption(stageName);
    console.log(`Stage selected: ${stageName}`);
    await this.page.waitForTimeout(1000);

    await this.saveButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(1000);

    await this.saveButton.click();
    console.log('Save button clicked');
    await this.page.waitForTimeout(2000);

    await expect(this.successMessage).toBeVisible({ timeout: 10000 });
    console.log('Hold Payment configured successfully.');
  }
}

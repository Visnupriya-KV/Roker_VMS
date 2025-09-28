// pages/feeStructurePage.js
import { expect } from '@playwright/test';

export class FeeStructurePage {
  constructor(page) {
    this.page = page;
    this.settingsLink = page.getByRole('link', { name: 'Settings' });
    this.feeStructuresLink = page.getByRole('link', { name: 'Fee Structures' });
    this.addLink = page.getByRole('link', { name: 'Add' });
    this.feeNameInput = page.locator('#MainContent_ctl00_txtFeeName');
    this.feeDaysInput = page.locator('#txtFeeDays');
    this.feeAmountInput = page.locator('#txtFees');
    this.addFeeButton = page.getByRole('button', { name: 'Add Fee' });
    this.successNotification = page.locator('.jGrowl-message'); // adjust if different
  }

  async navigateToFeeStructures() {
    await this.settingsLink.click();
    await this.feeStructuresLink.click();
    await this.addLink.click();
  }

  async addFeeStructure(data) {
    await this.feeNameInput.fill(data.feeName);
    await this.feeDaysInput.fill(data.days);
    await this.feeAmountInput.fill(data.amount);
    await this.addFeeButton.click();
  }


}

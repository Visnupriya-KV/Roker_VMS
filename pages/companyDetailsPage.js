import { expect } from '@playwright/test';

export class CompanyDetailsPage {
  constructor(page) {
    this.page = page;
    this.defaultStateDropdown = page.locator('#MainContent_GeneralConfig_drpDefaultState');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.successMessage = page.locator('#MainContent_GeneralConfig_pnlSuccessMessage');
    this.savedText = page.getByText('General Configurations Saved');
  }

  async openCompanyDetails() {
    console.log('Opening Company Details...');
    await this.page.getByRole('link', { name: 'Settings' }).click();
    await this.page.waitForTimeout(1000);
    await this.page.getByRole('link', { name: 'General Settings' }).click();
    await this.page.waitForTimeout(1000);
    await this.page.getByRole('button', { name: 'Company Details' }).click();
    await this.page.waitForTimeout(1000);

    await expect(this.defaultStateDropdown).toBeVisible();
    console.log('Company Details page loaded successfully.');
  }

  async configureCompanyDetails(defaultState) {
    console.log(`Selecting Default State: ${defaultState}`);
    await this.defaultStateDropdown.selectOption(defaultState);
    await this.page.waitForTimeout(500);

    const selectedValue = await this.defaultStateDropdown.inputValue();
    expect(selectedValue).toBe(defaultState);
    console.log(`Default State selected: ${selectedValue}`);

    console.log('Resetting Default State');
    await this.defaultStateDropdown.selectOption('');
    await this.page.waitForTimeout(500);

    console.log('Clicking Save');
    await this.saveButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await this.saveButton.click();
    await this.page.waitForTimeout(1000);

    await expect(this.successMessage).toBeVisible();
    await expect(this.savedText).toBeVisible();
    console.log('Company Details configured successfully.');
  }
}

import { expect } from '@playwright/test';

export class OfficerPage {
  constructor(page) {
    this.page = page;
    this.addButton = page.getByRole('link', { name: 'Add' });
    this.firstNameInput = page.locator('#MainContent_ctl00_txtFirstName');
    this.lastNameInput = page.locator('#MainContent_ctl00_txtLastName');
    this.badgeIdInput = page.locator('#MainContent_ctl00_txtBadgeID');
    this.agencyInput = page.locator('#MainContent_ctl00_txtAgency');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.successNotification = page.locator('.alert-success'); // update if locator differs
  }

  async addOfficer(data) {
    await this.addButton.click();
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.badgeIdInput.fill(data.badgeId);
    await this.agencyInput.fill(data.agency);

    await this.saveButton.click();

    
  }
}

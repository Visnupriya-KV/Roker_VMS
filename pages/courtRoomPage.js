import { expect } from '@playwright/test';

export class CourtRoomPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.addButton = page.getByRole('link', { name: 'Add' });
    this.nameInput = page.locator('#MainContent_ctl00_txtName');
    this.locationInput = page.locator('#MainContent_ctl00_txtLocation');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.successNotification = page.locator('#MainContent_ctl00_dvSuccess');
  }

  async addCourtRoom(data) {
    await this.addButton.click();
    await this.nameInput.fill(data.name);
    await this.locationInput.fill(data.location);
    await this.saveButton.click();

    // Validate success message
    await expect(this.successNotification).toHaveText(
      'Court Room saved successfully.',
      { timeout: 10000 }
    );

    return this.successNotification.textContent();
  }
}

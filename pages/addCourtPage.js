import { expect } from '@playwright/test';

export class CourtRoomPage {
  constructor(page) {
    this.page = page;
    this.addButton = page.getByRole('button', { name: '+' });
    this.nameInput = page.getByRole('textbox', { name: '* Court Room Name' });
    this.locationInput = page.getByRole('textbox', { name: '* Location' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.successNotification = page.locator('#MainContent_ctl00_dvSuccess');
  }

  async addCourtRoom(data) {
    await this.addButton.click();
    await this.nameInput.fill(data.name);
    await this.locationInput.fill(data.location);
    await this.saveButton.click();

    // Validate success
    const messageText = (await this.successNotification.textContent()).trim().replace(/\s+/g, ' ');
    expect(messageText).toContain('Court Room saved successfully.');
  }
}

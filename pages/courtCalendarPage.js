import { expect } from '@playwright/test';
import { selectRandomOption } from '../utils/dataGenerator.js';

export class CourtCalendarPage {
  constructor(page) {
    this.page = page;
    this.addButton = page.getByRole('link', { name: 'Add' });
    this.courtDropdown = page.locator('#ddlCourt');
    this.courtDate = page.getByRole('textbox', { name: 'Court Date' });
    this.today = page.getByText('Today:');
    this.totalField = page.getByRole('textbox', { name: 'Total' });
    this.availableField = page.getByRole('textbox', { name: 'Available' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.successMessage = page.locator('#MainContent_ctl00_pnlSuccessMessage');
    this.clearButton = page.getByRole('button', { name: 'Clear' });
  }

  async addCourtCalendar(data) {
    await this.addButton.click();

    // Select a random court
  const selectedCourt = await selectRandomOption(this.courtDropdown);
 console.log('Selected Court:', selectedCourt);



    await this.courtDate.click();
    await this.today.click();
    await this.totalField.fill(data.total);
    await this.availableField.fill(data.available);
    await this.submitButton.click();

    await expect(this.successMessage).toContainText('Added record in court calendar successfully.', { timeout: 10000 });
    await this.clearButton.click();
  }
}

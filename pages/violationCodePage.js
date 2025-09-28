import { expect } from '@playwright/test';

export class ViolationCodePage {
  constructor(page) {
    this.page = page;
    this.addButton = page.getByRole('link', { name: 'Add' });
    this.codeField = page.locator('#MainContent_ctl00_txtCode');
    this.startDate = page.locator('#txtStartDate');
    this.todayStart = page.getByText('Today:');
    this.endDate = page.locator('#txtEndDate');
    this.todayEnd = page.locator('#CalendarExtender3_today');
    this.descriptionField = page.locator('#MainContent_ctl00_txtDec');
    this.sectionField = page.locator('#txtSection');
    this.agencyDropdown = page.locator('#ddlAgency');
    this.frDescriptionField = page.locator('#MainContent_ctl00_txtFRDesc');
    this.fineField = page.locator('#txtFine');
    this.feeStructureDropdown = page.locator('#ddlFeeStructures');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.successMessage = page.locator('#MainContent_ctl00_pnlSuccessMessage');
    this.backButton = page.getByRole('button', { name: 'Back' });
  }

  async addViolationCode(violation) {
    await this.addButton.click();
    await this.codeField.fill(violation.code);
    await this.startDate.click();
    await this.todayStart.click();
    await this.endDate.click();
    await this.todayEnd.click();
    await this.descriptionField.fill(violation.description);
    await this.sectionField.fill(violation.section);
    await this.agencyDropdown.selectOption(violation.agency);
    await this.frDescriptionField.fill(violation.frDescription);
    await this.fineField.fill(violation.fine);
    await this.feeStructureDropdown.selectOption(violation.feeStructure);
    await this.saveButton.click();

    // Wait for success notification
    await expect(this.successMessage).toContainText('Violation saved successfully.');

    // Click back
    await this.backButton.click();
  }
}

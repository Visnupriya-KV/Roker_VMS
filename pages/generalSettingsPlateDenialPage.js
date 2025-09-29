import { expect } from '@playwright/test';

export class PlateDenialPage {
  constructor(page) {
    this.page = page;
    this.fileOutputDropdown = page.locator('#MainContent_ctl03_drpFileOutput');
    this.courtOfficeInput = page.locator('#MainContent_ctl03_txtCourtOfficeNumber');
    this.caseJurisdictionInput = page.locator('#MainContent_ctl03_txtCaseJurisdiction');
    this.disbursementIdInput = page.locator('#MainContent_ctl03_txtDisbursementID');
    this.saveButton = page.locator('#MainContent_ctl03_btnsSavePlateDenialConfig'); // ✅ unique locator
    this.successMessage = page.locator('#MainContent_ctl03_pnlPlateDenialSuccessMessage');
  }

  async configurePlateDenial(data) {
    await this.fileOutputDropdown.selectOption('1');
    await this.fileOutputDropdown.selectOption('0');
    await this.courtOfficeInput.fill(data.courtOfficeNumber);
    await this.caseJurisdictionInput.fill(data.caseJurisdiction);
    await this.disbursementIdInput.fill(data.disbursementId);

    await this.saveButton.click();

    // ✅ Verify success message
    await expect(this.successMessage).toBeVisible();
  }
}

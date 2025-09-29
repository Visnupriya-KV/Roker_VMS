export class AppealConfigurationPage {
  constructor(page) {
    this.page = page;
    this.saveButton = page.locator('#MainContent_ctl05_btnSaveAppealConfig');
    this.successMessage = page.locator('#MainContent_ctl05_pnlSuccessMessage');
  }

  async configureAppeal(data) {

    await this.saveButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await this.saveButton.click();
    await this.page.waitForTimeout(1000);

    await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✅ Appeal Configurations Saved');
  }
}

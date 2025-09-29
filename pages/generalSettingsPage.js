export class GeneralSettingsPage {
  constructor(page) {
    this.page = page;
    this.settingsLink = page.getByRole('link', { name: 'Settings' });
    this.generalSettingsLink = page.getByRole('link', { name: 'General Settings' });
    this.plateDenialButton = page.getByRole('button', { name: 'Plate Denial Settings' });
    this.holdPaymentButton = page.getByRole('button', { name: 'Hold Payment' });
    this.appealConfigurationButton = page.getByRole('button', { name: 'Appeal Configuration' });
    this.companyDetailsButton = page.getByRole('button', { name: 'Company Details' });
    this.trialConfigurationButton = page.getByRole('button', { name: 'Trial Configuration' }); // NEW
  }

  async openGeneralSettings() {
    await this.settingsLink.click();
    await this.generalSettingsLink.click();
  }

  async openPlateDenial() {
    await this.plateDenialButton.click();
  }

  async openHoldPayment() {
    await this.holdPaymentButton.click();
  }

  async openAppealConfiguration() {
    await this.appealConfigurationButton.click();
    await this.page.waitForTimeout(1000); // visual wait
    console.log('Opened Appeal Configuration');
  }

  async openCompanyDetails() {
    await this.companyDetailsButton.click();
    await this.page.waitForTimeout(1000);
    console.log('Opened Company Details');
  }

  async openTrialConfiguration() {
  await this.page.getByRole('button', { name: 'Trial Configuration' }).click();
  await this.page.waitForTimeout(1000); // optional visual wait
  console.log('Opened Trial Configuration');
}

}

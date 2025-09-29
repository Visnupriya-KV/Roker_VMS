export class GeneralSettingsPage {
  constructor(page) {
    this.page = page;
    this.settingsLink = page.getByRole('link', { name: 'Settings' });
    this.generalSettingsLink = page.getByRole('link', { name: 'General Settings' });
    this.plateDenialButton = page.getByRole('button', { name: 'Plate Denial Settings' });
    this.holdPaymentButton = page.getByRole('button', { name: 'Hold Payment' });

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
}

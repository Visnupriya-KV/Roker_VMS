export class GeneralSettingsPage {
  constructor(page) {
    this.page = page;
    this.settingsLink = page.getByRole('link', { name: 'Settings' });
    this.generalSettingsLink = page.getByRole('link', { name: 'General Settings' });
    this.plateDenialButton = page.getByRole('button', { name: 'Plate Denial Settings' });
  }

  async openGeneralSettings() {
    await this.settingsLink.click();
    await this.generalSettingsLink.click();

  }

  async openPlateDenial() {
    await this.plateDenialButton.click();
  }
}

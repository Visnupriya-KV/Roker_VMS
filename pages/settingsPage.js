export class SettingsPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.settingsLink = page.getByRole('link', { name: 'Settings', exact: true });
    this.locationLink = page.getByRole('link', { name: 'Location' });
  }

  async openSettings() {
    await this.settingsLink.click();
  }

  async openLocation() {
    await this.locationLink.click();
  }
}

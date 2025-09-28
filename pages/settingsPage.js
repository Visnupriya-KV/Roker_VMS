// pages/settingsPage.js
export class SettingsPage {
  constructor(page) {
    this.page = page;

    // Use exact where appropriate to avoid ambiguous matches
    this.settingsLink = page.getByRole('link', { name: 'Settings', exact: true });
    this.locationLink = page.getByRole('link', { name: 'Location' });
    this.officerLink = page.getByRole('link', { name: 'Officer' });
  }

  // Low-level openers (click a single link)
  async openSettings() {
    await this.settingsLink.waitFor({ state: 'visible', timeout: 30000 });
    await this.settingsLink.click();
  }

  async openLocation() {
    await this.locationLink.waitFor({ state: 'visible', timeout: 30000 });
    await this.locationLink.click();
  }

  async openOfficer() {
    await this.officerLink.waitFor({ state: 'visible', timeout: 30000 });
    await this.officerLink.click();
  }

  // Higher-level navigators (open Settings, then the specific sub-link)
  async gotoLocation() {
    await this.openSettings();
    await this.openLocation();
  }

  async gotoOfficer() {
    await this.openSettings();
    await this.openOfficer();
  }
}

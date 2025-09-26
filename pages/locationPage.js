export class LocationPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.addLink = page.getByRole('link', { name: 'Add' });
    this.addButton = page.getByRole('button', { name: '+' });
    this.nameInput = page.getByRole('textbox', { name: '* Name' });
    this.externalIdInput = page.getByRole('textbox', { name: 'External Location Id' });
    this.addressInput = page.getByRole('textbox', { name: 'Address' });
    this.cityInput = page.getByRole('textbox', { name: 'City' });
    this.stateInput = page.getByRole('textbox', { name: 'State' });
    this.zipInput = page.getByRole('textbox', { name: 'Zip Code' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async addLocation(data) {
  await this.addLink.click();

  // Wait for the + button to be visible and enabled
  await this.addButton.waitFor({ state: 'visible', timeout: 60000 });
  await this.addButton.click({ force: true });

  // Fill the form
  await this.nameInput.fill(data.name);
  await this.externalIdInput.fill(data.externalId);
  await this.addressInput.fill(data.address);
  await this.cityInput.fill(data.city);
  await this.stateInput.fill(data.state);
  await this.zipInput.fill(data.zip);

  await this.saveButton.click();
}

}

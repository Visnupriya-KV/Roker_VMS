import { generateRandomString } from '../utils/dataGenerator.js';

export class FastAddPage {
  constructor(page) {
    this.page = page;
    this.trackLink = page.getByRole('link', { name: 'Track' });
    this.fastAddLink = page.getByRole('link', { name: 'Fast Add' });

    this.citationInput = page.locator('#MainContent_ctl00_TxtCitationNo');
    this.tagInput = page.locator('#MainContent_ctl00_TxtTagNumber');
    this.regStateDropdown = page.locator('#MainContent_ctl00_ddlregstate');
    this.vehicleColorInput = page.locator('#MainContent_ctl00_TxtVehicleColor');
    this.plateTypeDropdown = page.locator('#MainContent_ctl00_ddlPlateType');
    this.vehicleMakeDropdown = page.locator('#MainContent_ctl00_ddlVehicleMake');
    this.vehicleStyleDropdown = page.locator('#MainContent_ctl00_ddlVehicleStyle');
    this.dateInput = page.getByRole('textbox', { name: 'YYYY/MM/DD' });
    this.timeInput = page.getByRole('textbox', { name: 'hh:mm AM/PM' });
    this.locationDropdown = page.locator('#select2-ddlLocations-container');
    this.officerDropdown = page.getByRole('textbox', { name: 'Select...' });
    this.violationDropdown = page.locator('#MainContent_ctl00_ddlViolationCode');
    this.meterNoInput = page.locator('#MainContent_ctl00_TxtMeterNo');
    this.agencyInput = page.locator('#MainContent_ctl00_TxtAgency');
    this.notesInput = page.locator('#MainContent_ctl00_txtNotes');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.backButton = page.getByRole('button', { name: 'Back' });
  }

  async openFastAdd() {
    await this.trackLink.click();
    await this.page.waitForLoadState('networkidle');
    await this.fastAddLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async addTicket(ticketData) {
    const citation = `${ticketData.citationNo}_${generateRandomString(4)}`;
    const tag = `${ticketData.tagNumber}_${generateRandomString(4)}`;

    await this.citationInput.fill(citation);
    await this.tagInput.fill(tag);
    await this.regStateDropdown.selectOption(ticketData.regState);
    await this.vehicleColorInput.fill(ticketData.vehicleColor);
    await this.plateTypeDropdown.selectOption(ticketData.plateType);
    await this.vehicleMakeDropdown.selectOption(ticketData.vehicleMake);
    await this.vehicleStyleDropdown.selectOption(ticketData.vehicleStyle);

    // Date
    await this.dateInput.click();
    await this.page.getByText('Today').click();

    // Hardcode Time as 11:30 AM
    await this.page.evaluate(() => {
      const timeField = document.querySelector('#MainContent_ctl00_TxtTime');
      if (timeField) timeField.removeAttribute('readonly');
    });
    await this.timeInput.fill('11:30 AM');

    // Open dropdown
await this.locationDropdown.click();

// Wait for the dropdown items to appear
await this.page.waitForSelector('.select2-results__option', { state: 'visible' });

// Click the item that matches the name
await this.page.locator('.select2-results__option', { hasText: ticketData.location }).click();

    await this.officerDropdown.click();
await this.page.waitForSelector('.select2-results__option', { state: 'visible' });
await this.page.locator('.select2-results__option', { hasText: ticketData.officer }).click();


    await this.violationDropdown.selectOption(ticketData.violationCode);
    await this.meterNoInput.fill(ticketData.meterNo);

    // Agency (force input)
    await this.page.evaluate(() => {
      const agencyField = document.querySelector('#MainContent_ctl00_TxtAgency');
      if (agencyField) agencyField.removeAttribute('readonly');
    });
    await this.agencyInput.fill(ticketData.agency);

    await this.notesInput.fill(ticketData.notes);

    await this.saveButton.click();

    return { citation, tag };
  }

  async goBack() {
    await this.backButton.click();
  }
}

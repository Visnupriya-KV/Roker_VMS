export class TrialConfigurationPage {
  constructor(page) {
    this.page = page;
    this.defaultStateDropdown = page.locator('#MainContent_TrialConfig_drpDefaultState');
    this.allowPerTicketInput = page.locator('#MainContent_TrialConfig_txtTrialAllowPerTicket');
    this.saveButton = page.locator('#MainContent_TrialConfig_btnSaveTrialConfig');
    this.successMessage = page.locator('#MainContent_TrialConfig_pnlSuccessMessage');
  }

  async configureTrial(trialData) {
    console.log(`Configuring Trial: defaultState=${trialData.defaultState}, allowPerTicket=${trialData.allowPerTicket}`);
    await this.defaultStateDropdown.selectOption(trialData.defaultState);
    await this.page.waitForTimeout(500); // visual wait

    if (trialData.allowPerTicket !== undefined && trialData.allowPerTicket !== null) {
      await this.allowPerTicketInput.fill(trialData.allowPerTicket.toString());
    }
  }

  async saveTrialConfig() {
    await this.saveButton.click();

    // Wait for success message to be visible
    await this.successMessage.waitFor({ state: 'visible', timeout: 30000 });

    const messageText = await this.successMessage.textContent();
    if (messageText.includes('Trial Configurations Saved')) {
      console.log('Trial Configuration saved successfully');
    } else {
      throw new Error('Success message not found or text did not match');
    }
  }
}

import urls from '../config/urls.json' assert { type: 'json' };

export class LoginPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.usernameField = page.locator('#ctl03_txtusername');
    this.passwordField = page.locator('#ctl03_txtpassword');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async goto() {
    await this.page.goto(`${urls.baseUrl}${urls.login}`);
  }

  async login(username, password) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.submitButton.click();
  }
}

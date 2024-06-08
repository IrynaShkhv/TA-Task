import { Page, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

export class User {
  private page: Page;
  private login: string;
  private password: string;

  constructor(page: Page, login: string, password: string) {
    this.page = page;
    this.login = login;
    this.password = password;
  }

  async performLogin() {
    await this.page.locator('[data-test="username"]').click();
    await this.page.locator('[data-test="username"]').fill(this.login);
    await this.page.locator('[data-test="password"]').click();
    await this.page.locator('[data-test="password"]').fill(this.password);
    await this.page.locator('[data-test="login-button"]').click();
  }
  async fillRandomUserInfo() {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const postalCode = faker.location.zipCode();

    await this.page.locator('[data-test="firstName"]').click();
    await this.page.locator('[data-test="firstName"]').fill(firstName);
    await this.page.locator('[data-test="lastName"]').click();
    await this.page.locator('[data-test="lastName"]').fill(lastName);
    await this.page.locator('[data-test="postalCode"]').click();
    await this.page.locator('[data-test="postalCode"]').fill(postalCode);
  }
}

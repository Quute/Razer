import { Locator, Page } from "@playwright/test";

export class SignupPage {
    readonly page: Page;
    readonly accountInfoHeader: Locator;
    readonly genderMr: Locator;
    readonly passwordInput: Locator;
    readonly daySelect: Locator;
    readonly monthSelect: Locator;
    readonly yearSelect: Locator;
    readonly newsletterCheckbox: Locator;
    readonly offersCheckbox: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly companyInput: Locator;
    readonly addressInput: Locator;
    readonly address2Input: Locator;
    readonly countrySelect: Locator;
    readonly stateInput: Locator;
    readonly cityInput: Locator;
    readonly zipcodeInput: Locator;
    readonly mobileInput: Locator;
    readonly createAccountButton: Locator;
    readonly accountCreatedHeader: Locator;
    readonly continueButton: Locator;
    readonly loggedInAs: Locator;
    readonly deleteAccountLink: Locator;
    readonly accountDeletedHeader: Locator;

    constructor(page: Page) {
        this.page = page;
        this.accountInfoHeader = page.locator('h2.title b', { hasText: 'Enter Account Information' });
        this.genderMr = page.locator('#id_gender1');
        this.passwordInput = page.locator('[data-qa="password"]');
        this.daySelect = page.locator('[data-qa="days"]');
        this.monthSelect = page.locator('[data-qa="months"]');
        this.yearSelect = page.locator('[data-qa="years"]');
        this.newsletterCheckbox = page.locator('#newsletter');
        this.offersCheckbox = page.locator('#optin');
        this.firstNameInput = page.locator('[data-qa="first_name"]');
        this.lastNameInput = page.locator('[data-qa="last_name"]');
        this.companyInput = page.locator('[data-qa="company"]');
        this.addressInput = page.locator('[data-qa="address"]');
        this.address2Input = page.locator('[data-qa="address2"]');
        this.countrySelect = page.locator('[data-qa="country"]');
        this.stateInput = page.locator('[data-qa="state"]');
        this.cityInput = page.locator('[data-qa="city"]');
        this.zipcodeInput = page.locator('[data-qa="zipcode"]');
        this.mobileInput = page.locator('[data-qa="mobile_number"]');
        this.createAccountButton = page.locator('[data-qa="create-account"]');
        this.accountCreatedHeader = page.locator('[data-qa="account-created"]');
        this.continueButton = page.locator('[data-qa="continue-button"]');
        this.loggedInAs = page.locator('a:has-text("Logged in as")');
        this.deleteAccountLink = page.locator('a[href="/delete_account"]');
        this.accountDeletedHeader = page.locator('[data-qa="account-deleted"]');
    }

    async fillAccountInfo(password: string, day: string, month: string, year: string) {
        await this.genderMr.check();
        await this.passwordInput.fill(password);
        await this.daySelect.selectOption(day);
        await this.monthSelect.selectOption(month);
        await this.yearSelect.selectOption(year);
        await this.newsletterCheckbox.check();
        await this.offersCheckbox.check();
    }

    async fillAddressInfo(data: {
        firstName: string; lastName: string; company: string;
        address: string; address2: string; country: string;
        state: string; city: string; zipcode: string; mobile: string;
    }) {
        await this.firstNameInput.fill(data.firstName);
        await this.lastNameInput.fill(data.lastName);
        await this.companyInput.fill(data.company);
        await this.addressInput.fill(data.address);
        await this.address2Input.fill(data.address2);
        await this.countrySelect.selectOption(data.country);
        await this.stateInput.fill(data.state);
        await this.cityInput.fill(data.city);
        await this.zipcodeInput.fill(data.zipcode);
        await this.mobileInput.fill(data.mobile);
    }

    async submitAccount() {
        await this.createAccountButton.click();
    }

    async clickContinue() {
        await this.continueButton.click();
    }

    async deleteAccount() {
        await this.deleteAccountLink.click();
    }
}

import { Locator, Page } from "@playwright/test";

export class PaymentSuccessPage {
    readonly page: Page;
    readonly successMessage: Locator;
    readonly continueBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.successMessage = page.locator('h2[data-qa="order-placed"]');
        this.continueBtn = page.locator('[data-qa="continue-button"]');
    }

    async getSuccessMessageText() {
        return await this.successMessage.innerText();
    }

    async clickContinue() {
        await this.continueBtn.click();
    }
}

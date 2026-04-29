import { Locator, Page } from "@playwright/test";

export class PaymentSuccessPage {
    readonly page: Page;
    readonly successMessage: Locator;
    readonly continueBtn: Locator;
    readonly downloadInvoiceBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.successMessage = page.locator('h2[data-qa="order-placed"]');
        this.continueBtn = page.locator('[data-qa="continue-button"]');
        // 'Download Invoice' button on /payment_done — its href points at
        // /download_invoice/<id>, so anchoring on the href prefix avoids
        // ambiguity with other .check_out buttons in the page.
        this.downloadInvoiceBtn = page.locator('a[href^="/download_invoice/"]');
    }

    async getSuccessMessageText() {
        return await this.successMessage.innerText();
    }

    async clickContinue() {
        await this.continueBtn.click();
    }

    // Click 'Download Invoice' and resolve to the captured Download object.
    // Caller can then read suggestedFilename / save / read content.
    async downloadInvoice() {
        const [download] = await Promise.all([
            this.page.waitForEvent('download'),
            this.downloadInvoiceBtn.click(),
        ]);
        return download;
    }
}

import { Locator, Page } from "@playwright/test";

export class CheckoutPage {
    readonly page: Page;
    readonly commentTextarea: Locator;
    readonly placeOrderBtn: Locator;
    readonly deliveryAddress: Locator;
    readonly billingAddress: Locator;
    readonly orderReviewTable: Locator;

    constructor(page: Page) {
        this.page = page;
        this.commentTextarea = page.locator('textarea.form-control');
        this.placeOrderBtn = page.locator('.btn.btn-default.check_out');
        this.deliveryAddress = page.locator('#address_delivery');
        this.billingAddress = page.locator('#address_invoice');
        this.orderReviewTable = page.locator('#cart_info');
    }

    async enterComment(comment: string) {
        await this.commentTextarea.fill(comment);
    }

    async placeOrder() {
        await this.placeOrderBtn.click();
    }
}

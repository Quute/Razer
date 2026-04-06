import { Locator, Page } from "@playwright/test";

export class CartPage {
    readonly page: Page;

    // Cart table main container
    readonly cartInfoTable: Locator;

    // Cart table rows (each product)
    readonly cartRows: Locator;

    // Checkout button
    readonly proceedToCheckoutBtn: Locator;

    // Checkout Modal Pop-up Locators (Register/Login warning)
    readonly checkoutModalRegisterLoginLink: Locator;

    // Clear cart button
    readonly deleteButtons: Locator;

    // Empty cart warning
    readonly emptyCartMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        // General cart table
        this.cartInfoTable = page.locator('#cart_info_table');

        // To select product rows in the cart
        this.cartRows = page.locator('#cart_info_table tbody tr');

        // Proceed to checkout button
        this.proceedToCheckoutBtn = page.locator('.check_out');

        // Link inside the modal that appears during checkout if the user is not logged in
        this.checkoutModalRegisterLoginLink = page.locator('#checkoutModal a[href="/login"]');

        // Delete button for each product
        this.deleteButtons = page.locator('.cart_quantity_delete');

        // Message that appears when the cart is empty
        this.emptyCartMessage = page.locator('#empty_cart p.text-center');
    }

    // Method that returns the number of items in the cart
    async getCartItemCount(): Promise<number> {
        return await this.cartRows.count();
    }

    // Methods that return helper locators for product elements at a specific index (0-indexed)
    // Can be added for detailed checks later or used within methods.

    getProductNameLocator(index: number): Locator {
        return this.cartRows.nth(index).locator('td.cart_description h4 a');
    }

    getProductPriceLocator(index: number): Locator {
        return this.cartRows.nth(index).locator('td.cart_price p');
    }

    getProductQuantityLocator(index: number): Locator {
        return this.cartRows.nth(index).locator('td.cart_quantity button');
    }

    getProductTotalLocator(index: number): Locator {
        return this.cartRows.nth(index).locator('td.cart_total p.cart_total_price');
    }

    // Proceed to Checkout method
    async proceedToCheckout() {
        await this.proceedToCheckoutBtn.click();
    }

    // Method to delete a specific product from the cart
    async deleteProductFromCart(index: number) {
        await this.deleteButtons.nth(index).click();
    }
}

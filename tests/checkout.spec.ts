import { test, expect } from '../src/fixtures/baseTest';

test.describe('Checkout and Payment Tests', () => {

    test.beforeEach(async ({ loginPage }) => {
        // Log in before placing an order
        await loginPage.navigate();
        await loginPage.login('bqyilmaz2@gmail.com', '123456');
    });

    test('User should be able to checkout and pay successfully', async ({ page, productsPage, cartPage, checkoutPage, paymentPage, paymentSuccessPage }) => {
        // 1. Go to products and add first product to cart
        await productsPage.navigateToProducts();
        await productsPage.viewFirstProduct();
        await productsPage.addToCart();
        await productsPage.viewCartFromModal();

        // 2. Go to Checkout
        await cartPage.proceedToCheckout();
        await expect(page).toHaveURL(/.*checkout.*/);

        // 3. Checkout Page: add comment and place order
        await checkoutPage.enterComment('This is a test order comment');
        await checkoutPage.placeOrder();
        await expect(page).toHaveURL(/.*payment.*/);

        // 4. Payment Page: fill all card details with "1" as requested
        await paymentPage.fillPaymentDetails('1', '1', '1', '1', '1');
        await paymentPage.submitPayment();

        // 5. Success Page: verify success message
        await expect(page).toHaveURL(/.*payment_done.*/);
        const successText = await paymentSuccessPage.getSuccessMessageText();
        expect(successText.toUpperCase()).toContain('ORDER PLACED');
        await expect(paymentSuccessPage.successMessage).toBeVisible();

        // 6. Click continue (optional)
        await paymentSuccessPage.clickContinue();
    });

});

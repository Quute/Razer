import { test, expect } from '../src/fixtures/baseTest';

const TEST_EMAIL = process.env.TEST_USER_EMAIL!;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD!;

test.describe('Checkout and Payment Tests', () => {

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.navigate();
        await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
    });

    test('User should be able to checkout and pay successfully', async ({ page, productsPage, cartPage, checkoutPage, paymentPage, paymentSuccessPage }) => {
        await productsPage.navigateToProducts();
        await productsPage.viewFirstProduct();
        await productsPage.addToCart();
        await productsPage.viewCartFromModal();

        await cartPage.proceedToCheckout();
        await expect(page).toHaveURL(/.*checkout.*/);

        await checkoutPage.enterComment('This is a test order comment');
        await checkoutPage.placeOrder();
        await expect(page).toHaveURL(/.*payment.*/);

        await paymentPage.fillPaymentDetails('1', '1', '1', '1', '1');
        await paymentPage.submitPayment();

        await expect(page).toHaveURL(/.*payment_done.*/);
        const successText = await paymentSuccessPage.getSuccessMessageText();
        expect(successText.toUpperCase()).toContain('ORDER PLACED');
        await expect(paymentSuccessPage.successMessage).toBeVisible();

        await paymentSuccessPage.clickContinue();
    });

});

import { test, expect } from '../src/fixtures/baseTest';

test.describe('TC15 - Place Order: Register before Checkout', () => {

    test('User should be able to register first and then place order', async ({
        page,
        homePage,
        productsPage,
        cartPage,
        loginPage,
        signupPage,
        checkoutPage,
        paymentPage,
        paymentSuccessPage
    }) => {
        // 1. Launch browser & 2. Navigate to url 'http://automationexercise.com'
        await homePage.navigate();

        // 3. Verify that home page is visible successfully
        await expect(page).toHaveTitle(/Automation Exercise/);

        // 4. Click 'Signup / Login' button
        await homePage.signupLoginLink.click();

        // 5. Fill all details in Signup and create account
        const randomStr = Math.random().toString(36).substring(2, 10);
        const name = `TestUser${randomStr}`;
        const email = `test${randomStr}@example.com`;

        await loginPage.startSignup(name, email);
        await page.waitForLoadState('domcontentloaded');

        await signupPage.fillAccountInfo('Password123!', '1', '1', '2000');
        await signupPage.fillAddressInfo({
            firstName: 'Test',
            lastName: 'User',
            company: 'QA Inc',
            address: '123 Test St',
            address2: 'Suite 1',
            country: 'United States',
            state: 'California',
            city: 'Los Angeles',
            zipcode: '90001',
            mobile: '1234567890'
        });
        await signupPage.submitAccount();

        // 6. Verify 'ACCOUNT CREATED!' and click 'Continue' button
        await expect(signupPage.accountCreatedHeader).toBeVisible();
        await signupPage.clickContinue();

        if (page.url().includes('#google_vignette')) {
            await page.goto('/');
        }

        // 7. Verify ' Logged in as username' at top
        await expect(homePage.loggedInAsUser).toBeVisible();

        // 8. Add products to cart — use the product-detail flow (more stable than
        //    the hover-overlay on the product list). Wait for the confirmation
        //    modal as a signal that the server-side cart add completed.
        await productsPage.navigateToProducts();

        if (page.url().includes('#google_vignette')) {
            await page.goto('/products');
        }

        await productsPage.viewFirstProduct();
        await productsPage.addToCart();
        await productsPage.cartModal.waitFor({ state: 'visible', timeout: 15000 });

        // 9. Click 'Cart' button — direct navigation sidesteps flaky modal click.
        await page.goto('/view_cart');

        // 10. Verify that cart page is displayed
        await expect(page).toHaveURL(/.*view_cart/);
        expect(await cartPage.getCartItemCount()).toBeGreaterThan(0);

        // 11. Click 'Proceed To Checkout' button
        await cartPage.proceedToCheckout();

        // Vignette interstitial can intercept the checkout navigation; recover.
        if (page.url().includes('#google_vignette')) {
            await page.goto('/checkout');
        }
        await page.waitForURL(/checkout/, { timeout: 15000 });

        // 12. Verify Address Details and Review Your Order
        await expect(checkoutPage.deliveryAddress).toBeVisible();
        await expect(checkoutPage.billingAddress).toBeVisible();
        await expect(checkoutPage.orderReviewTable).toBeVisible();

        // 13. Enter description in comment text area and click 'Place Order'
        await checkoutPage.enterComment('Deliver between 9 AM and 5 PM.');
        await checkoutPage.placeOrder();

        // 14. Enter payment details: Name on Card, Card Number, CVC, Expiration date
        await paymentPage.fillPaymentDetails('Test User', '4111222233334444', '123', '12', '2030');

        // 15. Click 'Pay and Confirm Order' button
        await paymentPage.submitPayment();

        // 16. Verify success message 'Your order has been placed successfully!'
        await expect(paymentSuccessPage.successMessage).toHaveText(/order placed/i);

        // 17. Click 'Delete Account' button
        await homePage.deleteAccountLink.click();

        // 18. Verify 'ACCOUNT DELETED!' and click 'Continue' button
        await expect(signupPage.accountDeletedHeader).toBeVisible();
        await signupPage.clickContinue();
        if (page.url().includes('#google_vignette')) {
            await page.goto('/');
        }
    });
});

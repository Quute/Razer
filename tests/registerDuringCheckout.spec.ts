import { test, expect } from '../src/fixtures/baseTest';

test.describe('TC14 - Place Order: Register while Checkout', () => {

    test('User should be able to register during checkout and place order', async ({
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

        // 4. Add products to cart
        await productsPage.navigateToProducts();
        
        // Handle potential google vignette
        if (page.url().includes('#google_vignette')) {
            await page.goto('/products');
        }

        await productsPage.addProductToCartByIndex(0);

        // 5. Click 'Cart' button (from modal)
        await productsPage.viewCartFromModal();

        // 6. Verify that cart page is displayed
        await expect(page).toHaveURL(/.*view_cart/);
        expect(await cartPage.getCartItemCount()).toBeGreaterThan(0);

        // 7. Click Proceed To Checkout
        await cartPage.proceedToCheckout();

        // 8. Click 'Register / Login' button
        await cartPage.checkoutModalRegisterLoginLink.click();

        // 9. Fill all details in Signup and create account
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
            state: 'New York',
            city: 'New York',
            zipcode: '10001',
            mobile: '1234567890'
        });
        await signupPage.submitAccount();

        // 10. Verify 'ACCOUNT CREATED!' and click 'Continue' button
        await expect(signupPage.accountCreatedHeader).toBeVisible();
        await signupPage.continueButton.click();

        // Handle possible google vignette ad if present
        if (page.url().includes('#google_vignette')) {
            await page.goto('/');
        }

        // 11. Verify ' Logged in as username' at top
        await expect(homePage.loggedInAsUser).toBeVisible();

        // 12. Click 'Cart' button
        await homePage.cartLink.click();

        // 13. Click 'Proceed To Checkout' button
        await cartPage.proceedToCheckout();

        // Vignette interstitial can intercept the checkout navigation; recover.
        if (page.url().includes('#google_vignette')) {
            await page.goto('/checkout');
        }
        await page.waitForURL(/checkout/, { timeout: 15000 });

        // 14. Verify Address Details and Review Your Order
        await expect(checkoutPage.deliveryAddress).toBeVisible();
        await expect(checkoutPage.billingAddress).toBeVisible();
        await expect(checkoutPage.orderReviewTable).toBeVisible();

        // 15. Enter description in comment text area and click 'Place Order'
        await checkoutPage.enterComment('Please deliver between 9 AM and 5 PM.');
        await checkoutPage.placeOrder();

        // 16. Enter payment details: Name on Card, Card Number, CVC, Expiration date
        await paymentPage.fillPaymentDetails('Test User', '4111222233334444', '123', '12', '2030');

        // 17. Click 'Pay and Confirm Order' button
        await paymentPage.submitPayment();

        // 18. Verify success message heading ('ORDER PLACED!') is shown after payment.
        //     The detailed 'Your order has been placed successfully!' line lives in a sibling
        //     paragraph; the h2 we own in POM is the status heading.
        await expect(paymentSuccessPage.successMessage).toHaveText(/order placed/i);

        // 19. Click 'Delete Account' button
        await homePage.deleteAccountLink.click();

        // 20. Verify 'ACCOUNT DELETED!' and click 'Continue' button
        await expect(signupPage.accountDeletedHeader).toBeVisible();
        await signupPage.clickContinue();
        if (page.url().includes('#google_vignette')) {
            await page.goto('/');
        }
    });
});

import { test, expect } from '../src/fixtures/baseTest';

test.describe('TC23 - Verify Address Details in Checkout Page', () => {

    test('Delivery and billing addresses should match the registration data', async ({
        page,
        homePage,
        productsPage,
        cartPage,
        loginPage,
        signupPage,
        checkoutPage
    }) => {
        // 1-2. Launch browser & navigate to url
        await homePage.navigate();

        // 3. Verify home page is visible successfully
        await expect(page).toHaveTitle(/Automation Exercise/);

        // 4. Click 'Signup / Login' button
        await homePage.signupLoginLink.click();

        // 5. Fill all details in Signup and create account
        const randomStr = Math.random().toString(36).substring(2, 10);
        const name = `TestUser${randomStr}`;
        const email = `test${randomStr}@example.com`;

        const addressData = {
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
        };

        await loginPage.startSignup(name, email);
        await page.waitForLoadState('domcontentloaded');

        await signupPage.fillAccountInfo('Password123!', '1', '1', '2000');
        await signupPage.fillAddressInfo(addressData);
        await signupPage.submitAccount();

        // 6. Verify 'ACCOUNT CREATED!' and click 'Continue' button
        await expect(signupPage.accountCreatedHeader).toBeVisible();
        await signupPage.clickContinue();

        // Handle possible google vignette interstitial after continue
        if (page.url().includes('#google_vignette')) {
            await page.goto('/');
        }

        // 7. Verify ' Logged in as username' at top
        await expect(homePage.loggedInAsUser).toBeVisible();

        // 8. Add products to cart
        await productsPage.navigateToProducts();

        if (page.url().includes('#google_vignette')) {
            await page.goto('/products');
        }

        await productsPage.addProductToCartByIndex(0);

        // 9. Click 'Cart' button (from modal)
        await productsPage.viewCartFromModal();

        // 10. Verify that cart page is displayed
        await expect(page).toHaveURL(/.*view_cart/);
        expect(await cartPage.getCartItemCount()).toBeGreaterThan(0);

        // 11. Click Proceed To Checkout
        await cartPage.proceedToCheckout();

        // Vignette interstitial can intercept the checkout navigation and leave
        // the URL on the cart page; recover by going to /checkout directly.
        if (page.url().includes('#google_vignette')) {
            await page.goto('/checkout');
        }
        await page.waitForURL(/checkout/, { timeout: 15000 });

        // 12-13. Verify delivery and billing addresses match the data used at registration.
        //        Both blocks on checkout use the same rendering template, so we assert each
        //        block individually against every field supplied during signup.
        const expectedFullName = `${addressData.firstName} ${addressData.lastName}`;
        const addressBlocks = [checkoutPage.deliveryAddress, checkoutPage.billingAddress];

        for (const block of addressBlocks) {
            await expect(block).toBeVisible();
            await expect(block).toContainText(expectedFullName);
            await expect(block).toContainText(addressData.company);
            await expect(block).toContainText(addressData.address);
            await expect(block).toContainText(addressData.address2);
            await expect(block).toContainText(addressData.city);
            await expect(block).toContainText(addressData.state);
            await expect(block).toContainText(addressData.zipcode);
            await expect(block).toContainText(addressData.country);
            await expect(block).toContainText(addressData.mobile);
        }

        // 14. Click 'Delete Account' button
        await homePage.deleteAccountLink.click();

        // 15. Verify 'ACCOUNT DELETED!' and click 'Continue' button
        await expect(signupPage.accountDeletedHeader).toBeVisible();
        await signupPage.clickContinue();
        if (page.url().includes('#google_vignette')) {
            await page.goto('/');
        }
    });
});

import { test, expect } from '../src/fixtures/baseTest';

test.describe('TC1 - Register User', () => {

    test('Yeni kullanıcı kaydı başarılı olmalı ve hesap silinebilmeli', async ({ loginPage, signupPage, page }) => {
        const uniqueEmail = `user_${Date.now()}@test.com`;
        const name = 'Test User';

        // 1. Navigate to login/signup page
        await loginPage.navigate();

        // 2. Verify "New User Signup!" is visible (signup form on login page)
        await expect(loginPage.signupNameInput).toBeVisible();

        // 3. Enter name and email, click Signup
        await loginPage.signupNameInput.fill(name);
        await loginPage.signupEmailInput.fill(uniqueEmail);
        await loginPage.signupButton.click();

        // 4. Verify account information form is displayed
        await expect(signupPage.accountInfoHeader).toBeVisible();

        // 5. Fill account info
        await signupPage.fillAccountInfo('Password123', '10', '5', '1995');

        // 6. Fill address info
        await signupPage.fillAddressInfo({
            firstName: 'Test',
            lastName: 'User',
            company: 'TestCo',
            address: '123 Test St',
            address2: 'Apt 4',
            country: 'United States',
            state: 'California',
            city: 'Los Angeles',
            zipcode: '90001',
            mobile: '5551234567',
        });

        // 7. Submit and verify "ACCOUNT CREATED!"
        await signupPage.submitAccount();
        await expect(signupPage.accountCreatedHeader).toBeVisible();

        // 8. Continue and verify logged in
        await signupPage.clickContinue();
        await expect(signupPage.loggedInAs).toContainText(name);

        // 9. Delete account and verify
        await signupPage.deleteAccount();
        await expect(signupPage.accountDeletedHeader).toBeVisible();
        await signupPage.clickContinue();
    });
});

import { test, expect } from '../src/fixtures/baseTest';

const TEST_EMAIL = process.env.TEST_USER_EMAIL!;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD!;

test.describe('Logout Tests (TC4)', () => {

    test('Logged-in user should be able to logout and land on login page', async ({ loginPage, homePage, page }) => {
        // 1. Login with valid credentials
        await loginPage.navigate();
        await loginPage.login(TEST_EMAIL, TEST_PASSWORD);

        // 2. Verify logged-in state
        await expect(homePage.loggedInAsUser).toBeVisible();

        // 3. Click logout
        await homePage.logout();

        // 4. Verify redirected to login page
        await expect(page).toHaveURL(/.*login/);
        await expect(loginPage.emailInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();

        // 5. Verify session ended: header no longer shows "Logged in as"
        await expect(homePage.loggedInAsUser).toBeHidden();
    });

});

import { test, expect } from '../src/fixtures/baseTest';

const TEST_EMAIL = process.env.TEST_USER_EMAIL!;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD!;

test.describe('User Authentication Tests', () => {
    test('Login page elements should be visible', async ({ loginPage }) => {
        await loginPage.navigate();

        await expect(loginPage.emailInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
    });

    test('Login with invalid credentials should show error', async ({ loginPage }) => {
        await loginPage.navigate();
        await loginPage.login('invalid@example.com', 'wrongpassword');

        await expect(loginPage.loginErrorMessage).toBeVisible();
    });

    test('Login with valid credentials should succeed', async ({ loginPage, homePage }) => {
        await loginPage.navigate();
        await loginPage.login(TEST_EMAIL, TEST_PASSWORD);

        await expect(homePage.loggedInAsUser).toBeVisible();
    });
});

import { test, expect } from '../src/fixtures/baseTest';

test.describe('Kullanıcı Kimlik Doğrulama Testleri', () => {
  test('Login sayfası öğeleri görünür olmalı', async ({ loginPage }) => {
    await loginPage.navigate();

    // loginPage fixture automatically creates the object.
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('Geçersiz bilgilerle login denemesi hata vermeli', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login('invalid@example.com', 'wrongpassword');

    // Verify error message is visible
    const errorMessage = loginPage.page.locator('//*[@id="form"]/div/div/div[1]/div/form/p'); // Use appropriate locator for error message
    await expect(errorMessage).toBeVisible();
  });

  test('Geçerli bilgilerle login başarılı olmalı', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login('bqyilmaz2@gmail.com', '123456');

    // Verify username is visible after successful login
    const userName = loginPage.page.locator('//*[@id="header"]/div/div/div/div[2]/div/ul/li[10]/a/b'); // Use appropriate locator for username
    await expect(userName).toBeVisible();
  });
});
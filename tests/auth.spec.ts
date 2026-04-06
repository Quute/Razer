import { test, expect } from '../src/fixtures/baseTest';

test.describe('Kullanıcı Kimlik Doğrulama Testleri', () => {
  test('Login sayfası öğeleri görünür olmalı', async ({ loginPage }) => {
    await loginPage.navigate();

    //loginPage fixture'ı sayesinde nesne otomatik olarak oluşturulur.
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('Geçersiz bilgilerle login denemesi hata vermeli', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login('invalid@example.com', 'wrongpassword');

    //Hata mesajının görünür olduğunu doğrula
    const errorMessage = loginPage.page.locator('//*[@id="form"]/div/div/div[1]/div/form/p'); //Hata mesajı için uygun locator'ı kullanın
    await expect(errorMessage).toBeVisible();
  });

  test('Geçerli bilgilerle login başarılı olmalı', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login('bqyilmaz2@gmail.com', '123456');

    //Başarılı login sonrası kullanıcı adının görünür olduğunu doğrula
    const userName = loginPage.page.locator('//*[@id="header"]/div/div/div/div[2]/div/ul/li[10]/a/b'); //Kullanıcı adı için uygun locator'ı kullanın
    await expect(userName).toBeVisible();
  });
});
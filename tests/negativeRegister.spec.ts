import { test, expect } from '../src/fixtures/baseTest';

test.describe('Negative Register Tests', () => {

    test('Kayıtlı bir email ile yeni kayıt oluşturulmamalı (Test Case 5)', async ({ loginPage }) => {
        // Sistemde zaten var olan (auth testlerinde kullanılan) email'i kullanıyoruz.
        const existingEmail = 'bqyilmaz2@gmail.com';
        const name = 'Mevcut Kullanıcı';

        // 1. Navigate to login/signup page
        await loginPage.navigate();

        // 2. Verify "New User Signup!" is visible
        await expect(loginPage.signupNameInput).toBeVisible();

        // 3. Enter name and already registered email address
        await loginPage.signupNameInput.fill(name);
        await loginPage.signupEmailInput.fill(existingEmail);

        // 4. Click 'Signup' button
        await loginPage.signupButton.click();

        // 5. Verify error 'Email Address already exist!' is visible
        const errorMessage = loginPage.page.getByText('Email Address already exist!');
        await expect(errorMessage).toBeVisible();
    });
    
    test('İsim alanı boş bırakıldığında HTML5 validasyon hatası vermeli', async ({ loginPage }) => {
        await loginPage.navigate();
        
        // Sadece email giriyoruz, isim alanı boşkalıyor
        await loginPage.signupEmailInput.fill(`test_${Date.now()}@test.com`);
        await loginPage.signupButton.click();

        // Sayfa geçişinin YAPILAMADIĞINI doğruluyoruz (İlerlenemediği için URL login olarak kalır)
        await expect(loginPage.page).toHaveURL(/.*login/);

        // İsim alanının HTML5 validation'ı (required attribute) tarafından hatalı bulunduğunu doğruluyoruz
        const isNameValid = await loginPage.signupNameInput.evaluate((el: HTMLInputElement) => el.checkValidity());
        expect(isNameValid).toBeFalsy();
    });

    test('Geçersiz formatta email girildiğinde HTML5 validasyon hatası vermeli', async ({ loginPage }) => {
        await loginPage.navigate();
        
        // Geçerli bir isim fakat içerisinde '@' işareti olmayan hatalı formatta bir email giriyoruz
        await loginPage.signupNameInput.fill('Oto Test');
        await loginPage.signupEmailInput.fill('gecersizemailadresi.com');
        await loginPage.signupButton.click();

        // Sayfa geçişinin YAPILAMADIĞINI doğruluyoruz
        await expect(loginPage.page).toHaveURL(/.*login/);

        // Email alanının validasyon tarafından hatalı bulunduğunu test ediyoruz
        const isEmailValid = await loginPage.signupEmailInput.evaluate((el: HTMLInputElement) => el.checkValidity());
        expect(isEmailValid).toBeFalsy();
    });

    test('Hesap oluştururken (Adım 2) şifre alanı boş bırakıldığında kayıt tamamlanamamalı', async ({ loginPage, signupPage }) => {
        const uniqueEmail = `test_${Date.now()}@test.com`;
        
        // 1. İlk adımı başarılı bilgilerle geçiyoruz
        await loginPage.navigate();
        await loginPage.signupNameInput.fill('Yeni Kullanici');
        await loginPage.signupEmailInput.fill(uniqueEmail);
        await loginPage.signupButton.click();

        // 2. Account Information adımında (Adım 2) olduğumuzu doğruluyoruz
        await expect(signupPage.accountInfoHeader).toBeVisible();

        // 3. ŞİFRE GİRMEDEN (boş bırakarak) POM üzerinden adres vs. diğer fill metodlarını çalıştırıyoruz
        // (Normal fillAccountInfo metodunu kullanamıyorum çünkü o password parametresi bekliyor ve set ediyor. Biz burada set etmeyeceğiz)
        await signupPage.genderMr.check();
        await signupPage.daySelect.selectOption('10');
        await signupPage.monthSelect.selectOption('5');
        await signupPage.yearSelect.selectOption('1995');
        await signupPage.newsletterCheckbox.check();
        await signupPage.offersCheckbox.check();
        
        await signupPage.fillAddressInfo({
            firstName: 'Test',
            lastName: 'Kullanici',
            company: 'QA Company',
            address: '123 QA Street',
            address2: 'Floor 2',
            country: 'United States',
            state: 'New York',
            city: 'New York',
            zipcode: '10001',
            mobile: '5559876543',
        });

        // 4. Formu submit ediyoruz
        await signupPage.submitAccount();

        // 5. Kayıt BAŞARISIZ olduğu için sistemin bizi SignUp ekranında tuttuğunu test ediyoruz.
        await expect(signupPage.page).toHaveURL(/.*signup/);
        
        // Şifre elementinin validasyon hatası barındırdığını POM üzerinden lokatöre erişerek doğruluyoruz.
        const isPasswordValid = await signupPage.passwordInput.evaluate((el: HTMLInputElement) => el.checkValidity());
        expect(isPasswordValid).toBeFalsy();
    });

});

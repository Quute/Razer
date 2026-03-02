import { test, expect } from '../src/fixtures/baseTest';

test.describe('Ürün Arama ve Detay Testleri', () => {

    test.beforeEach(async ({ page }) => {
        // Her testten önce anasayfaya gidilir
        await page.goto('https://automationexercise.com/');
    });

    test('Kullanıcı belirli bir ürünü aratabilmeli', async ({ productsPage }) => {
        // 1. Ürünler sayfasına git
        await productsPage.navigateToProducts();

        // 2. Ürün araması yap
        await productsPage.searchProduct('Tshirt');

        // 3. Arama sonucunun görünürlüğünü doğrula
        await expect(productsPage.searchedProductsHeader).toBeVisible();
        await expect(productsPage.searchedProductsHeader).toHaveText('Searched Products');
    });

    test('Ürün detaylarında doğru bilgiler gösterilmeli', async ({ productsPage, page }) => {
        // 1. Ürünler sayfasına git
        await productsPage.navigateToProducts();

        // 2. İlk çıkan ürünün detaylarına git
        await productsPage.viewFirstProduct();

        // URL'nin ürün detaylarına gittiğini asenkron bekleme ile doğrula (product_details içeriyor mu)
        await expect(page).toHaveURL(/.*product_details.*/);

        // 3. Ürün detaylarında kritik bilgilerin (İsim, Kategori, Fiyat vb.) yüklendiğini kontrol et
        await expect(productsPage.productName).toBeVisible();
        await expect(productsPage.productCategory).toBeVisible();
        await expect(productsPage.productPrice).toBeVisible();
        await expect(productsPage.productAvailability).toBeVisible();

        // İsteğe bağlı olarak içeriğinde veri olup olmadığını kontrol etmek (empty olmadığını garantilemek)
        expect(await productsPage.productName.innerText()).not.toBe('');
        expect(await productsPage.productPrice.innerText()).not.toBe('');
    });

});

import { test, expect } from '../src/fixtures/baseTest';

test.describe('Ürün Arama ve Detay Testleri', () => {

    test.beforeEach(async ({ page }) => {
        // Her testten önce anasayfaya gidilir
        await page.goto('https://automationexercise.com/');
    });



    test('Ürün detaylarında doğru bilgiler gösterilmeli ve ürün sepete eklenebilmeli', async ({ productsPage, cartPage, page }) => {
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

        // Ürün adını ve fiyatını sepet sayfasında doğrulamak için kaydet
        const expectedProductName = await productsPage.productName.innerText();
        const expectedProductPrice = await productsPage.productPrice.innerText();

        // 4. Miktarı belirle (Örn: 2 adet)
        await productsPage.setQuantity('2');

        // 5. Sepete ekle
        await productsPage.addToCart();

        // 6. Modal üzerinden sepete git
        await productsPage.viewCartFromModal();

        // 7. URL'nin sepet sayfasına gittiğini doğrula
        await expect(page).toHaveURL(/.*view_cart.*/);

        // 8. Sepet sayfası (CartPage) kontrolleri
        const itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(1);

        // Eklenen ürünün detaylarının doğru olduğunu kontrol et
        const cartProductNameLocator = cartPage.getProductNameLocator(0);
        await expect(cartProductNameLocator).toHaveText(expectedProductName);

        const cartProductPriceLocator = cartPage.getProductPriceLocator(0);
        await expect(cartProductPriceLocator).toHaveText(expectedProductPrice);

        const cartProductQuantityLocator = cartPage.getProductQuantityLocator(0);
        await expect(cartProductQuantityLocator).toHaveText('2');
    });

});

import { test, expect } from '../src/fixtures/baseTest';

test.describe('Sepetten Ürün Silme Testleri', () => {

    test.beforeEach(async ({ page, productsPage }) => {
        // Her testten önce anasayfaya git
        await page.goto('https://automationexercise.com/');

        // Sepete test öncesi 2 adet ürün eklemek için hazırlık adımları
        await productsPage.navigateToProducts();
        await productsPage.viewFirstProduct();

        // Reklamı veya başka pop-upları atlamak için sayfanın yüklenmesini bekle
        await expect(page).toHaveURL(/.*product_details.*/);

        // 2 adet ürün ekle
        await productsPage.setQuantity('2');
        await productsPage.addToCart();
        await productsPage.viewCartFromModal();

        // Sepet sayfasında olduğumuzu doğrula
        await expect(page).toHaveURL(/.*view_cart.*/);
    });



    test('Sepetteki ürünleri tamamen silerek sepeti boşaltma (2\'den 0\'a)', async ({ cartPage }) => {
        // Başlangıçta sepette 1 kalem ürün (içinde 2 adet bulunan satır) var
        let itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(1);

        // 1. Ürünü tamamen sil (X butonuna bas)
        await cartPage.deleteProductFromCart(0);

        // 2. Silme işleminin gerçekleşmesini ve sepetin boş durumuna geçmesini bekle
        // Silinen satırın artık dom'da olmadığını doğrula
        await expect(cartPage.cartRows).toHaveCount(0);

        // 3. "Cart is empty!" mesajının görünür olduğunu test et
        await expect(cartPage.emptyCartMessage).toBeVisible();
        await expect(cartPage.emptyCartMessage).toContainText('Cart is empty!');
    });

});

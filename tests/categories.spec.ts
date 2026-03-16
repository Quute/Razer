import { test, expect } from '../src/fixtures/baseTest';

test.describe('Kategori Menüsü Testleri', () => {

    test.beforeEach(async ({ page }) => {
        // Her testten önce anasayfaya gidilir
        await page.goto('https://automationexercise.com/');
    });

    test('Women -> Dress kategorisindeki ürünlerin doğru listelendiği doğrulanmalı', async ({ homePage, page }) => {
        // 1. Women kategorisini genişlet ve Dress seçeneğine tıkla
        await homePage.openWomenDressCategory();

        // 2. Açılan kategori sayfasının başlığını doğrula (Sadece içerik kontrolü yapılıyor)
        const categoryTitle = await homePage.getDisplayedCategoryTitle();
        expect(categoryTitle.toLowerCase()).toContain('dress');

        // URL'nin /category_products/1 içerdiğini doğrula
        await expect(page).toHaveURL(/.*category_products\/1.*/);

        // 3. Ürünlerin listelendiğini ve "Dress" ile ilgili olduğunu doğrula
        const productNames = await homePage.getProductNames();

        // Sepette ürün olduğundan emin ol
        expect(productNames.length).toBeGreaterThan(0);

        // Her bir ürünün isminde "Dress" (büyük/küçük harf duyarsız) kelimesi geçip geçmediğini kontrol et
        const allDresses = productNames.every(name => name.toLowerCase().includes('dress'));

        // Ekranda Women - Dress kategorisine basılınca çıkan ürünlerin dress olması beklenir. 
        // Eğer siteden gelen veride 'Dress' harici bir item listeleniyorsa bu test fail edebilir, 
        // ancak senaryo beklentimiz olan "ürünlerin dress olup olmadığını kontrol edicez" kısmını karşılamakta.
        expect(allDresses, `Tüm ürün isimlerinde "Dress" kelimesi geçmiyor. Ürünler: \n${productNames.join('\n')}`).toBeTruthy();
    });

});

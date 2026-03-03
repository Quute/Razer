import { Locator, Page } from "@playwright/test";

export class ProductsPage {
    readonly page: Page;
    readonly productsMenuLink: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly searchedProductsHeader: Locator;
    readonly firstProductViewLink: Locator;

    // Ürün Detay Sayfası Elementleri
    readonly productName: Locator;
    readonly productCategory: Locator;
    readonly productPrice: Locator;
    readonly productAvailability: Locator;

    // Sepet Etkileşimi Elementleri
    readonly quantityInput: Locator;
    readonly addToCartButton: Locator;
    readonly viewCartModalLink: Locator;

    constructor(page: Page) {
        this.page = page;

        // --- Navigasyon ve Arama Locator'ları ---
        // Üst menüdeki 'Products' linkini, href niteliği ile buluyoruz (unicode boşluklardan kaçınıyoruz).
        this.productsMenuLink = page.locator('a[href="/products"]');

        // Arama kutusu için id selector'ü kullanıldı.
        this.searchInput = page.locator('input#search_product');

        // Arama butonu için id selector'ü kullanıldı.
        this.searchButton = page.locator('button#submit_search');

        // Arama işleminden sonra ortaya çıkan başlık. text-center class'ına sahip h2 tag'i tespit edildi.
        this.searchedProductsHeader = page.locator('h2.title.text-center').filter({ hasText: 'Searched Products' });

        // Ürün listesinde ilk ürünün 'View Product' linkini yakalamak için (daha stabil css kullanımı)
        this.firstProductViewLink = page.locator('.choose a').first();

        // --- Ürün Detay Sayfası Locator'ları ---
        // Ürün detay sayfasındaki ürün ismi h2 olarak bulunur.
        this.productName = page.locator('.product-information h2');

        // Ürün kategorisi içinde 'Category' metni geçen paragraf (p) olarak bulunur.
        this.productCategory = page.locator("xpath=//p[contains(text(), 'Category')]");

        // Ürün fiyatını bulmak için class yapısı yerine hiyerarşik span kullanımı.
        this.productPrice = page.locator('span > span').first();

        // Stok durumunu (Availability) bulmak için contains metodu.
        this.productAvailability = page.locator("xpath=//p[contains(., 'Availability:')]");

        // --- Sepet Etkileşim Elementleri ---
        // Adet giriş alanı id'si quantity
        this.quantityInput = page.locator('#quantity');
        // 'Add to cart' butonu classı cart
        this.addToCartButton = page.locator('button.cart');
        // Sepete ekledikten sonra çıkan pop-up modal içerisindeki 'View Cart' linki
        this.viewCartModalLink = page.locator('#cartModal a[href="/view_cart"]');
    }

    // 1. Ürünler sayfasına menüden gitme metodu
    async navigateToProducts() {
        await this.productsMenuLink.click();
    }

    // 2. Ürün arama işlemini tek fonksiyonda toplayan metot
    async searchProduct(productName: string) {
        await this.searchInput.fill(productName);
        await this.searchButton.click();
    }

    // 3. İlk çıkan ürünün detaylarına gitme metodu
    async viewFirstProduct() {
        // baseTest içindeki global route blocking (reklam engelleme) sayesinde artık reklamlar DOM'u kaydırmıyor.
        // O yüzden en stabil olan normal click metodunu güvenle kullanabiliriz.
        await this.firstProductViewLink.click();
    }

    // 4. Detay sayfasında ürün miktarını ayarlama
    async setQuantity(quantity: string) {
        // Girdi alanının içeriğini temizle ve yeni miktarı gir
        await this.quantityInput.fill(quantity);
    }

    // 5. 'Add to Cart' butonuna tıklama
    async addToCart() {
        await this.addToCartButton.click();
    }

    // 6. Sepete eklendi onay pop-up'ından 'View Cart'a gitme
    async viewCartFromModal() {
        await this.viewCartModalLink.click();
    }
}

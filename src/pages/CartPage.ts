import { Locator, Page } from "@playwright/test";

export class CartPage {
    readonly page: Page;

    // Sepet tablosu ana kapsayıcısı
    readonly cartInfoTable: Locator;

    // Sepet tablosu satırları (her bir ürün)
    readonly cartRows: Locator;

    // Checkout butonu
    readonly proceedToCheckoutBtn: Locator;

    // Checkout Modal Pop-up Locators (Kayıt ol/Giriş yap uyarısı)
    readonly checkoutModalRegisterLoginLink: Locator;

    // Sepeti temizleme butonu
    readonly deleteButtons: Locator;

    // Sepet boş uyarısı
    readonly emptyCartMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        // Sepet tablosu genel
        this.cartInfoTable = page.locator('#cart_info_table');

        // Sepetteki ürün satırlarını seçmek için
        this.cartRows = page.locator('#cart_info_table tbody tr');

        // Ödeme adımına geç butonu
        this.proceedToCheckoutBtn = page.locator('.check_out');

        // Checkout sırasında kullanıcı giriş yapmamışsa çıkan modal içindeki link
        this.checkoutModalRegisterLoginLink = page.locator('#checkoutModal a[href="/login"]');

        // Her bir ürünü silme butonu
        this.deleteButtons = page.locator('.cart_quantity_delete');

        // Sepet boş olduğunda çıkan mesaj
        this.emptyCartMessage = page.locator('#empty_cart p.text-center');
    }

    // Sepette ürün olup olmadığını döndüren metot
    async getCartItemCount(): Promise<number> {
        return await this.cartRows.count();
    }

    // Belirli bir indeksteki (0'dan başlayan) ürün elementleri için yardımcı locatorlar döndüren metotlar
    // İleride detaylı kontroller için eklenebilir veya metot içinde kullanılabilir.

    getProductNameLocator(index: number): Locator {
        return this.cartRows.nth(index).locator('td.cart_description h4 a');
    }

    getProductPriceLocator(index: number): Locator {
        return this.cartRows.nth(index).locator('td.cart_price p');
    }

    getProductQuantityLocator(index: number): Locator {
        return this.cartRows.nth(index).locator('td.cart_quantity button');
    }

    getProductTotalLocator(index: number): Locator {
        return this.cartRows.nth(index).locator('td.cart_total p.cart_total_price');
    }

    // Ödeme aşamasına (Checkout) geç metodu
    async proceedToCheckout() {
        await this.proceedToCheckoutBtn.click();
    }

    // Belirli bir ürünü sepetten silme metodu
    async deleteProductFromCart(index: number) {
        await this.deleteButtons.nth(index).click();
    }
}

import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { HomePage } from '../pages/HomePage';

//sayfa nesnelerini içeren bir fixture oluşturuyoruz
type MyFixtures = {
    loginPage: LoginPage;
    productsPage: ProductsPage;
    cartPage: CartPage;
    homePage: HomePage;
}

//Playwright'in test fonksiyonunu genişleterek kendi fixture'ımızı ekliyoruz
export const test = base.extend<MyFixtures>({

    // Global Page Fixture overrides to block Ads
    page: async ({ page }, use) => {
        // Reklam ve analiz ağ isteklerini (network requests) iptal ederek sayfa yüklemesini hızlandırıp kaymaları önlüyoruz
        await page.route('**/*', (route) => {
            const blockedDomains = [
                'googleads.g.doubleclick.net',
                'adservice.google.com',
                'pagead2.googlesyndication.com',
                'www.google-analytics.com',
                'cdn.carbonads.com',
                'srv.carbonads.net',
                'fundingchoicesmessages.google.com' // Consent form domain
            ];

            const url = route.request().url();
            if (blockedDomains.some(domain => url.includes(domain))) {
                route.abort(); // Reklam isteğini engelle
            } else {
                route.continue(); // Diğer isteklere izin ver
            }
        });

        // DOM seviyesinde çıkabilecek reklam veya consent (onay) pencerelerini gizleyen/silen script enjekte ediyoruz
        await page.addInitScript(() => {
            // Sayfa yüklendiğinde ve belli aralıklarla reklam containerlarını temizle
            setInterval(() => {
                const adsAndModals = document.querySelectorAll('.fc-dialog-container, iframe[id^="aswift"], iframe[name^="aswift"], .adsbygoogle');
                adsAndModals.forEach(el => el.remove());
            }, 500); // Her yarım saniyede bir kontrol edip sil
        });

        await use(page);
    },

    //loginPage fixture'ını tanımlıyoruz
    loginPage: async ({ page }, use) => {
        //Sayfayı oluştur ve kullanıma hazır hale getir
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    //productsPage fixture'ını tanımlıyoruz
    productsPage: async ({ page }, use) => {
        const productsPage = new ProductsPage(page);
        await use(productsPage);
    },
    //cartPage fixture'ını tanımlıyoruz
    cartPage: async ({ page }, use) => {
        const cartPage = new CartPage(page);
        await use(cartPage);
    },
    //homePage fixture'ını tanımlıyoruz
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },
});

export { expect } from '@playwright/test';


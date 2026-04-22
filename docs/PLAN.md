# ProjectRazer — Plan & Roadmap

> **Bu dosya, kullanıcı ve Claude arasındaki kalıcı yol haritasıdır.**
> Sohbet sıfırlansa bile ilerleme buradan takip edilir. Bir madde tamamlandığında durum ✅ olarak işaretlenir.

## Context

ProjectRazer, **automationexercise.com** hedefine karşı yazılmış bir Playwright + TypeScript test otomasyon projesidir. POM (Page Object Model) yapısı, fixture tabanlı dependency injection ve reklam engelleyici bir network interceptor ile kurulmuştur.

Bu döküman iki ana çıktıyı içerir:

1. **Kod incelemesi** — mevcut POM/fixture/test yapısındaki iyileştirme alanları.
2. **Kapsam boşluk analizi** — automationexercise.com'un `/test_cases` sayfasında yayımlanan 26 resmi test case'i ile mevcut spec'ler karşılaştırılarak, **kapsanmayan** case'lerin **öncelik sırasına** göre listesi.

Amaç: testlere hangi sırayla yeni senaryo ekleneceğine dair netlik sağlamak ve mevcut kodun teknik borcunu belirlemek.

---

## Bölüm 1 — Kod İncelemesi

Mevcut yapı sağlam temelli (POM + fixture + ad-block), fakat aşağıdaki iyileştirmeler öncelikli:

### P1 — Düzeltilmesi şart olanlar

- [x] **1. Sabit kodlanmış kimlik bilgileri** — `.env` + `dotenv` ile `process.env.TEST_USER_EMAIL` / `TEST_USER_PASSWORD`'e taşındı. `.env.example` repo'ya eklendi, gerçek `.env` gitignore'da.

- [x] **2. Kırılgan absolute XPath'ler** — `auth.spec.ts`'deki position-based XPath'ler temizlendi; `LoginPage.loginErrorMessage` (text-based `getByText`), `HomePage.loggedInAsUser` (role-based `:has-text`) eklendi.

- [x] **3. `baseURL` ayarsız** — `playwright.config.ts`'e `baseURL: process.env.BASE_URL` eklendi; tüm testlerde hardcoded URL → `page.goto('/')` / POM'da `page.goto('/login')`.

### P2 — Kalite iyileştirmeleri

- [ ] **4. `ProductsPage.productPrice` locator'ı fazla kırılgan**
  - `src/pages/ProductsPage.ts:49` → `page.locator('span > span').first()`.
  - **Çözüm**: `.product-information span span` veya text-regex.

- [x] **5. `ProductsPage.searchProduct()` ölü kod** — TC9 ile aktive edildi; navigation wait + case-insensitive header regex ile sağlamlaştırıldı.

- [ ] **6. Ad-block init script sonsuz `setInterval`**
  - `src/fixtures/baseTest.ts:51` — 500 ms'de bir çalışır. `MutationObserver` daha temiz. Opsiyonel.

- [ ] **7. Dil tutarsızlığı**
  - `test.describe` başlıkları Türkçe, yorum/değişken İngilizce. Başlıkları da İngilizce'ye al.

### P3 — Kozmetik

- [ ] **8. Dosya adlandırma**: `removeitemfromcart.spec.ts` → `removeItemFromCart.spec.ts`.
- [x] **9. Kullanılmayan metod**: `LoginPage.getLoginHeader()` kaldırıldı.
- [ ] **10. Uncommitted değişiklik**: `tests/negativeRegister.spec.ts` git status M — commit et veya geri al.

---

## Bölüm 2 — Kapsanmayan Test Case'ler (Öncelik Sıralı)

automationexercise.com'da **26 resmi test case** var. Mevcut coverage:

| Durum | Case No | Not |
|---|---|---|
| ✅ Tam kapsanıyor | 1, 2, 3, 5, 16, 17 | register, auth (valid/invalid), duplicate email, login-before-checkout, remove from cart |
| ⚠️ Kısmi kapsanıyor | 8, 13, 18 | Aşağıda açıklandı |
| ❌ Kapsanmıyor | 4, 6, 7, 9, 10, 11, 12, 14, 15, 19, 20, 21, 22, 23, 24, 25, 26 | **17 case** |

### 🔴 P1 — Kritik

- [x] **TC4: Logout User** — `tests/logout.spec.ts` yazıldı. `HomePage.logoutLink` + `logout()` eklendi. Yeşil.
- [x] **TC9: Search Product** — `tests/searchProduct.spec.ts` yazıldı. Google vignette interstitial bypass'ı ile stabilize edildi (`#google_vignette` check + URL fallback). Yeşil.
- [x] **TC12: Add Multiple Products in Cart** — `tests/multipleCart.spec.ts` yazıldı. `ProductsPage`'e `productCards`, `addProductToCartByIndex()`, `continueShopping()` eklendi. Yeşil.
- [ ] **TC14: Place Order — Register while Checkout** — Guest checkout → kayıt → ödeme. **Guest flow hiç test edilmiyor.**
- [ ] **TC20: Search Products and Verify Cart After Login** — Guest cart + login → sepet korunmuş mu? Session persistence.
- [ ] **TC23: Verify Address Details in Checkout Page** — Kayıt adresi ↔ checkout adresi uyumu. Data integrity.

### 🟡 P2 — Önemli

- [ ] **TC8: Verify All Products and Product Detail Page** (kısmi) — `/products` listesi doğrulaması eksik.
- [ ] **TC15: Place Order — Register Before Checkout** — TC14'ün alternatifi; farklı user-state akışı.
- [ ] **TC18: View Category Products** (kısmi) — Men kategorisi ve alt kategoriler de test edilmeli.
- [ ] **TC19: View & Cart Brand Products** — Brand filtreleme + sepete ekleme.
- [ ] **TC21: Add Review on Product** — Review submit + form validasyon + success message.
- [ ] **TC24: Download Invoice After Purchase Order** — `page.waitForEvent('download')`.
- [ ] **TC6: Contact Us Form** — `setInputFiles` ile file upload kullanımı.

### 🟢 P3 — Düşük

- [ ] **TC10: Verify Subscription in Home Page** — Footer email subscription.
- [ ] **TC11: Verify Subscription in Cart Page** — TC10'un cart varyantı.
- [ ] **TC22: Add to Cart from Recommended Items** — Anasayfa recommended bölümü.
- [ ] **TC7: Verify Test Cases Page** — Basit navigasyon.
- [ ] **TC25: Verify Scroll Up Using Arrow Button** — UI scroll.
- [ ] **TC26: Verify Scroll Up Without Arrow Button** — TC25'in manuel varyantı.

---

## Önerilen Uygulama Sırası

**Sprint 1 (P1 temizliği)**: Kod P1 (env vars, XPath POM, `baseURL`) + P1 test case'ler (TC4, TC9, TC12, TC14, TC20, TC23).

**Sprint 2 (P2 genişleme)**: P2 test case'ler (TC8, TC15, TC18-Men, TC19, TC21, TC24, TC6) + P2 kod iyileştirmeleri.

**Sprint 3 (P3 cilalama)**: Kalan 6 P3 case + kozmetik kod düzenlemeleri.

---

## Değiştirilecek/Eklenecek Kritik Dosyalar

- `playwright.config.ts` — `baseURL`, `dotenv`.
- `.env` (yeni) — test kullanıcı bilgileri; `.gitignore`'a eklenecek.
- `src/pages/LoginPage.ts` — `loginErrorMessage`, `logoutLink`, `logout()`.
- `src/pages/HomePage.ts` — `loggedInAsUser`, `subscriptionEmail`, footer locator'ları; Men alt link'leri.
- `src/pages/ProductsPage.ts` — fiyat locator'ı sağlamlaştır; review form; brand section.
- `src/pages/CheckoutPage.ts` — delivery/billing address locator'ları (TC23).
- Yeni sayfa sınıfları: `src/pages/ContactUsPage.ts`, `src/pages/SubscriptionFooter.ts`.
- Yeni spec'ler: `tests/logout.spec.ts`, `tests/searchProduct.spec.ts`, `tests/multipleCart.spec.ts`, `tests/registerDuringCheckout.spec.ts`, `tests/sessionPersistCart.spec.ts`, `tests/checkoutAddress.spec.ts`.

---

## Doğrulama

1. Yeni POM locator'ları `npx playwright test --headed` ile manuel kontrol.
2. Her yeni spec izole: `npx playwright test tests/<spec>.spec.ts`.
3. Tam suite: `npx playwright test` — flake-free.
4. Rapor: `npx playwright show-report`.
5. `.env.example` repo'ya eklenmeli; gerçek `.env` `.gitignore`'da.

---

## Bilinen Sorunlar & Tuzaklar

- **Google Vignette Interstitial**: automationexercise.com bazen ilk click'i `#google_vignette` reklamıyla yutuyor. Tıklamadan sonra URL'de `#google_vignette` varsa sayfaya zorla yeniden git; form submit sonrası beklenen query param yoksa (`search=...` vb.) URL'i manuel kur. TC9'da uygulandı, benzer testlerde örnek alınabilir.
- **Site aşırı yük / rate limit**: Paralel koşumda "This website is under heavy load (queue full)" hatası çıkabiliyor. `workers=1` ayarlandı; gerekirse `retries` artırılır.
- **CSS text-transform uppercase**: Header'lar DOM'da kamel case ama ekranda BÜYÜK (ör. `SEARCHED PRODUCTS`). `hasText: string` case-sensitive → regex (`/.../i`) kullan.
- **Modal animasyon timing**: Bootstrap modal `#cartModal` ilk `viewCartModalLink.click()` denemesinde hidden olabiliyor. `waitFor({ state: 'visible', timeout: 15000 })` eklendi.

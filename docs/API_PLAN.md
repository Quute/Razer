# API Testing Roadmap and Implementation Plan

I have reviewed the `api_list` page of our target website (Automation Exercise). A total of 14 official API test scenarios are listed. We will use Playwright's powerful API testing infrastructure (`request` fixture) to automate them.

## Current API Scenarios (14 Total)

**Products APIs:**
- [x] API 1: `GET /api/productsList` (200 - Get all products)
- [x] API 2: `POST /api/productsList` (405 - Unsupported method)
- [x] API 5: `POST /api/searchProduct` (200 - Valid search)
- [x] API 6: `POST /api/searchProduct` (400 - Invalid search without parameter)

**Brands APIs:**
- [x] API 3: `GET /api/brandsList` (200 - Get all brands)
- [x] API 4: `PUT /api/brandsList` (405 - Unsupported method)

**User & Auth APIs:**
- [x] API 7: `POST /api/verifyLogin` (200 - Valid login)
- [x] API 8: `POST /api/verifyLogin` (400 - Login with missing parameter)
- [x] API 9: `DELETE /api/verifyLogin` (405 - Unsupported method)
- [x] API 10: `POST /api/verifyLogin` (404 - Invalid login)
- [x] API 11: `POST /api/createAccount` (201 - Create account)
- [x] API 12: `DELETE /api/deleteAccount` (200 - Delete account)
- [x] API 13: `PUT /api/updateAccount` (200 - Update account)
- [x] API 14: `GET /api/getUserDetailByEmail` (200 - Get details by email)

---

## Proposed Architecture and Flow

We will configure the API tests within the same project as the UI tests, but in a separate `tests/api/` folder to avoid mixing them. This way, we can run only the API tests by executing `npx playwright test tests/api/`.

We will divide the 14 tests into 3 different files based on logical groups:

1. [x] **`tests/api/products.spec.ts`**: API 1, 2, 5, 6
2. [x] **`tests/api/brands.spec.ts`**: API 3, 4
3. [x] **`tests/api/auth.spec.ts`**: API 7, 8, 9, 10, 11, 12, 13, 14

### Coding Strategy
* Playwright's `const response = await request.post(...)` structure will be used.
* JSON responses will be parsed (`response.json()`), and status codes, messages, and data within the body will be verified (`expect(response.status()).toBe(200)`).
* Test data for each file (e.g., registered user info or product names to search) will be set dynamically or statically (via env) per test.
* Tests will run directly over the network in seconds without launching the UI (browser will not be started).

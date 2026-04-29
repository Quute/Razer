# ProjectRazer - E2E Test Automation

ProjectRazer is an End-to-End (E2E) testing automation framework built for [Automation Exercise](https://automationexercise.com) using **Playwright** and **TypeScript**. 

The framework is designed with best practices such as the **Page Object Model (POM)** pattern, fixture-based dependency injection, and a built-in ad-blocker network interceptor for a robust and stable testing experience.

## 🚀 Features

- **Playwright & TypeScript**: Modern and fast browser automation.
- **Page Object Model (POM)**: Highly maintainable and reusable page classes.
- **Ad-Blocker Interceptor**: A custom `MutationObserver`-based script to block Google vignette ads and popups dynamically, reducing test flakiness.
- **Environment Management**: Secure handling of credentials via `.env` files.
- **CI/CD Ready**: Configured to run flawlessly on GitHub Actions.

## 📁 Project Structure

```text
ProjectRazer/
├── docs/               # Project plans and roadmaps
├── src/
│   ├── pages/          # Page Object classes (POM)
│   └── fixtures/       # Custom Playwright fixtures
├── tests/              # E2E test specifications
├── .env.example        # Example environment variables file
├── playwright.config.ts# Playwright configuration
└── package.json        # Dependencies and scripts
```

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Quute/Razer.git
   cd ProjectRazer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Copy the example environment file and configure it with your test credentials:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and fill in your valid credentials:
   ```env
   BASE_URL=https://automationexercise.com
   TEST_USER_EMAIL=your_test_email@example.com
   TEST_USER_PASSWORD=your_password
   ```

4. **Install Playwright Browsers:**
   ```bash
   npx playwright install chromium
   ```

## 🧪 Running Tests

- **Run all tests in headless mode:**
  ```bash
  npx playwright test
  ```

- **Run tests in headed mode (with UI):**
  ```bash
  npx playwright test --headed
  ```

- **Run a specific test file:**
  ```bash
  npx playwright test tests/login.spec.ts
  ```

- **View Test Report:**
  ```bash
  npx playwright show-report
  ```

## 📈 Test Coverage

This project aims to automate all 26 official test cases from the Automation Exercise platform. We continuously update our test suite. For a detailed roadmap and current coverage status, please refer to the `docs/PLAN.md` file.

## 📝 License

This project is licensed under the ISC License.

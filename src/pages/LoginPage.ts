import { Locator, Page } from "@playwright/test";


export class LoginPage {
     readonly page: Page;
     readonly emailInput: Locator;
     readonly passwordInput: Locator;
     readonly loginButton: Locator;
     readonly loginHeader: Locator;
     readonly signupNameInput: Locator;
     readonly signupEmailInput: Locator;
     readonly signupButton: Locator;    
    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('[data-qa="login-email"]');
            this.passwordInput = page.locator('[data-qa="login-password"]');
        this.loginButton = page.locator('[data-qa="login-button"]');
        this.loginHeader = page.locator('[data-qa="login-header"]');
        
        // If you also added the Signup part:
        this.signupNameInput = page.locator('[data-qa="signup-name"]');
        this.signupEmailInput = page.locator('[data-qa="signup-email"]');
        this.signupButton = page.locator('[data-qa="signup-button"]');
    }

    async navigate() {
        await this.page.goto('https://automationexercise.com/login');
    }
    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }   
    async getLoginHeader(){
        return this.loginHeader;
    }




}
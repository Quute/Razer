import { Locator, Page } from "@playwright/test";

export class ContactUsPage {
    readonly page: Page;
    readonly getInTouchHeader: Locator;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly subjectInput: Locator;
    readonly messageTextarea: Locator;
    readonly fileUploadInput: Locator;
    readonly submitButton: Locator;
    readonly successMessage: Locator;
    readonly homeButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // Text is actually "GET IN TOUCH" but hasText is case-insensitive if not strict, or we can use regex.
        // The CSS text-transform makes it uppercase, DOM text is "Get In Touch".
        this.getInTouchHeader = page.locator('h2.title', { hasText: /Get In Touch/i });
        this.nameInput = page.locator('[data-qa="name"]');
        this.emailInput = page.locator('[data-qa="email"]');
        this.subjectInput = page.locator('[data-qa="subject"]');
        this.messageTextarea = page.locator('[data-qa="message"]');
        this.fileUploadInput = page.locator('input[name="upload_file"]');
        this.submitButton = page.locator('[data-qa="submit-button"]');
        this.successMessage = page.locator('.status.alert.alert-success');
        this.homeButton = page.locator('a.btn.btn-success', { hasText: 'Home' });
    }

    async fillForm(name: string, email: string, subject: string, message: string) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.subjectInput.fill(subject);
        await this.messageTextarea.fill(message);
    }

    async uploadFile(filePath: string) {
        await this.fileUploadInput.setInputFiles(filePath);
    }

    async submitForm() {
        await this.submitButton.click();
    }

    async goHome() {
        await this.homeButton.click();
    }
}

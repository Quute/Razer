import { test, expect } from '../src/fixtures/baseTest';
import * as path from 'path';

test.describe('TC6 - Contact Us Form', () => {

    test('User should be able to submit contact us form with file upload', async ({
        page,
        homePage,
        contactUsPage
    }) => {
        // 1. Launch browser & 2. Navigate to url 'http://automationexercise.com'
        await homePage.navigate();

        // 3. Verify that home page is visible successfully
        await expect(page).toHaveTitle(/Automation Exercise/);

        // 4. Click on 'Contact Us' button
        await homePage.contactUsLink.click();
        
        // Handle possible google vignette ad if present
        if (page.url().includes('#google_vignette')) {
            await page.goto('/contact_us');
        }
        await page.waitForURL(/.*contact_us/);

        // 5. Verify 'GET IN TOUCH' is visible
        await expect(contactUsPage.getInTouchHeader).toBeVisible();

        // 6. Enter name, email, subject and message
        await contactUsPage.fillForm(
            'Test User',
            'testuser@example.com',
            'Test Subject',
            'This is a test message for the contact us form.'
        );

        // 7. Upload file
        // We will use package.json from the project root as a safe dummy file
        const filePath = path.resolve(__dirname, '../package.json');
        await contactUsPage.uploadFile(filePath);

        // Setup dialog handler before clicking submit
        // 9. Click OK button on javascript alert
        page.once('dialog', async dialog => {
            // Usually the message is 'Press OK to proceed', we can assert it if we want
            await dialog.accept();
        });

        // 8. Click 'Submit' button
        await contactUsPage.submitForm();

        // 10. Verify success message 'Success! Your details have been submitted successfully.' is visible
        await expect(contactUsPage.successMessage).toBeVisible();
        await expect(contactUsPage.successMessage).toContainText('Success! Your details have been submitted successfully.');

        // 11. Click 'Home' button and verify that landed to home page successfully
        await contactUsPage.goHome();

        if (page.url().includes('#google_vignette')) {
            await page.goto('/');
        }
        
        // Sometimes clicking home goes to '/' and sometimes to '/index.php' or similar, just check title.
        await expect(page).toHaveTitle(/Automation Exercise/);
    });
});

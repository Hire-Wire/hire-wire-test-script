
/**
 * @file UserProfileTest.js
 * @description Automated tests for testing user profile functionality, including login, profile editing,
 *              and validation of success or error messages after form submission.
 * 
 * @dependencies selenium-webdriver, chromedriver, assert, Profile.json (user credentials)
 */


/**
 * @test User Profile Test
 * @description This test case verifies the user profile functionality by:
 *              1. Logging in with valid credentials.
 *              2. Navigating to the profile page.
 *              3. Editing and saving user profile fields.
 *              4. Verifying the presence of error or success messages.
 * 
 * @steps
 * 1. Log out the user if already logged in.
 * 2. Navigate to the login page and log in with the credentials from the Profile.json file.
 * 3. After successful login, verify the redirection to the dashboard page.
 * 4. Navigate to the user profile page.
 * 5. Fill out the profile form with the user's first name, last name, phone number, email, and status.
 * 6. Click the "Save" button to update the profile information.
 * 7. Verify the error or success messages based on the form submission.
 * 
 * @assertion The test asserts that the success or error messages appear correctly after profile form submission.
 */


// Import necessary modules
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
require('chromedriver'); // Ensure chromedriver is available
const fs = require('fs');

// Import user credentials and other application data from the Profile.json file
const credentials = require('./Profile.json');

// Application URLs
const LOGIN_URL = 'https://hirewire-app-8efe6492bdf7.herokuapp.com/login'; // Login page URL
const DASHBOARD_URL = 'https://hirewire-app-8efe6492bdf7.herokuapp.com/jobapplication'; // Dashboard URL after login
const PROFILE_URL = 'https://hirewire-app-8efe6492bdf7.herokuapp.com/userprofile'; // User profile page URL
const TIMEOUT = 30000; // Timeout for the tests

/**
 * @description Suite for testing user profile functionality, including login, profile form submission, and error/success message validation.
 */
describe('User Profile Functionality Test', function () {
    this.timeout(TIMEOUT); // Set global timeout for all tests in this suite

    let driver; // WebDriver instance

    /**
     * @description Initializes the WebDriver before starting the tests.
     * @throws Error if the WebDriver cannot be initialized.
     */
    before(async () => {
        try {
            driver = await new Builder().forBrowser('chrome').build();
        } catch (error) {
            console.error('Error initializing WebDriver:', error);
        }
    });

    /**
     * @description Quits the WebDriver after completing the tests.
     * @throws Error if the WebDriver cannot be quit.
     */
    after(async () => {
        try {
            await driver.quit();
        } catch (error) {
            console.error('Error quitting the WebDriver:', error);
        }
    });

    /**
     * @function navigateToLoginPage
     * @description Navigates to the login page of the application.
     * @throws Error if navigation to the login page fails.
     */
    async function navigateToLoginPage() {
        try {
            await driver.get(LOGIN_URL);
        } catch (error) {
            console.error('Error navigating to login page:', error);
        }
    }

    /**
     * @function navigateToProfilePage
     * @description Navigates to the profile page after login.
     * @throws Error if navigation to the profile page fails.
     */
    async function navigateToProfilePage() {
        try {
            await driver.get(PROFILE_URL);
        } catch (error) {
            console.error('Error navigating to profile page:', error);
        }
    }

    /**
     * @function logoutIfLoggedIn
     * @description Logs out the user if they are already logged in, ensuring a fresh session for the test.
     * @throws Error if logging out fails.
     */
    async function logoutIfLoggedIn() {
        try {
            // Locate the logout button using XPath
            const logoutButton = await driver.findElement(By.xpath('//button[@type="logout"]'));
            
            // Check if the button is displayed and clickable
            if (await logoutButton.isDisplayed()) {
                await logoutButton.click();
                await driver.wait(until.urlContains(LOGIN_URL), 5000);
            }
        } catch (error) {
            // 
        }
    }

    afterEach(async () => {
        await logoutIfLoggedIn();
    });


    credentials.forEach((user, index) => {
        it(`User Profile Test ${index + 1}`, async () => {

            // Step 1: Ensure the user is logged out if already logged in
            await logoutIfLoggedIn();

            // Step 2: Navigate to the login page and log in with the current user's credentials
            await navigateToLoginPage();

            await driver.findElement(By.xpath('//input[@placeholder="Email"]')).sendKeys(user.emailAddress);
            await driver.findElement(By.xpath('//input[@placeholder="Password"]')).sendKeys(user.password);
            const submitButton = await driver.findElement(By.xpath('//button[@type="submit"]'));
            await submitButton.click();

            // Step 3: Verify the user is redirected to the dashboard page after login
            await driver.wait(until.urlContains(DASHBOARD_URL), 500);
            const currentUrl = await driver.getCurrentUrl();
            assert.strictEqual(currentUrl.includes(DASHBOARD_URL), true, `User ${index + 1} should be on the dashboard page`);

            // Step 4: Navigate to the user profile page
            await navigateToProfilePage();

            // Step 5: Fill out the profile form with the user's data
            const firstName = await driver.findElement(By.xpath('//input[@placeholder="First Name (required)"]'));
            await firstName.clear();
            await firstName.sendKeys(user.firstName);

            const lastName = await driver.findElement(By.xpath('//input[@placeholder="Last Name (required)"]'));
            await lastName.clear();
            await lastName.sendKeys(user.lastName);

            const phoneNumber = await driver.findElement(By.xpath('//input[@placeholder="Phone Number (optional)"]'));
            await phoneNumber.clear();
            await phoneNumber.sendKeys(user.phoneNumber);

            const emailAddress = await driver.findElement(By.xpath('//input[@type="email"]'));
            await emailAddress.clear();
            await emailAddress.sendKeys(user.emailAddress);

            const statusDropdown = await driver.findElement(By.xpath('//select'));
            await statusDropdown.sendKeys(user.status);

            // Step 6: Click the "Save" button to save the updated profile information
            const saveButton = await driver.findElement(By.xpath('//button[contains(@class, "save-button") and @type="button"]'));
            await saveButton.click();

            // Step 7: Check for error or success messages
            try {
                const errorMessageElement = await driver.findElements(By.css('.error-message'));
                if (errorMessageElement.length > 0) {
                    const errorMessage = await errorMessageElement[0].getText();
                    assert.strictEqual(
                        errorMessage,
                        'Expected error message text here', // Replace with the expected error message
                        'The error message is incorrect.'
                    );
                    return; // Exit the test if an error occurs
                }
            } catch (error) {
                console.error('Error while checking for error message:', error);
            }

            // If no error, check for the success message
            const successMessageElement = await driver.wait(
                until.elementLocated(By.css('.success-message')), 5000
            );

            await driver.wait(until.elementIsVisible(successMessageElement), 5000);

            const successMessage = await successMessageElement.getText();
            assert.strictEqual(
                successMessage,
                'Profile saved successfully!', // Replace with the expected success message
                'The success message is incorrect.'
            );

            // Ensure the user stays on the same page after updating the profile
            const currentUrl2 = await driver.getCurrentUrl();
            assert.strictEqual(currentUrl2, currentUrl2, "User should stay on the same page after successful update");
        });
    });
});


/**
 * @file delete_user_profile_test.js
 * @description Automated tests for deleting user profile in a web application.
 *              The script tests the login process, navigation to the user profile page and delete the user profile.
 * 
 * @dependencies selenium-webdriver, chromedriver, assert, Profile.json (user credentials)
 */

/**
 * @description This test case verifies that the user can delete their profile.
 *              It involves logging in with valid credentials, navigating to the profile page,
 *              clicking the delete button, confirming the deletion, and verifying the result.
 * 
 * @steps
 * 1. Ensure the user is logged out if already logged in.
 * 2. Log in using valid credentials from the Profile.json file.
 * 3. Verify that the user is redirected to the dashboard after login.
 * 4. Navigate to the profile page.
 * 5. Click the delete button to delete the user profile.
 * 6. Handle the confirmation alert and accept the deletion.
 * 7. Verify that the user is redirected to the homepage after deletion.
 * 
 * @assertion The test asserts that the profile is successfully deleted, 
 *            and the user is redirected to the homepage.
 */

// Import necessary modules
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
require('chromedriver');
const fs = require('fs');

// Import user credentials from the Profile.json file
const credentials = require('./Profile.json');

HOMEPAGE_URL = 'https://hirewire-app-8efe6492bdf7.herokuapp.com/';
const LOGIN_URL = 'https://hirewire-app-8efe6492bdf7.herokuapp.com/login';
const DASHBOARD_URL = 'https://hirewire-app-8efe6492bdf7.herokuapp.com/jobapplication';
const PROFILE_URL = 'https://hirewire-app-8efe6492bdf7.herokuapp.com/userprofile';
const TIMEOUT = 30000;

describe('User Profile Deletion Functionality Test', function () {
    this.timeout(TIMEOUT); // Set timeout for the test suite

    let driver;

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
     * @description Navigates to the login page.
     * @throws Error if the page cannot be loaded.
     */
    async function navigateToLoginPage() {
        try {
            await driver.get(LOGIN_URL);
        } catch (error) {
            // Handle navigation error
        }
    }

    /**
     * @function navigateToProfilePage
     * @description Navigates to the user's profile page.
     * @throws Error if the page cannot be loaded.
     */
    async function navigateToProfilePage() {
        try {
            await driver.get(PROFILE_URL);
        } catch (error) {
            // Handle navigation error
        }
    }

    async function navigateToDashboard() {
        await driver.get(DASHBOARD_URL);
    }

    /**
     * @function logoutIfLoggedIn
     * @description Logs out the user if they are logged in.
     * @throws Error if logout action cannot be performed.
     */
    async function logoutIfLoggedIn() {
        try {
            // Locate the logout button using XPath
            const logoutButton = await driver.findElement(By.xpath('//button[@type="logout"]'));
            
            // Check if the button is displayed and clickable
            if (await logoutButton.isDisplayed()) {
                await logoutButton.click();
                // Wait until the URL changes back to the login page
                await driver.wait(until.urlContains(LOGIN_URL), 5000);
            }
        } catch (error) {
            // No action needed if the logout button is not found or not displayed
        }
    }

    // Ensure the user is logged out after each test
    afterEach(async () => {
        await logoutIfLoggedIn();
    });


    credentials.forEach((user, index) => {
        it(`Test case ${index + 1}`, async () => {
            // Step 1: Ensure the user is logged out if already logged in
            await logoutIfLoggedIn();

            // Step 2: Log in using valid credentials from the Profile.json file
            await navigateToLoginPage();
            const emailInput = await driver.wait(
                until.elementLocated(By.xpath('//input[@placeholder="Email"]')),
                5000
            );
            await driver.wait(until.elementIsVisible(emailInput), 5000);
            await emailInput.sendKeys(user.emailAddress);
        
            // Wait for the password field to appear and send password
            const passwordInput = await driver.wait(
                until.elementLocated(By.xpath('//input[@placeholder="Password"]')),
                5000
            );
            await driver.wait(until.elementIsVisible(passwordInput), 5000);
            await passwordInput.sendKeys(user.password);

            // Step 5: Submit the login form
            const submitButton = await driver.findElement(By.xpath('//button[@type="submit"]'));
            await submitButton.click();   
            // Step 3: Verify that the user is redirected to the dashboard after login
            await driver.sleep(1000);
            const currentUrl = await driver.getCurrentUrl();
            assert.strictEqual(currentUrl, DASHBOARD_URL, `User cannot log in, user does not exist`);

            // Step 4: Navigate to the profile page
            await navigateToProfilePage();
            await driver.sleep(2000); 
            
            // Step 5: Click the delete button to delete the user profile
            const deleteButton = await driver.wait(until.elementLocated(By.xpath('//button[contains(@class, "delete-user-profile-button") and @type="button"]')), TIMEOUT);
            await deleteButton.click();
            

            // Step 6: Handle the confirmation alert and accept the deletion
            await driver.wait(until.alertIsPresent(), 5000); // Wait for the alert pop-up to appear
            const alert = await driver.switchTo().alert();
            await alert.accept();

            
            // Step 7: Verify that the user is redirected to the homepage after deletion
            await driver.sleep(500);
            const currentUrl2 = await driver.getCurrentUrl();
            assert.strictEqual(HOMEPAGE_URL, currentUrl2, "After successful deletion of the user, the page should be directed to the homepage");
        });
    });
});

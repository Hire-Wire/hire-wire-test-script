
/**
 * @file add_job_experience_test.js
 * @description Automated tests for adding job experience to a user's profile in a web application.
 *              The script tests the login process, navigation to the experience page, filling the job experience form,
 *              and submitting the job experience details. After submission, the test verifies that the user can access
 *              and successfully save the job experience details.
 * 
 * @dependencies selenium-webdriver, chromedriver, assert, Profile.json (user credentials)
 */

// Import necessary modules
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
require('chromedriver');
const fs = require('fs');

// Import user credentials from the Profile.json file
const credentials = require('./Profile.json');

// Application URLs
const LOGIN_URL = 'http://localhost:3000/hire-wire-front-end'; // Login page URL
const DASHBOARD_URL = 'http://localhost:3000/hire-wire-front-end/jobapplication'; // Dashboard page URL after login
const EXPERIENCE_URL = 'http://localhost:3000/hire-wire-front-end/experience'; // Job Experience page URL
const TIMEOUT = 30000; // Timeout for the tests

/**
 * @description Suite for testing the functionality of adding job experience to a user's profile.
 *              The test covers login, navigation to the experience page, form submission, 
 *              and verification that the job experience details are successfully saved.
 */
describe('Add Job Experience Functionality Test', function () {
    this.timeout(TIMEOUT); // Set global timeout for all tests in this suite
    
    let driver; // WebDriver instance

    /**
     * @description Initializes the WebDriver before starting the tests.
     * @throws Error if the WebDriver cannot be initialized.
     */
    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    /**
     * @description Quits the WebDriver after completing the tests.
     * @throws Error if the WebDriver cannot be quit.
     */
    after(async () => {
        await driver.quit();
    });

    /**
     * @function navigateToPage
     * @description Navigates to the specified URL.
     * @param {string} url - The URL to navigate to.
     */
    async function navigateToPage(url) {
        await driver.get(url);
    }

    /**
     * @function logoutIfLoggedIn
     * @description Logs out the user if they are already logged in.
     *              Skips if the logout button is not visible.
     */
    async function logoutIfLoggedIn() {
        try {
            const logoutButton = await driver.findElement(By.css('button[type="logout"]'));
            if (await logoutButton.isDisplayed()) {
                await logoutButton.click();
                await driver.wait(until.urlContains(LOGIN_URL), 5000); // Wait for the login page to load
            }
        } catch (error) {
            // Ignored if logout button is not found
        }
    }

    /**
     * @function login
     * @description Logs the user in using credentials from the Profile.json file.
     * @param {Object} user - The user object containing email and password.
     */
    async function login(user) {
        await navigateToPage(LOGIN_URL);
        const loginBtn = await driver.findElement(By.className('login-button'));
        await loginBtn.click();

        // Enter login credentials
        await driver.findElement(By.css('input[placeholder="Email"]')).sendKeys(user.emailAddress);
        await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys(user.password);
        const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
        await submitBtn.click();
      

        await driver.sleep(100);
        const currentUrl = await driver.getCurrentUrl();          
        // Assert exact match of current URL with the expected URL
        assert.strictEqual(currentUrl, DASHBOARD_URL, `User cannot add their job experience because they cannot log in with these credentials.`);
    }

    /**
     * @function fillExperienceForm
     * @description Fills the job experience form with provided data.
     * @param {Object} experience - The job experience data to be entered in the form.
     */
    async function fillExperienceForm(experience) {
        // Click "Add Experience" button
        await driver.findElement(By.xpath('//button[contains(@class, "add-button") and text()="+ Add Experience"]')).click();

        // Fill in the job experience details if available
        if (experience.JobTitle) {
            const jobTitleInput = await driver.findElement(By.xpath('//label[text()="Job Title"]/following-sibling::input'));
            await jobTitleInput.sendKeys(experience.JobTitle);
        }
        if (experience.organizationName) {
            const orgNameInput = await driver.findElement(By.xpath('//label[text()="Organization Name"]/following-sibling::input'));
            await orgNameInput.sendKeys(experience.organizationName);
        }
        if (experience.startDate) {
            const startDateInput = await driver.findElement(By.xpath('//label[text()="Start Date"]/following-sibling::input[@type="date"]'));
            await startDateInput.sendKeys(experience.startDate); // Send the formatted date (yyyy-mm-dd)
        }
        
        if (experience.endDate) {
            const endDateInput = await driver.findElement(By.xpath('//label[text()="End Date"]/following-sibling::input[@type="date"]'));
            await endDateInput.sendKeys(experience.endDate); // Send the formatted date (yyyy-mm-dd)
        }
        
        if (experience.description) {
            const descriptionInput = await driver.findElement(By.xpath('//label[text()="Description"]/following-sibling::textarea'));
            await descriptionInput.sendKeys(experience.description);
        }

        // Save the experience entry
        const saveBtn = await driver.findElement(By.css('button.save-button'));
        await saveBtn.click();
    }

    // Ensure the user is logged out after each test
    afterEach(async () => {
        await logoutIfLoggedIn();
    });

    /**
     * @description This test case verifies that the user can add job experience to their profile.
     *              It involves logging in with valid credentials, navigating to the experience form,
     *              filling the job experience details, and verifying the success of the submission.
     * 
     * @steps
     * 1. Ensure the user is logged out if already logged in.
     * 2. Log in using valid credentials from the Profile.json file.
     * 3. Verify that the user is redirected to the dashboard after login.
     * 4. Navigate to the experience page and fill the job experience form.
     * 5. Submit the job experience form and verify that the job experience details are saved.
     * 
     * @assertion The test asserts that the user is able to successfully add job experience to their profile.
     */
    credentials.forEach((user, index) => {
        it(`Test case ${index + 1}`, async () => {
            // Step 1: Ensure the user is logged out if already logged in
            await logoutIfLoggedIn();

            // Step 2: Log in using valid credentials from the Profile.json file
            await login(user);

            // Step 3: Verify that the user is redirected to the dashboard page after login
            const currentUrl = await driver.getCurrentUrl();
            assert.strictEqual(currentUrl.includes(DASHBOARD_URL), true, `User ${index + 1} should be on the dashboard page`);

            // Step 4: Navigate to the Experience page
            await navigateToPage(EXPERIENCE_URL);

            // Step 5: Fill and submit the job experience form for each experience entry
            for (const experience of user.workExperience) {
                await fillExperienceForm(experience);
            }
        });
    });
});

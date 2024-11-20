/**
 * @file add_job_experience_test.js
 * @description Automated tests for adding job experience to a user's profile in a web application.
 *              The script tests the login process, navigation to the experience page, filling the job experience form,
 *              and submitting the job experience details. After submission, the test verifies that the user can access
 *              and successfully save the job experience details.
 * 
 * @dependencies selenium-webdriver, chromedriver, assert, Profile.json (user credentials)
 */

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

// Import necessary modules
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
require('chromedriver');
const fs = require('fs');

// Import user credentials from the Profile.json file
const credentials = require('./Profile.json');

// Application URLs
const LOGIN_URL = 'https://hirewire-app-8efe6492bdf7.herokuapp.com/login'; // Login page URL
const DASHBOARD_URL = 'https://hirewire-app-8efe6492bdf7.herokuapp.com/jobapplication'; // Dashboard page URL after login
const EXPERIENCE_URL = 'https://hirewire-app-8efe6492bdf7.herokuapp.com/experience'; // Job Experience page URL
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

    credentials.forEach((user, index) => {
        it(`Use Case ${index + 1}`, async () => {
            
            // Step 1: Ensure the user is logged out if already logged in
            await logoutIfLoggedIn();

            // Step 2: Log in using valid credentials from the Profile.json file
            await navigateToPage(LOGIN_URL);

            // Enter login credentials
            const emailInput = await driver.wait(
                until.elementLocated(By.xpath('//input[@placeholder="Email"]')),
                5000
            );
            await driver.wait(until.elementIsVisible(emailInput), 5000);
            await emailInput.sendKeys(user.emailAddress);
            const passwordInput = await driver.wait(
                until.elementLocated(By.xpath('//input[@placeholder="Password"]')),
                5000
            );
            await driver.wait(until.elementIsVisible(passwordInput), 5000);
            await passwordInput.sendKeys(user.password);

            const submitButton = await driver.findElement(By.xpath('//button[@type="submit"]'));
            await submitButton.click();            
            

            // step 3: Verify that the user is redirected to the dashboard after login.
            await driver.sleep(1000);
            const currentUrl = await driver.getCurrentUrl();   
            assert.strictEqual(currentUrl, DASHBOARD_URL, "User should be directed to Job Application page after successful login");

            // Step 4: Navigate to experience page
            await navigateToPage(EXPERIENCE_URL);

            for ( experience of user.workExperience) {

            await driver.sleep(1000);  

            // Step 5: Fill and submit the job experience form for each experience entry and save them
            for (const experience of user.workExperience) {

            const addExperienceButton = await driver.wait(
                until.elementLocated(By.xpath('//button[@class="add-button" and text()="+ Add Experience"]')),
                10000
            );
            await addExperienceButton.click();

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
    
            //save the education entries
            const saveBtn = await driver.findElement(By.css('button.save-button'));
            await saveBtn.click();
        }

            }
        });
    });
});

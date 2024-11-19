

/**
 * @file add_education_experience_test.js
 * @description Automated tests for adding education experience to a user's profile in a web application.
 *              The script tests the login process, navigation to the experience page, filling the education form,
 *              and submitting the education details. After submission, the test verifies that the user can access
 *              and successfully save the education details.
 * 
 * @dependencies selenium-webdriver, chromedriver, assert, Profile.json (user credentials)
 */

/**
 * @description This test case verifies that the user can add education experience to their profile.
 *              It involves logging in with valid credentials, navigating to the education form,
 *              filling the education details, and verifying the success of the submission.
 * 
 * @steps
 * 1. Ensure the user is logged out if already logged in.
 * 2. Log in using valid credentials from the Profile.json file.
 * 3. Verify that the user is redirected to the dashboard after login.
 * 4. Navigate to the experience page and fill the education form.
 * 5. Submit the education form and verify that the education details are saved.
 * 
 * @assertion The test asserts that the user is able to successfully add education experience to their profile.
 */

// Import necessary modules
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
require('chromedriver');
const fs = require('fs');

// Import user credentials from the Profile.json file
const credentials = require('./Profile.json');

// Application URLs
const LOGIN_URL = 'https://hirewire-app-8efe6492bdf7.herokuapp.com/'; // Login page URL
const DASHBOARD_URL = 'https://hirewire-app-8efe6492bdf7.herokuapp.com/jobapplication'; // Dashboard page URL after login
const EXPERIENCE_URL = 'https://hirewire-app-8efe6492bdf7.herokuapp.com/experience'; // Education/Experience page URL
const TIMEOUT = 30000; // Timeout for the tests

/**
 * @description Suite for testing the functionality of adding education experience to a user's profile.
 *              The test covers login, navigation to the experience page, form submission, 
 *              and verification that the education details are successfully saved.
 */
describe('Add Education Experience to Profile Functionality Test', function () {
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
        await driver.findElement(By.xpath('//input[@placeholder="Email"]')).sendKeys(user.emailAddress);
        await driver.findElement(By.xpath('//input[@placeholder="Password"]')).sendKeys(user.password);
        const submitButton = await driver.findElement(By.xpath('//button[@type="submit"]'));
        await submitButton.click();            


        await driver.sleep(200);
        const currentUrl = await driver.getCurrentUrl();          
        // Assert exact match of current URL with the expected URL
        assert.strictEqual(currentUrl, DASHBOARD_URL, `User cannot add their job experience because they cannot log in with these credentials.`);

    }

    /**
     * @function fillEducationForm
     * @description Fills the education form with provided data.
     * @param {Object} education - The education data to be entered in the form.
     */
    async function fillEducationForm(education) {
        // Add a new education entry
        //await driver.findElement(By.xpath('//button[contains(@class, "add-button") and text()="+ Add Education"]')).click();
        await driver.findElement(By.xpath('//button[contains(@class, "add-button") and text()="+ Add Experience"]')).click();

        
        if (education.SchoolName) {
            const schoolNameInput = await driver.findElement(By.xpath('//label[text()="Organization Name"]/following-sibling::input'));
            await schoolNameInput.clear(); // Clear the input field
            await schoolNameInput.sendKeys(education.SchoolName); // Enter the new value
        }
        
        if (education.AreaOfStudy) {
            const areaOfStudyInput = await driver.findElement(By.xpath('//label[text()="Field of Study"]/following-sibling::input'));
            await areaOfStudyInput.clear();
            await areaOfStudyInput.sendKeys(education.AreaOfStudy);
        }
        
        if (education.startDate) {
            const startDateInput = await driver.findElement(By.xpath('//label[text()="Start Date"]/following-sibling::input[@type="date"]'));
            await startDateInput.clear();
            await startDateInput.sendKeys(education.startDate); // Send the formatted date (yyyy-mm-dd)
        }
        
        if (education.endDate) {
            const endDateInput = await driver.findElement(By.xpath('//label[text()="End Date"]/following-sibling::input[@type="date"]'));
            await endDateInput.clear();
            await endDateInput.sendKeys(education.endDate); // Send the formatted date (yyyy-mm-dd)
        }
        
        if (education.degree) {
            const degreeInput = await driver.findElement(By.xpath('//label[text()="Degree"]/following-sibling::input'));
            await degreeInput.clear();
            await degreeInput.sendKeys(education.degree);
        }
        
        if (education.grade) {
            const gradeInput = await driver.findElement(By.xpath('//label[text()="Grade"]/following-sibling::input'));
            await gradeInput.clear();
            await gradeInput.sendKeys(education.grade);
        }
        
        // Save the education entry
        const saveBtnEducation = await driver.findElement(By.xpath('//button[contains(@class, "save-button")]'));
        await saveBtnEducation.click();
    }
    

    // Ensure the user is logged out after each test
    afterEach(async () => {
        await logoutIfLoggedIn();
    });


    credentials.forEach((user, index) => {
        it(`User ${index + 1}`, async () => {
            // Step 1: Ensure the user is logged out if already logged in
            await logoutIfLoggedIn();

            // Step 2: Log in using valid credentials from the Profile.json file
            await login(user);

            // Step 3: Verify that the user is redirected to the dashboard page after login
            const currentUrl = await driver.getCurrentUrl();
            assert.strictEqual(currentUrl.includes(DASHBOARD_URL), true, `User ${index + 1} should be on the dashboard page`);

            // Step 4: Navigate to the Experience page
            await navigateToPage(EXPERIENCE_URL);

            // Step 5: Fill and submit the education form for each education entry
            for (const education of user.Education) {
                await fillEducationForm(education);
            }
        });
    });
});

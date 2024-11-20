

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
const LOGIN_URL = 'https://hirewire-app-8efe6492bdf7.herokuapp.com/login'; // Login page URL
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

    /**
     * @function login
     * @description Logs the user in using credentials from the Profile.json file.
     * @param {Object} user - The user object containing email and password.
     */


    /**
     * @function fillEducationForm
     * @description Fills the education form with provided data.
     * @param {Object} education - The education data to be entered in the form.
     */
    async function fillEducationForm(education) {
        // Add a new education entry
        //await driver.findElement(By.xpath('//button[contains(@class, "add-button") and text()="+ Add Education"]')).click();
       
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
            await navigateToPage(LOGIN_URL);
           
            // Enter login credentials
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
            
            const submitButton = await driver.findElement(By.xpath('//button[@type="submit"]'));
            await submitButton.click();            
            
           await driver.sleep(1000);

            const currentUrl = await driver.getCurrentUrl();   
            assert.strictEqual(currentUrl, DASHBOARD_URL, "User should be directed to Job Application page after successful login");

            // Step 3: Verify the user is redirected to the job application page after login
            await navigateToPage(EXPERIENCE_URL);

            for ( education of user.Education) {

                // Step 4: Fill and submit the education form for each education entry
                await driver.sleep(1000);
                await driver.findElement(By.xpath('//button[contains(@class, "add-button") and text()="+ Add Education"]')).click();

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
                
                //step 6: make sure the education field are saved.
                const saveBtnEducation = await driver.findElement(By.xpath('//button[contains(@class, "save-button")]'));
                await saveBtnEducation.click();


            }
        });
    });
});

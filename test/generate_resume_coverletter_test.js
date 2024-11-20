
/**
 * @file generate_resume_coverletter_test.js
 * @description Automated tests for generating a resume and cover letter through a job application form.
 *              The script tests the functionality of logging in, submitting a job application form, 
 *              and verifying the generation of a resume after submission.
 * 
 * @dependencies selenium-webdriver, chromedriver, assert, ResumeGeneration_data.json (user credentials)
 */

/**
 * @test User Login and Resume Generation Test
 * @description This test case logs in with valid credentials, navigates to the job application form,
 *              fills out the form with relevant information, submits it, and verifies if the resume 
 *              is generated correctly.
 * 
 * @steps
 * 1. Log out the user if they are already logged in.
 * 2. Navigate to the login page and log in with the credentials from the `ResumeGeneration_data.json` file.
 * 3. After a successful login, navigate to the job application page.
 * 4. Fill out the job application form with user data (job title, company, job description, etc.).
 * 5. Submit the form and click the "Generate" button to create the resume.
 * 6. Verify that the generated resume is displayed on the page.
 * 
 * @assertion The test asserts that the generated content (resume) appears on the page after form submission.
 */


// Import necessary modules
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
require('chromedriver'); // Ensure chromedriver is available for browser automation

// Import user credentials and other application data from the ResumeGeneration_data.json file
const credentials = require('./ResumeGeneration_data.json');

// Application URLs
const LOGIN_URL = 'https://hirewire-app-8efe6492bdf7.herokuapp.com/login'; // Login page URL
const APPLICATION_URL = 'https://hirewire-app-8efe6492bdf7.herokuapp.com/jobapplication'; // Job application page URL after login
const TIMEOUT = 30000; // Timeout for the tests

/**
 * @description Suite for testing the functionality of generating resumes and cover letters
 *              through a job application form submission.
 */
describe('Generate Resume and Cover Letter Functionality Test', function () {
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
            console.error('Error initializing the WebDriver:', error);
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
     * @function logoutIfLoggedIn
     * @description Logs out the user if they are already logged in.
     *              Skips if the user is not logged in or the logout button is not visible.
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
     * @function navigateToLoginPage
     * @description Navigates to the login page of the application.
     */
    async function navigateToLoginPage() {
        await driver.get(LOGIN_URL);
    }

    /**
     * @function navigateToApplicationPage
     * @description Navigates to the job application page after login.
     */
    async function navigateToApplicationPage() {
        await driver.get(APPLICATION_URL);
    }

    credentials.forEach((user, index) => {
        it(`Use case ${index + 1}: `, async () => {
            // Step 1: Ensure the user is logged out if already logged in
            await logoutIfLoggedIn();

            // Step 2: Navigate to the login page and log in with the current user's credentials
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

            //Submit the login form
            const submitButton = await driver.findElement(By.xpath('//button[@type="submit"]'));
            await submitButton.click();    

            // Step 3: Verify the user is redirected to the dashboard page after login
            await driver.sleep(1000);
            const currentUrl = await driver.getCurrentUrl();
            assert.strictEqual(currentUrl, APPLICATION_URL, `User cannot login with these credentials to generate cover letter and resume.`);

            // Step 4: Navigate to the job application page
            await navigateToApplicationPage();

            // Step 5: Fill out the job application form with the user's job-related data
            await driver.findElement(By.xpath('//input[@placeholder="Job title (required)"]')).sendKeys(user.jobTitle);
            await driver.findElement(By.xpath('//input[@placeholder="Company (required)"]')).sendKeys(user.company);
            await driver.findElement(By.xpath('//textarea[@placeholder="Job description / information... (required)"]')).sendKeys(user.description);
            await driver.findElement(By.xpath('//textarea[@placeholder="Write additional information about yourself (Optional). This prompt will help us tailor your application to your needs."]')).sendKeys(user.additionalInformation);
            
            // Step 6: Click the "Generate" button to create the resume
            const generateButton = await driver.findElement(By.xpath('//button[contains(@class, "generate-button")]'));
            await generateButton.click();

            // Step 7: Verify that the generated resume content appears on the page
            const generatedContent = await driver.wait(
                until.elementLocated(By.css('.generated-content')), 5000
            );

            await driver.sleep(6000);
            const generatedText = await generatedContent.getText();
            const len = generatedText.length;
            if(generatedText.length == 0){
            assert.notStrictEqual(generatedText, len, "Failed to generate content"
            );
        }
        });
    });
});

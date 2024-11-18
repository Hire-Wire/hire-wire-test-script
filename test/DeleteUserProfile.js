
// const { Builder, By, until } = require('selenium-webdriver');
// const assert = require('assert');
// require('chromedriver'); // Ensure chromedriver is available
// const fs = require('fs');

// const credentials = require('./Profile.json');

// const LOGIN_URL = 'http://localhost:3000/hire-wire-front-end';
// const DASHBOARD_URL = 'http://localhost:3000/hire-wire-front-end/jobapplication';
// const PROFILE_URL = 'http://localhost:3000/hire-wire-front-end/userprofile';
// const TIMEOUT = 30000;

// describe('User Profile Functionality Test', function () {
//     this.timeout(TIMEOUT);

//     let driver;

//     before(async () => {
//         try {
//             driver = await new Builder().forBrowser('chrome').build();

//             // Log the preconditions
//             console.log("Preconditions:");
//             console.log("1. Application running on " + LOGIN_URL);
//             console.log("2. Credentials loaded from Profile.json.");
//             console.log("3. WebDriver initialized.");
//         } catch (error) {
//             console.error('Error initializing WebDriver:', error);
//         }
//     });

//     after(async () => {
//         try {
//             await driver.quit();
//         } catch (error) {
//             console.error('Error quitting the WebDriver:', error);
//         }
//     });
// //     // Helper function to navigate to the login page

//     async function navigateToLoginPage() {
//         try {
//             await driver.get(LOGIN_URL);
//         } catch (error) {
            
//         }}

//     credentials.forEach((user, index) => {
//         it(`User Profile Test ${index + 1}`, async () => {
//             try {
//                 // Log the expected results
//                 console.log("Expected Results:");
//                 console.log("1. User is redirected to " + DASHBOARD_URL + " after login.");
//                 console.log("2. Profile delete button is present and functional.");
//                 console.log("3. Delete confirmation dialog appears and works as expected.");

//                 // Step 1: Login
//                 await navigateToLoginPage();
//                 await driver.findElement(By.xpath('//input[@placeholder="Email"]')).sendKeys(user.emailAddress);
//                 await driver.findElement(By.xpath('//input[@placeholder="Password"]')).sendKeys(user.password);
//                 const submitButton = await driver.findElement(By.xpath('//button[@type="submit"]'));
//                 await submitButton.click();

//                 // Step 2: Verify Dashboard
//                 const currentUrl = await driver.getCurrentUrl();
//                 console.log("Actual Results:");
//                 console.log(`Dashboard URL verification: ${currentUrl === DASHBOARD_URL ? "Pass" : "Fail"} (${currentUrl})`);
//                 assert.strictEqual(currentUrl, DASHBOARD_URL, `User ${index + 1} should be on the dashboard page`);

//                 // Step 3: Navigate to Profile and Delete
//                 await navigateToProfilePage();
//                 const deleteButton = await driver.findElement(By.xpath('//button[contains(@class, "delete-user-profile-button") and @type="button"]'));
//                 console.log("Profile delete button found: Pass");

//                 await deleteButton.click();
//                 await driver.wait(until.alertIsPresent(), 5000);
//                 const alert = await driver.switchTo().alert();
//                 await alert.accept();
//                 console.log("Delete confirmation dialog handled: Pass");
//             } catch (error) {
//                 console.error(`Error in User Profile Test ${index + 1}:`, error);
//             }
//         });
//     });
// });



const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
require('chromedriver'); // Ensure chromedriver is available
const fs = require('fs');

const credentials = require('./Profile.json');

const LOGIN_URL = 'http://localhost:3000/hire-wire-front-end';
const DASHBOARD_URL = 'http://localhost:3000/hire-wire-front-end/jobapplication';
const PROFILE_URL = 'http://localhost:3000/hire-wire-front-end/userprofile';
const TIMEOUT = 30000;

describe('User Profile Deletion Functionality Test', function () {
    this.timeout(TIMEOUT);

    let driver;

    before(async () => {
        try {
            driver = await new Builder().forBrowser('chrome').build();
        } catch (error) {
            console.error('Error initializing WebDriver:', error);
        }
    });

    after(async () => {
        try {
            await driver.quit();
        } catch (error) {
            console.error('Error quitting the WebDriver:', error);
        }
    });

    // Helper function to navigate to the login page
    async function navigateToLoginPage() {
        try {
            await driver.get(LOGIN_URL);
        } catch (error) {
            
        }
    }

    async function navigateToProfilePage() {
        try {
            await driver.get(PROFILE_URL);
        } catch (error) {

        }
    }

    async function logoutIfLoggedIn() {
        try {
            const logoutButton = await driver.findElement(By.xpath('//button[@type="logout"]'));
            if (await logoutButton.isDisplayed()) {
                await logoutButton.click();
                await driver.wait(until.urlContains(LOGIN_URL), 5000);
            }
        } catch (error) {
            // Ignored if logout button is not found
 
        }
    }

    afterEach(async () => {
        await logoutIfLoggedIn();
    });

    credentials.forEach((user, index) => {
        it(`User Profile Test ${index + 1}`, async () => {
            
                await logoutIfLoggedIn();
                await navigateToLoginPage();

                const loginButton = await driver.findElement(By.xpath('//button[contains(@class, "login-button")]'));
                await loginButton.click();

                // Login
                await driver.findElement(By.xpath('//input[@placeholder="Email"]')).sendKeys(user.emailAddress);
                await driver.findElement(By.xpath('//input[@placeholder="Password"]')).sendKeys(user.password);
                const submitButton = await driver.findElement(By.xpath('//button[@type="submit"]'));
                await submitButton.click();


                const currentUrl = await driver.getCurrentUrl();
                
                // Assert exact match of current URL with the expected URL
                assert.strictEqual(currentUrl, DASHBOARD_URL, `User ${index + 1} user can not log in, user does not exist`);
    
                // Navigate to profile page
                await navigateToProfilePage();


                // Click delete Button
                const deleteButton = await driver.findElement(By.xpath('//button[contains(@class, "delete-user-profile-button") and @type="button"]'));
                await deleteButton.click();

                // Wait for the alert pop-up to appear
                await driver.wait(until.alertIsPresent(), 5000); // Adjust timeout if needed
                const alert = await driver.switchTo().alert();
                
                // Press the OK button on the alert
                await alert.accept();

                //get current url after deleetion
                const currentUrl2 = await driver.getCurrentUrl();
                assert.strictEqual(currentUrl, currentUrl2, "After Successful deletion of user the page should be directed to homepage");

        });
    });
});

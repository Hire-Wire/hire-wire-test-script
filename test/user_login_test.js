// const { Builder, By, until } = require('selenium-webdriver');
// const assert = require('assert');
// require('chromedriver'); // Ensure chromedriver is available
// const fs = require('fs');

// // Import credentials from JSON file

// const credentials = require('./Profile.json');
// // console.log("Password (dynamic access):", credentials["password"]);

// console.log("Username:", credentials.emailAddress);
// console.log("Password:", credentials.password);


// const LOGIN_URL = 'http://localhost:3000/hire-wire-front-end';
// const DASHBOARD_URL = 'http://localhost:3000/hire-wire-front-end/jobapplication';
// const TIMEOUT = 30000;

// describe('Login Functionality Test', function () {
//     this.timeout(TIMEOUT);

//     let driver;

//     before(async () => {
//         driver = await new Builder().forBrowser('chrome').build();
//     });

//     after(async () => {
//         await driver.quit();
//     });

//     // Helper function to navigate to the login page
//     async function navigateToLoginPage() {
//         await driver.get(LOGIN_URL);
//     }

//     async function logoutIfLoggedIn() {
//         try {
//             const logoutButton = await driver.findElement(By.css('button[type="logout"]'));
//             if (await logoutButton.isDisplayed()) {
//                 await logoutButton.click();
//                 await driver.wait(until.urlContains(REGISTRATION_URL), 5000);
//             }
//         } catch (error) {
            
//         }
//     }

//     afterEach(async () => {
//         await logoutIfLoggedIn();
//     });


//     console.log('User must be registered on the system first and then log in with valid credentials');
//     credentials.forEach((user, index) => {
//         it(`${index + 1}`, async () => {

//             await logoutIfLoggedIn(); 
            
//             await navigateToLoginPage();
//             const loginbtn = await driver.findElement(By.className('login-button'));
//             await loginbtn.click();

//             // Use the username and password for the current user
//             await driver.findElement(By.css('input[placeholder="Email"]')).sendKeys(user.emailAddress);
//             await driver.findElement(By.css("input[placeholder='Password']")).sendKeys(user.password);

//             // await driver.findElement(By.css('button[type = "submit")]')).click();


//             const loginButton = await driver.findElement(By.css('button[type="submit"]'));
//             await loginButton.click();

//         const errorMessage = await driver.findElements(By.css('.error-message'));
//         if (errorMessage.length) {
//             const errorText = await errorMessage[0].getText();
//             assert.strictEqual(
//                 errorText, 
//                 "We're sorry, we couldn't log in", 
//                 'Expected error message on log in failure'
//             );
//         } else {
//             const currentUrl = await driver.getCurrentUrl();
//             assert.notStrictEqual(
//                 currentUrl, 
//                 DASHBOARD_URL, 
//                 "login successful"
//             );
//         }
        

//         });
//     });


// });

const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
require('chromedriver'); // Ensure chromedriver is available
const fs = require('fs');

// Import credentials from JSON file
const credentials = require('./Profile.json');
console.log("Username:", credentials.emailAddress);
console.log("Password:", credentials.password);

const LOGIN_URL = 'http://localhost:3000/hire-wire-front-end';
const DASHBOARD_URL = 'http://localhost:3000/hire-wire-front-end/jobapplication';
const TIMEOUT = 30000;

describe('Login Functionality Test', function () {
    this.timeout(TIMEOUT);

    let driver;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => {
        await driver.quit();
    });

    // Helper function to navigate to the login page
    async function navigateToLoginPage() {
        await driver.get(LOGIN_URL);
    }

    async function logoutIfLoggedIn() {
        try {
            const logoutButton = await driver.findElement(By.css('button[type="logout"]'));
            if (await logoutButton.isDisplayed()) {
                await logoutButton.click();
                await driver.wait(until.urlContains(LOGIN_URL), 5000);
            }
        } catch (error) {
            // Ignore errors if not logged in
        }
    }

    afterEach(async () => {
        await logoutIfLoggedIn();
    });

    console.log('User must be registered on the system first and then log in with valid credentials');

    credentials.forEach((user, index) => {
        it(`Test Case ${index + 1}: Login with provided credentials`, async () => {

            await logoutIfLoggedIn();
            await navigateToLoginPage();
            
            const loginbtn = await driver.findElement(By.className('login-button'));
            await loginbtn.click();

            // Use the username and password for the current user
            await driver.findElement(By.css('input[placeholder="Email"]')).sendKeys(user.emailAddress);
            await driver.findElement(By.css("input[placeholder='Password']")).sendKeys(user.password);

            const loginButton = await driver.findElement(By.css('button[type="submit"]'));
            await loginButton.click();

            const currentUrl = await driver.getCurrentUrl();
            assert.strictEqual( currentUrl, DASHBOARD_URL, "User should directed to Job Application page after successful log in");
            // const errorMessage = await driver.findElements(By.css('.error-message'));
            // if (errorMessage.length>0) {
            //     const errorText = await errorMessage[0].getText();

            //     // Include actual and expected in assert message
            //     assert.strictEqual(
            //         errorText,
            //         "We're sorry, we couldn't log in",
            //         `Expected error message: "We're sorry, we couldn't log in"`
            //     );
            // } else {
            //     const currentUrl = await driver.getCurrentUrl();

            //     // Include actual and expected in assert message
            //     assert.notStrictEqual(
            //         currentUrl,
            //         DASHBOARD_URL,
            //         "Login Successful"
            //     ); }
            
        });
    });
});

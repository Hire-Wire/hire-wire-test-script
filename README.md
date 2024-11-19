# HireWire - Automated Test Suite

## Overview

This repository contains an automated test suite built with **Selenium WebDriver** to validate core functionalities of the **HireWire Resume and Cover letter generation** application. The test suite covers modules such as user registration, login, profile update, job and education experience management, and resume generation. The tests are designed to ensure that key user interactions with the application work correctly and meet the expected behavior.

## Modules Covered

The test suite covers the following modules:

1. **Registration Module**  
   - Verifies that users can successfully register by submitting required details such as first name, last name, email, password.

2. **Login Module**  
   - Ensures that users can log in using their credentials and access their dashboard.

3. **User Profile Update Module**  
   - Verifies that users can update their personal information, such as name, email, and contact details and employment status.

4. **Add Education Experience Module**  
   - Tests the functionality for adding education experience to the user's profile, including school, degree, and graduation year.

5. **Add Job Experience Module**  
   - Verifies that users can add job experience, including job title, company, start and end dates.

6. **Delete Experience Module**  
   - Tests the functionality to delete a job or education experience from the user's profile.

7. **Generate Resume and Cover Letter Module**  
   - Ensures that users can generate a resume and cover letter based on their profile information.

8. **Delete User Profile Module**  
   - Verifies that users can delete their entire profile from the system.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed.
- **Selenium WebDriver**: This project uses Selenium for browser automation.
- **ChromeDriver**: Make sure that ChromeDriver is installed and accessible.
- **Credentials**: The credentials used for testing are stored in the `Profile.json` file.
- **Report**: The report is available in the mochawesome-report folder under the name mochawesome.html. It displays the pass or fail status of test cases, and for any failures, it includes detailed information about the expected and actual results.



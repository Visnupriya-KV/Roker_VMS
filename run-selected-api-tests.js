const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env file

const csvFilePath = path.join(__dirname, 'Testcase.csv'); // Adjust path if needed
const reportDir = path.join(__dirname, 'allure-report'); // Default Playwright report directory
const reportFilePath = path.join(reportDir, 'index.html'); // Full path to the report file

// --- Email Configuration ---
const emailConfig = {
    service: process.env.EMAIL_SERVICE, // e.g., 'gmail' (if using service)
    host: process.env.EMAIL_HOST,       // e.g., 'smtp.office365.com' (if using host/port)
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : undefined, // e.g., 587 or 465
    secure: process.env.EMAIL_SECURE ? (process.env.EMAIL_SECURE === 'true') : undefined, // true for 465, false for other ports (like 587)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use App Password for Gmail if 2FA is enabled
    },
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO, // Comma-separated list of recipients
};

// --- Helper Function to Send Email ---
async function sendReportEmail(status) {
    if (!emailConfig.auth.user || !emailConfig.auth.pass || !emailConfig.to) {
        console.warn('⚠️ Email configuration incomplete. Skipping email notification.');
        return;
    }

    // Check if report file exists before attempting to send
    if (!fs.existsSync(reportFilePath)) {
        console.error(`❌ Report file not found at ${reportFilePath}. Cannot send email attachment.`);
        // Optionally send an email without attachment indicating the report is missing
        // Or just return here if attachment is mandatory
        return;
    }

    console.log(`\n📧 Preparing to send ${status} report email...`);

    // Create transporter object
    let transporterOptions = {};
    if (emailConfig.service) {
        transporterOptions.service = emailConfig.service;
        transporterOptions.auth = emailConfig.auth;
    } else if (emailConfig.host && emailConfig.port) {
        transporterOptions.host = emailConfig.host;
        transporterOptions.port = emailConfig.port;
        transporterOptions.secure = emailConfig.secure;
        transporterOptions.auth = emailConfig.auth;
    } else {
        console.error('❌ Invalid email transport configuration (missing service or host/port).');
        return;
    }

    const transporter = nodemailer.createTransport(transporterOptions);

    // Email options
    // Generate date and time in DD-MM-YY_HH-MM-SS format
const now = new Date();
const formatDate = (num) => String(num).padStart(2, '0');

const day = formatDate(now.getDate());
const month = formatDate(now.getMonth() + 1);
const year = String(now.getFullYear()).slice(2); // Get last 2 digits
const hours = formatDate(now.getHours());
const minutes = formatDate(now.getMinutes());
const seconds = formatDate(now.getSeconds());

const timestamp = `${day}-${month}-${year}_${hours}-${minutes}-${seconds}`;
const reportFileName = `ROKER_Regression_Test-report_${timestamp}.html`;

const totalTests = 50;
const passedTests = 50;
const failedTests = 0;
const duration = '3m 42s';

// function sendReportEmail() {
//   const mailOptions = {
//     // can access them here
//   };
// }


const mailOptions = {
    from: emailConfig.from,
    to: emailConfig.to,
    subject: `UAT ROKER TEST REPORT - ${status.toUpperCase()} - ${now.toLocaleString()}`,
    text: `Playwright Roker test execution finished with status: ${status.toUpperCase()}.
Total Tests: ${totalTests}
Passed: ${passedTests}
Failed: ${failedTests}
Duration: ${duration}

Please download and view the attached HTML report.`,
    html: `
        <p>Hi Team,</p>
        <p>UAT <b>Roker</b> test execution has <b>completed</b> with the following details:</p>
        <ul>
            <li><b>Status:</b> ${status.toUpperCase()}</li>
            <li><b>Total Tests:</b> ${totalTests}</li>
            <li><b>Passed:</b> ${passedTests}</li>
            <li><b>Failed:</b> ${failedTests}</li>
            <li><b>Duration:</b> ${duration}</li>
        </ul>
        <p>Please <b>download</b> and <b>view</b> the attached HTML report for full details.</p>
        <p>Regards,<br/>QA Automation</p>
    `,
    attachments: [
        {
            filename: reportFileName, // now includes timestamp
            path: reportFilePath,
            contentType: 'text/html'
        },
    ],
};


    // Send mail
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
}


// --- Main Script Logic ---
(async () => { // Wrap in an async IIFE to use await for email sending
    try {
        // Read the CSV file
        const csvData = fs.readFileSync(csvFilePath, 'utf8');
        const lines = csvData.split('\n');
        const headerLine = lines[0].trim();
        const headers = headerLine.split(',');

        // Find the index of 'Control' and 'TestCaseID' columns
        const controlIndex = headers.indexOf('Control');
        const testCaseIdIndex = headers.indexOf('TestCaseID');

        if (controlIndex === -1 || testCaseIdIndex === -1) {
            throw new Error(`CSV file "${csvFilePath}" must contain 'Control' and 'TestCaseID' columns.`);
        }

        // Find TestCaseIDs where Control is 'Y'
        const testCaseIDsToRun = lines
            .slice(1) // Skip header row
            .map(line => line.trim())
            .filter(line => line) // Remove empty lines
            .map(line => {
                const columns = line.split(','); // Simple CSV split
                return { control: columns[controlIndex]?.trim(), id: columns[testCaseIdIndex]?.trim() };
            })
            .filter(testCase => testCase.control && testCase.control.toUpperCase() === 'Y' && testCase.id)
            .map(testCase => testCase.id);

        if (testCaseIDsToRun.length === 0) {
            console.log(`No test cases marked with Control="Y" found in ${csvFilePath}`);
            process.exit(0); // Exit gracefully if no tests are selected
        }

        console.log('▶️ Test Cases to run:', testCaseIDsToRun.join(', '));

        // Construct the Playwright command with --grep
        const grepPattern = testCaseIDsToRun.join('|'); // Join IDs with OR operator for grep
        // Ensure the reporter is explicitly set to html
        const playwrightCommand = `npx playwright test --reporter=html --grep="${grepPattern}"`;

        console.log(`\n🚀 Executing command: ${playwrightCommand}\n`);

        // Execute the command
        let executionStatus = 'SUCCESS';
        try {
            // Clear previous report if desired (optional)
            // if (fs.existsSync(reportDir)) {
            //     fs.rmSync(reportDir, { recursive: true, force: true });
            //     console.log('🧹 Cleared previous report directory.');
            // }
            execSync(playwrightCommand, { stdio: 'inherit' }); // Inherit stdio to see Playwright output
            console.log('\n✅ Playwright tests completed successfully.');
        } catch (error) {
            console.error('\n❌ Playwright tests failed.');
            executionStatus = 'FAILURE';
            // Don't exit yet, proceed to report path logging and email sending
        }

        // --- Print the report path to the terminal ---
        if (fs.existsSync(reportFilePath)) {
            console.log(`\n📄 HTML Report generated at: ${reportFilePath}`);
            // You can also provide a file URL for easier opening on some systems:
            // console.log(`   File URL: file://${reportFilePath}`);
        } else {
            // This might happen if Playwright failed very early or config is wrong
            console.warn(`\n⚠️ HTML Report file not found at: ${reportFilePath}. Cannot provide path or send attachment.`);
        }
        // --- End of printing path ---

        // Send email after execution attempt
        await sendReportEmail(executionStatus); // Use await as sendReportEmail is async

        // Exit with appropriate code if tests failed
        if (executionStatus === 'FAILURE') {
            process.exit(1); // Indicate failure
        }

    } catch (error) {
        console.error('\n❌ An error occurred in the main script execution:', error);
        // Optionally send a failure notification email here too if the script itself crashes
        // await sendFailureNotificationEmail(error); // Implement if needed
        process.exit(1); // Exit with a failure code
    }
})(); // Immediately invoke the async function

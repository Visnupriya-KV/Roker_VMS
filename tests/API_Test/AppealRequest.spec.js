const { test, expect, request } = require('@playwright/test');
const config = require('../API_JSON/AppealRequest.json');

test('API_AppealRequest_Test: Submit an appeal request and validate response', async () => {
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      ...config.headers
    }
  });

  const response = await apiContext.post(config.api.appealRequest, {
    data: config.requestBody
  });

  const status = response.status();
  const responseBody = await response.text();

  console.log('📡 Status:', status);
  console.log('📦 Raw Response:', responseBody);

  let parsed;
  try {
    parsed = JSON.parse(responseBody);
  } catch (err) {
    throw new Error(` Failed to parse response JSON: ${err}`);
  }

  // ✅ Base expectations
  expect([200]).toContain(status);
  expect(parsed).toHaveProperty('StatusMessage');
  expect(parsed).toHaveProperty('StatusCode');
  expect(parsed).toHaveProperty('Content');

  // 🧠 Optional: Smart checks based on response
  if (parsed.StatusCode === 200) {
    console.log('✅ Appeal Submitted:', parsed.Content);
  } else {
    console.warn(`Appeal Failed: ${parsed.StatusMessage} - ${parsed.Content}`);
  }
});



/*

const { test, expect } = require('@playwright/test'); // 'request' may no longer be needed from Playwright for this file
const config = require('../API_JSON/AppealRequest.json');
require('../../api-logger.js'); // This will set up the Axios interceptors for logging
const axios = require('axios'); // Import axios to make requests

test('API_AppealRequest_Test: Submit an appeal request and validate response', async () => {
  try {
    const response = await axios.post(config.api.appealRequest, config.requestBody, {
      headers: {
        ...config.headers
        // Axios typically infers Content-Type for objects, but ensure it's correct
        // or explicitly set it in config.headers if needed.
      },
      validateStatus: () => true // Important: Prevents axios from throwing on HTTP error statuses (4xx, 5xx)
                                 // This makes its behavior similar to Playwright's request.status() checks.
    });

    const status = response.status; // Axios uses response.status
    const responseBody = response.data; // Axios uses response.data (often pre-parsed if JSON)

    // The api-logger.js will have already printed detailed logs to the console.
    // You can keep these lines for quick checks or remove them if the logger's output is sufficient.
    console.log('📡 Status (from Axios):', status);
    // console.log('📦 Response Data (from Axios):', responseBody); // responseBody is likely already an object if JSON

    let parsed = responseBody;
    // If the response is a string and needs to be parsed (e.g. not application/json from server)
    if (typeof responseBody === 'string') {
      try {
        parsed = JSON.parse(responseBody);
      } catch (err) {
        // If parsing fails, 'parsed' remains the original string body for further checks.
        console.warn(`Response body was a string but failed to parse as JSON: ${err.message}`);
      }
    }

    // ✅ Base expectations (should still work with 'parsed' object)
    expect([200]).toContain(status);
    expect(parsed).toHaveProperty('StatusMessage');
    expect(parsed).toHaveProperty('StatusCode');
    expect(parsed).toHaveProperty('Content');

    // 🧠 Optional: Smart checks based on response
    if (parsed.StatusCode === 200) {
      console.log('✅ Appeal Submitted (via Axios):', parsed.Content);
    } else {
      console.warn(`Appeal Failed (via Axios): ${parsed.StatusMessage} - ${parsed.Content}`);
    }
  } catch (error) {
    // This will catch network errors or issues if validateStatus was not set to '() => true'
    // and an HTTP error occurred. With validateStatus: () => true, this primarily catches setup/network errors.
    // The api-logger.js should also log Axios errors.
    console.error('API call/test execution error:', error.message);
    throw error; // Re-throw to fail the test
  }
});

*/

const { test, expect, request } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const {generateRandomName} = require("../../src/util");
const {generateRandomEmail} = require("../../src/util");

// Load config and body
const config = require('../API_JSON/CreateUser.json');

test('API_CreateUser_Test: Create a user via API', async () => {
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      ...config.headers
    }
  });

  const randomUsername = generateRandomName('userNameAuto');
  const randomEmail = generateRandomEmail('Automation', 'test.com');  
  const requestBody = {
    ...config.body,
    UserName: randomUsername,
    EmailAddress:randomEmail
  };

  // Log request
  console.log('\nAPI Request');
  console.log('Endpoint     :', config.api.endpoint);
  console.log('Method       : POST');
  console.log('Headers      :', JSON.stringify(config.headers, null, 2));
  console.log('Request Body :', JSON.stringify(requestBody, null, 2));

  // Send request
  const response = await apiContext.post(config.api.endpoint, {
    data: requestBody
  });

  const status = response.status();
  const resText = await response.text();

  // Log response
  console.log('\nAPI Response');
  console.log('Status       :', status);
  console.log('Response Body:', resText);

  // Basic validation
  expect([200, 201]).toContain(status);

  try {
    const parsed = JSON.parse(resText);
    expect(parsed).toHaveProperty('StatusMessage');
    expect(parsed).toHaveProperty('StatusCode');
    console.log(`User "${requestBody.UserName}" created successfully.`);
  } catch (err) {
    throw new Error(`Failed to parse JSON: ${err}`);
  }
});


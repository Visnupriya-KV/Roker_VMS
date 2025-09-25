const { test, expect, request } = require('@playwright/test');
const { generateRandomName, generateRandomEmail } = require('../../src/util'); // Utility functions for random data
const createConfig = require('../../data/API_JSON/CreateUser.json'); // Import CreateUser-specific data
const commonHeaders = require('../../utils/Common/CommonHeaders.json'); // Import common headers
const commonEndpoints = require('../../utils/Common/CommonEndpoints.json'); // Import common endpoints


test('API_CreateUser_Test: Create a user via API', async () => {
  // Setup API context with headers
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      accept: commonHeaders.headers.accept, // Pass the `accept` header
      Token: commonHeaders.headers.Token, // Pass the `Token` header
      'Content-Type': commonHeaders.headers['Content-Type'] // Pass the `Content-Type` header
    }
  });

  const randomUsername = generateRandomName('AutoUserName'); // Generate random username
  const randomEmail = `${randomUsername}@yopmail.com`; // Generate email using UserName prefix

  const requestBody = {
    ...createConfig.body,
    UserName: randomUsername,
    EmailAddress: randomEmail
  };

  console.log('\n--- Create User Request ---');
  console.log('URL:', commonEndpoints.endpoints.createUser); // Use endpoint from CommonEndpoints.json
  console.log('Headers:', JSON.stringify({
    accept: commonHeaders.headers.accept,
    Token: commonHeaders.headers.Token,
    'Content-Type': commonHeaders.headers['Content-Type']
  }, null, 2));
  console.log('Request Body:', JSON.stringify(requestBody, null, 2));

  // Send request
  const response = await apiContext.post(commonEndpoints.endpoints.createUser, {
    data: requestBody
  });

  const status = response.status();
  const resText = await response.text();

  console.log('\n--- Create User Response ---');
  console.log('Status:', status);
  console.log('Response Body:', resText);

  expect([200, 201, 400]).toContain(status);

  let parsed;
  try {
    parsed = JSON.parse(resText);
  } catch (err) {
    throw new Error(`Failed to parse response JSON: ${err}`);
  }

  expect(parsed).toHaveProperty('StatusMessage');
  expect(parsed).toHaveProperty('StatusCode');

  const { StatusMessage, StatusCode } = parsed;

  const isSuccess =
    StatusCode === 201 && StatusMessage === 'User has been created.';

  const isWarning =
    StatusCode === 400 && StatusMessage === 'User Name Already Exist.';

  if (isSuccess) {
    console.log(`User "${requestBody.UserName}" created successfully.`);
  } else if (isWarning) {
    console.warn(`Warning: ${StatusMessage} for "${requestBody.UserName}".`);
  } else {
    throw new Error(
      `Unexpected response:\n${JSON.stringify(parsed, null, 2)}`
    );
  }
});

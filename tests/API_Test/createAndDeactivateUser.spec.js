const { test, expect, request } = require('@playwright/test');
const createConfig = require('../../data/API_JSON/CreateUser.json'); // Import CreateUser-specific data
const { generateRandomName, generateRandomEmail } = require('../../src/util'); // Utility functions for random data
const commonHeaders = require('../../utils/Common/CommonHeaders.json'); // Import common headers
const commonEndpoints = require('../../utils/Common/CommonEndpoints.json'); // Import common endpoints

test('API_DeactivateUser_Test: Create and Deactivate a User', async () => {
  // Step 1: Create a User
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      accept: commonHeaders.headers.accept, // Pass the `accept` header
      Token: commonHeaders.headers.Token // Pass the `Token` header
    }
  });

  const randomUserName = generateRandomName('Autouser'); // Generate random username
  const randomEmail = generateRandomEmail('Autouser'); // Generate random email

  const createBody = {
    ...createConfig.body,
    UserName: randomUserName,
    EmailAddress: randomEmail
  };

  console.log('\nCREATE USER REQUEST');
  console.log('URL:', commonEndpoints.endpoints.createUser); // Use endpoint from CommonEndpoints.json
  console.log('Headers:', JSON.stringify({ accept: commonHeaders.headers.accept, Token: commonHeaders.headers.Token }, null, 2));
  console.log('Request Body:', JSON.stringify(createBody, null, 2));

  const createResponse = await apiContext.post(commonEndpoints.endpoints.createUser, {
    data: createBody
  });

  const createStatus = createResponse.status();
  const createResText = await createResponse.text();

  console.log('\nCREATE USER RESPONSE');
  console.log('Status:', createStatus);
  console.log('Response Body:', createResText);

  expect([200, 201], 'Expected status code 200 or 201').toContain(createStatus);

  let created;
  try {
    created = JSON.parse(createResText);
  } catch (err) {
    throw new Error(`Failed to parse create response JSON: ${err.message}`);
  }

  expect(created).toHaveProperty('StatusCode');
  expect(created.StatusCode).toBe(201);
  console.log(`User "${randomUserName}" created successfully.`);

  // Step 2: Deactivate the same user
  const deactivateUrl = `${commonEndpoints.endpoints.deactivate}?userName=${randomUserName}`; // Use endpoint from CommonEndpoints.json

  console.log('\nDEACTIVATE USER REQUEST');
  console.log('URL:', deactivateUrl);
  console.log('Headers:', JSON.stringify({ accept: commonHeaders.headers.accept, Token: commonHeaders.headers.Token }, null, 2));

  const deactivateResponse = await apiContext.delete(deactivateUrl);
  const deactivateStatus = deactivateResponse.status();
  const deactivateResText = await deactivateResponse.text();

  console.log('\nDEACTIVATE USER RESPONSE');
  console.log('Status:', deactivateStatus);
  console.log('Response Body:', deactivateResText);

  expect(deactivateStatus).toBe(200);

  let deactivated;
  try {
    deactivated = JSON.parse(deactivateResText);
  } catch (err) {
    throw new Error(`Failed to parse deactivate response JSON: ${err.message}`);
  }

  expect(deactivated).toHaveProperty('StatusMessage');
  expect(deactivated).toHaveProperty('StatusCode');
  expect(deactivated).toHaveProperty('Content');

  const expectedSuccess = {
    StatusMessage: "User has been delete successfully.",
    StatusCode: 200,
    Content: ""
  };

  const expectedWarning = {
    StatusMessage: "User doesn't Exist.",
    StatusCode: 400,
    Content: ""
  };

  if (
    deactivated.StatusMessage === expectedSuccess.StatusMessage &&
    deactivated.StatusCode === expectedSuccess.StatusCode &&
    deactivated.Content === expectedSuccess.Content
  ) {
    console.log(`User "${randomUserName}" successfully deactivated.`);
  } else if (
    deactivated.StatusMessage === expectedWarning.StatusMessage &&
    deactivated.StatusCode === expectedWarning.StatusCode &&
    deactivated.Content === expectedWarning.Content
  ) {
    console.warn(`Warning: ${deactivated.StatusMessage} — user may not have existed or was already deleted.`);
  } else {
    throw new Error(`Unexpected response during deactivation:\n${JSON.stringify(deactivated, null, 2)}`);
  }
});

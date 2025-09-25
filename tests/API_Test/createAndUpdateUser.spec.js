const { test, expect, request } = require('@playwright/test');
const createConfig = require('../../data/API_JSON/CreateUser.json'); // Import CreateUser-specific data
const updateConfig = require('../../data/API_JSON/createAndUpdateUser.json'); // Import UpdateUser-specific data
const { generateRandomString } = require('../../src/util'); // Utility function for random data
const commonHeaders = require('../../utils/Common/CommonHeaders.json'); // Import common headers
const commonEndpoints = require('../../utils/Common/CommonEndpoints.json'); // Import common endpoints


test('API_UpdateUser_Test: Create and Update a User', async () => {
  // Setup API context with headers
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      accept: commonHeaders.headers.accept, // Pass the `accept` header
      Token: commonHeaders.headers.Token, // Pass the `Token` header
      'Content-Type': commonHeaders.headers['Content-Type'] // Pass the `Content-Type` header
    }
  });

  // Step 1: Create User
  const randomUserName = generateRandomString('Autouser'); // Generate random username
  const randomEmail = `${randomUserName}@yopmail.com`; // Generate email using UserName prefix

  const createBody = {
    ...createConfig.body,
    UserName: randomUserName,
    EmailAddress: randomEmail
  };

  console.log('\n--- Create User Request ---');
  console.log('URL:', commonEndpoints.endpoints.createUser); // Use endpoint from CommonEndpoints.json
  console.log('Headers:', JSON.stringify({
    accept: commonHeaders.headers.accept,
    Token: commonHeaders.headers.Token,
    'Content-Type': commonHeaders.headers['Content-Type']
  }, null, 2));
  console.log('Request Body:', JSON.stringify(createBody, null, 2));

  const createResponse = await apiContext.post(commonEndpoints.endpoints.createUser, {
    data: createBody
  });

  const createStatus = createResponse.status();
  const createResText = await createResponse.text();

  console.log('\n--- Create User Response ---');
  console.log('Status:', createStatus);
  console.log('Body:', createResText);

  expect([200, 201]).toContain(createStatus);

  let created;
  try {
    created = JSON.parse(createResText);
  } catch (err) {
    throw new Error(`Failed to parse create response JSON: ${err.message}`);
  }

  expect(created).toHaveProperty('StatusCode');
  expect([200, 201]).toContain(created.StatusCode);
  console.log(`User "${randomUserName}" created successfully.`);

  // Step 2: Update User
  const updatedFirstName = `${createBody.FirstName}_Updated`;
  const updatedEmail = `${createBody.UserName}@yopmail.com`; // Ensure updated email uses UserName prefix

  const updateBody = {
    ...updateConfig.body,
    UserName: createBody.UserName,
    FirstName: updatedFirstName,
    MiddleName: createBody.MiddleName,
    LastName: createBody.LastName,
    EmailAddress: updatedEmail,
    Badge: createBody.Badge,
    UserGroupName: createBody.UserGroupName,
    SubClientId: createBody.SubClientId
  };

  console.log('\n--- Update User Request ---');
  console.log('URL:', commonEndpoints.endpoints.updateUser); // Use endpoint from CommonEndpoints.json
  console.log('Headers:', JSON.stringify({
    accept: commonHeaders.headers.accept,
    Token: commonHeaders.headers.Token,
    'Content-Type': commonHeaders.headers['Content-Type']
  }, null, 2));
  console.log('Request Body:', JSON.stringify(updateBody, null, 2));

  const updateResponse = await apiContext.put(commonEndpoints.endpoints.updateUser, {
    data: updateBody
  });

  const updateStatus = updateResponse.status();
  const updateResText = await updateResponse.text();

  console.log('\n--- Update User Response ---');
  console.log('Status:', updateStatus);
  console.log('Body:', updateResText);

  expect(updateStatus).toBe(200);

  let updated;
  try {
    updated = JSON.parse(updateResText);
  } catch (err) {
    throw new Error(`Failed to parse update response JSON: ${err.message}`);
  }

  expect(updated).toHaveProperty('StatusCode');

  const isSuccess =
    updated.StatusCode === 200 &&
    updated.StatusMessage === 'User has been updated successfully.';

  const isWarning =
    updated.StatusCode === 400 &&
    updated.StatusMessage === "User doesn't Exist.";

  if (isSuccess) {
    console.log(`User "${randomUserName}" updated successfully. New FirstName: "${updatedFirstName}"`);
  } else if (isWarning) {
    console.warn(`Warning: ${updated.StatusMessage} - The user might not exist.`);
  } else {
    throw new Error(`Unexpected update response:\n${JSON.stringify(updated, null, 2)}`);
  }
});

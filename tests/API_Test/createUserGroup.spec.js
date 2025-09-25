const { test, expect, request } = require('@playwright/test');
const { generateRandomGroupName } = require('../../src/util'); // Utility function for random group name
const createConfig = require('../../data/API_JSON/CreateUserGroup.json'); // Import CreateUserGroup-specific data
const commonHeaders = require('../../utils/Common/CommonHeaders.json'); // Import common headers
const commonEndpoints = require('../../utils/Common/CommonEndpoints.json'); // Import common endpoints

test('API_CreateUserGroup_Test: Create a user group via API', async () => {
  // Setup API context with headers
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      accept: commonHeaders.headers.accept, // Pass the `accept` header
      Token: commonHeaders.headers.Token, // Pass the `Token` header
      'Content-Type': commonHeaders.headers['Content-Type'] // Pass the `Content-Type` header
    }
  });

  const randomGroupName = generateRandomGroupName(); // Generate random group name

  const requestBody = {
    ...createConfig.body,
    GroupName: randomGroupName,
    NewGroupName: randomGroupName
  };

  console.log('\n--- Create User Group Request ---');
  console.log('URL:', commonEndpoints.endpoints.createUserGroup); // Use endpoint from CommonEndpoints.json
  console.log('Headers:', JSON.stringify({
    accept: commonHeaders.headers.accept,
    Token: commonHeaders.headers.Token,
    'Content-Type': commonHeaders.headers['Content-Type']
  }, null, 2));
  console.log('Request Body:', JSON.stringify(requestBody, null, 2));

  // Send request
  const response = await apiContext.post(commonEndpoints.endpoints.createUserGroup, {
    data: requestBody
  });

  const status = response.status();
  const responseBody = await response.text();

  console.log('\n--- Create User Group Response ---');
  console.log('Status:', status);
  console.log('Response Body:', responseBody);

  expect([200, 201, 400]).toContain(status);

  let parsed;
  try {
    parsed = JSON.parse(responseBody);
  } catch (err) {
    throw new Error(`Failed to parse response JSON: ${err}`);
  }

  expect(parsed).toHaveProperty('StatusMessage');
  expect(parsed).toHaveProperty('StatusCode');

  const { StatusMessage, StatusCode } = parsed;

  const isSuccess =
    StatusCode === 201 && StatusMessage === 'User Group has been created.';

  const isWarning =
    StatusCode === 400 && StatusMessage === 'Group Name Already Exist.';

  if (isSuccess) {
    console.log(`Group "${randomGroupName}" created successfully.`);
  } else if (isWarning) {
    console.warn(`Warning: ${StatusMessage} for "${randomGroupName}".`);
  } else {
    throw new Error(`Unexpected response:\n${JSON.stringify(parsed, null, 2)}`);
  }
});

// with this API we can also update the groupname --> need to automate that flow
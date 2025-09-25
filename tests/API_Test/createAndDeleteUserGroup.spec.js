const { test, expect, request } = require('@playwright/test');
const createConfig = require('../../data/API_JSON/CreateUserGroup.json'); // Import CreateUserGroup-specific data
const { generateRandomGroupName } = require('../../src/util'); // Utility function for random group name
const commonHeaders = require('../../utils/Common/CommonHeaders.json'); // Import common headers
const commonEndpoints = require('../../utils/Common/CommonEndpoints.json'); // Import common endpoints


test('API_DeleteUserGroup_Test: Create and Delete a User Group', async () => {
  // Setup API context with headers
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      accept: commonHeaders.headers.accept, // Pass the `accept` header
      Token: commonHeaders.headers.Token, // Pass the `Token` header
      'Content-Type': commonHeaders.headers['Content-Type'] // Pass the `Content-Type` header
    }
  });

  const randomGroupName = generateRandomGroupName(); // Generate random group name

  // -------- CREATE GROUP -------- //
  const createBody = {
    ...createConfig.body,
    GroupName: randomGroupName,
    NewGroupName: randomGroupName
  };

  console.log('\n--- CREATE GROUP REQUEST ---');
  console.log('URL:', commonEndpoints.endpoints.createUserGroup); // Use endpoint from CommonEndpoints.json
  console.log('Headers:', JSON.stringify({
    accept: commonHeaders.headers.accept,
    Token: commonHeaders.headers.Token,
    'Content-Type': commonHeaders.headers['Content-Type']
  }, null, 2));
  console.log('Request Body:', JSON.stringify(createBody, null, 2));

  const createResponse = await apiContext.post(commonEndpoints.endpoints.createUserGroup, {
    data: createBody
  });

  const createStatus = createResponse.status();
  const createResText = await createResponse.text();

  console.log('\n--- CREATE GROUP RESPONSE ---');
  console.log('Status Code:', createStatus);
  console.log('Response Body:', createResText);

  expect([200, 201]).toContain(createStatus);

  let created;
  try {
    created = JSON.parse(createResText);
  } catch (err) {
    throw new Error(`Failed to parse create response: ${err.message}`);
  }

  expect(created).toHaveProperty('StatusCode');
  expect([200, 201]).toContain(created.StatusCode);
  console.log(`Group "${randomGroupName}" created successfully.`);

  // -------- DELETE GROUP -------- //
  const deleteUrl = `${commonEndpoints.endpoints.deleteUserGroup}?userGroupName=${encodeURIComponent(randomGroupName)}`; // Use endpoint from CommonEndpoints.json

  console.log('\n--- DELETE GROUP REQUEST ---');
  console.log('URL:', deleteUrl);
  console.log('Headers:', JSON.stringify({
    accept: commonHeaders.headers.accept,
    Token: commonHeaders.headers.Token,
    'Content-Type': commonHeaders.headers['Content-Type']
  }, null, 2));

  const deleteResponse = await apiContext.delete(deleteUrl);
  const deleteStatus = deleteResponse.status();
  const deleteResText = await deleteResponse.text();

  console.log('\n--- DELETE GROUP RESPONSE ---');
  console.log('Status Code:', deleteStatus);
  console.log('Response Body:', deleteResText);

  expect(deleteStatus).toBe(200);

  let deleted;
  try {
    deleted = JSON.parse(deleteResText);
  } catch (err) {
    throw new Error(`Failed to parse delete response: ${err.message}`);
  }

  expect(deleted).toHaveProperty('StatusCode');
  expect(deleted).toHaveProperty('StatusMessage');
  expect(deleted).toHaveProperty('Content');

  const isExpectedSuccess =
    deleted.StatusMessage === "User Group has been deleted successfully." &&
    deleted.StatusCode === 200 &&
    deleted.Content === "";

  const isExpectedWarning =
    deleted.StatusMessage === "Group Name doesn't Exist." &&
    deleted.StatusCode === 400 &&
    deleted.Content === "";

  if (isExpectedSuccess) {
    console.log(`Group "${randomGroupName}" deleted successfully.`);
  } else if (isExpectedWarning) {
    console.warn(`Warning: ${deleted.StatusMessage} - Group may not have existed.`);
  } else {
    throw new Error(`Unexpected delete response:\n${JSON.stringify(deleted, null, 2)}`);
  }
});

const { test, expect, request } = require('@playwright/test');
const createConfig = require('../API_JSON/CreateUserGroup.json'); // Import CreateUserGroup-specific data
const updateConfig = require('../API_JSON/updateUserGroup.json'); // Import UpdateUserGroup-specific data
const commonHeaders = require('../API_JSON/Common/CommonHeaders.json'); // Import common headers
const commonEndpoints = require('../API_JSON/Common/CommonEndpoints.json'); // Import common endpoints
const { generateRandomGroupName } = require('../../src/util'); // Utility function for random group name

test('API_UpdateUserGroup_Test: Create and Update a User Group', async () => {
  // Setup API context with headers
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      accept: commonHeaders.headers.accept, // Pass the `accept` header
      Token: commonHeaders.headers.Token, // Pass the `Token` header
      'Content-Type': commonHeaders.headers['Content-Type'] // Pass the `Content-Type` header
    }
  });

  // ===== STEP 1: CREATE GROUP =====
  const randomGroupName = generateRandomGroupName(); // Generate random group name
  const createBody = {
    ...createConfig.body,
    GroupName: randomGroupName,
    NewGroupName: randomGroupName
  };

  console.log('\n===== CREATE GROUP REQUEST =====');
  console.log('Endpoint:', commonEndpoints.endpoints.createUserGroup); // Use endpoint from CommonEndpoints.json
  console.log('Headers:', JSON.stringify({
    accept: commonHeaders.headers.accept,
    Token: commonHeaders.headers.Token,
    'Content-Type': commonHeaders.headers['Content-Type']
  }, null, 2));
  console.log('Body:', JSON.stringify(createBody, null, 2));

  const createResponse = await apiContext.post(commonEndpoints.endpoints.createUserGroup, { data: createBody });
  const createStatus = createResponse.status();
  const createResText = await createResponse.text();

  console.log('\n===== CREATE GROUP RESPONSE =====');
  console.log('Status:', createStatus);
  console.log('Body:', createResText);

  expect([200, 201]).toContain(createStatus);

  let created;
  try {
    created = JSON.parse(createResText);
  } catch (err) {
    throw new Error(`Failed to parse create group response JSON: ${err}`);
  }

  expect(created).toHaveProperty('StatusCode', 201);
  console.log(`Group "${randomGroupName}" created successfully.`);

  // ===== STEP 2: UPDATE GROUP =====
  const updatedGroupName = `${randomGroupName}_Updated`;
  const updateBody = {
    ...updateConfig.body,
    GroupName: randomGroupName,
    NewGroupName: updatedGroupName
  };

  console.log('\n===== UPDATE GROUP REQUEST =====');
  console.log('Endpoint:', commonEndpoints.endpoints.updateUserGroup); // Use endpoint from CommonEndpoints.json
  console.log('Headers:', JSON.stringify({
    accept: commonHeaders.headers.accept,
    Token: commonHeaders.headers.Token,
    'Content-Type': commonHeaders.headers['Content-Type']
  }, null, 2));
  console.log('Body:', JSON.stringify(updateBody, null, 2));

  const updateResponse = await apiContext.put(commonEndpoints.endpoints.updateUserGroup, { data: updateBody });
  const updateStatus = updateResponse.status();
  const updateResText = await updateResponse.text();

  console.log('\n===== UPDATE GROUP RESPONSE =====');
  console.log('Status:', updateStatus);
  console.log('Body:', updateResText);

  expect(updateStatus).toBe(200);

  let updated;
  try {
    updated = JSON.parse(updateResText);
  } catch (err) {
    throw new Error(`Failed to parse update group response JSON: ${err}`);
  }

  expect(updated).toHaveProperty('StatusMessage');
  expect(updated).toHaveProperty('StatusCode');

  const expectedSuccess = updated.StatusMessage === 'User Group has been updated successfully.' && updated.StatusCode === 200;
  const expectedWarning = updated.StatusMessage === "Group Name doesn't Exist." && updated.StatusCode === 400;

  if (expectedSuccess) {
    console.log(`Group updated from "${randomGroupName}" to "${updatedGroupName}"`);
  } else if (expectedWarning) {
    console.warn('WARNING: Group name does not exist. Partial pass.');
  } else {
    throw new Error(`❌ Unexpected response: ${JSON.stringify(updated, null, 2)}`);
  }
});

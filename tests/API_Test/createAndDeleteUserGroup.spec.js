const { test, expect, request } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const createConfig = require('../API_JSON/CreateUserGroup.json');
const deleteConfig = require('../API_JSON/createAndDeleteUserGroup.json');
const { generateRandomGroupName } = require('../../src/util');

test('API_DeleteUserGroup_Test: Create and Delete a User Group', async () => {
    const apiContext = await request.newContext({
        extraHTTPHeaders: {
          ...deleteConfig.headers
        }
    });

  // Generate a random group name
  const randomGroupName = generateRandomGroupName();

  // -------- CREATE GROUP -------- //
  const createBody = {
    ...createConfig.body,
    GroupName: randomGroupName,
    NewGroupName: randomGroupName
  };

  console.log('\n🛠️ Creating Group...');
  console.log('Endpoint:', createConfig.api.endpoint);
  console.log('Request Body:', JSON.stringify(createBody, null, 2));

  const createResponse = await apiContext.post(createConfig.api.endpoint, {
    data: createBody
  });

  const createStatus = createResponse.status();
  const createResText = await createResponse.text();

  console.log('\nCreate Group Response:');
  console.log('Status:', createStatus);
  console.log('Response:', createResText);

  expect([200, 201]).toContain(createStatus);

  const created = JSON.parse(createResText);
  if (created.StatusCode !== 200) {
    console.log(`Group "${randomGroupName}" created successfully.`);
  }

  // -------- DELETE GROUP -------- //
  const deleteUrl = `${deleteConfig.api.baseUrl}?userGroupName=${encodeURIComponent(randomGroupName)}`;

  console.log('\nDeleting Group...');
  console.log('Endpoint:', deleteUrl);

  const deleteResponse = await apiContext.delete(deleteUrl);
  const deleteStatus = deleteResponse.status();
  const deleteResText = await deleteResponse.text();

  console.log('\nDelete Group Response:');
  console.log('Status:', deleteStatus);
  console.log('Response:', deleteResText);

  expect(deleteStatus).toBe(200);

  const deleted = JSON.parse(deleteResText);
  if (deleted.StatusCode === 200) {
    console.log(`Group "${randomGroupName}" deleted successfully.`);
  } else {
    throw new Error(`Delete failed: ${deleted.StatusMessage}`);
  }
});

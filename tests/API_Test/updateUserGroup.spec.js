const { test, expect, request } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const createConfig = require('../API_JSON/CreateUserGroup.json');
const updateConfig = require('../API_JSON/updateUserGroup.json');
const { generateRandomGroupName } = require('../../src/util');

test('API_UpdateUserGroup_Test: Create and Update a User Group', async () => {
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      ...updateConfig.headers
    }
  });

  // Step 1: Create Group
  const randomGroupName = generateRandomGroupName();
  const createBody = {
    ...createConfig.body,
    GroupName: randomGroupName,
    NewGroupName: randomGroupName
  };

  console.log('\n--- Create Group Request ---');
  console.log('Endpoint:', createConfig.api.endpoint);
  console.log('Body:', JSON.stringify(createBody, null, 2));

  const createResponse = await apiContext.post(createConfig.api.endpoint, {
    data: createBody
  });

  const createStatus = createResponse.status();
  const createResText = await createResponse.text();

  console.log('\n--- Create Group Response ---');
  console.log('Status:', createStatus);
  console.log('Body:', createResText);

  expect([200, 201]).toContain(createStatus);

  const created = JSON.parse(createResText);
  expect(created).toHaveProperty('StatusCode');

  if (created.StatusCode !== 200) {
    console.log(`Group "${randomGroupName}" created successfully.`);
  }

  // Step 2: Update Group
  const updatedGroupName = `${randomGroupName}_Updated`;
  const updateBody = {
    ...updateConfig.body,
    GroupName: randomGroupName,
    NewGroupName: updatedGroupName
  };

  console.log('\n--- Update Group Request ---');
  console.log('Endpoint:', updateConfig.api.endpoint);
  console.log('Body:', JSON.stringify(updateBody, null, 2));

  const updateResponse = await apiContext.put(updateConfig.api.endpoint, {
    data: updateBody
  });

  const updateStatus = updateResponse.status();
  const updateResText = await updateResponse.text();

  console.log('\n--- Update Group Response ---');
  console.log('Status:', updateStatus);
  console.log('Body:', updateResText);

  expect(updateStatus).toBe(200);

  const updated = JSON.parse(updateResText);
  expect(updated).toHaveProperty('StatusCode');

  if (updated.StatusCode === 200) {
    console.log(`Group updated from "${randomGroupName}" to "${updatedGroupName}"`);
  } else {
    throw new Error(`Update failed: ${updated.StatusMessage}`);
  }
});

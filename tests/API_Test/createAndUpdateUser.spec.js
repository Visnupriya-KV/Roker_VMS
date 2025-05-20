const { test, expect, request } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const createConfig = require('../API_JSON/CreateUser.json');
const updateConfig = require('../API_JSON/createAndUpdateUser.json');
const { generateRandomString, generateRandomEmail } = require('../../src/util');

test('API_UpdateUser_Test: Create and Update a User', async () => {
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
        ...updateConfig.headers
      }
  });

  // Step 1: Create User
  const randomUserName = generateRandomString('user');
  const randomEmail = generateRandomEmail('user');

  const createBody = {
    ...createConfig.body,
    UserName: randomUserName,
    EmailAddress: randomEmail
  };

  console.log('\n--- Create User Request ---');
  console.log('Endpoint:', createConfig.endpoint);
  console.log('Body:', JSON.stringify(createBody, null, 2));

  const createResponse = await apiContext.post(createConfig.api.endpoint, {
    data: createBody
  });

  const createStatus = createResponse.status();
  const createResText = await createResponse.text();

  console.log('\n--- Create User Response ---');
  console.log('Status:', createStatus);
  console.log('Body:', createResText);

  expect([200, 201]).toContain(createStatus);

  const created = JSON.parse(createResText);
  expect(created).toHaveProperty('StatusCode');

  if (created.StatusCode !== 200) {
    console.log(`UserName "${randomUserName}" created successfully.`);
  }

  // Step 2: Update User
  const updatedFirstName = `${createBody.FirstName}_Updated`;


  const updateBody = {
    ...updateConfig.body,
    UserName: createBody.UserName, // carry over the created user's name
  FirstName: updatedFirstName,
  MiddleName: createBody.MiddleName,
  LastName: createBody.LastName,
  EmailAddress: createBody.EmailAddress,
  Badge: createBody.Badge,
  UserGroupName: createBody.UserGroupName,
  SubClientId: createBody.SubClientId
  };

  console.log('\n--- Update User Request ---');
  console.log('Endpoint:', updateConfig.api.endpoint);
  console.log('Body:', JSON.stringify(updateBody, null, 2));

  const updateResponse = await apiContext.put(updateConfig.api.endpoint, {
    data: updateBody
  });

  const updateStatus = updateResponse.status();
  const updateResText = await updateResponse.text();

  console.log('\n--- Update User Response ---');
  console.log('Status:', updateStatus);
  console.log('Body:', updateResText);

  expect(updateStatus).toBe(200);

  const updated = JSON.parse(updateResText);
  expect(updated).toHaveProperty('StatusCode');

  if (updated.StatusCode === 200) {
    console.log(`User First name updated: ${createBody.FirstName} with new first name "${updatedFirstName}" for the UserName ${createBody.UserName}`);
  } else {
    throw new Error(`Update failed: ${updated.StatusMessage}`);
  }
});

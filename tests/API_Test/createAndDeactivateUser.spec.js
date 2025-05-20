const { test, expect, request } = require('@playwright/test');
const createConfig = require('../API_JSON/CreateUser.json');
const deactivateConfig = require('../API_JSON/createAndDeactivateUser.json');
const { generateRandomName, generateRandomEmail } = require('../../src/util');

test('API_DeactivateUser_Test: Create and Deactivate a User', async () => {
  // Step 1: Create a User
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      ...createConfig.headers
    }
  });

  const randomUserName = generateRandomName('user');
  const randomEmail = generateRandomEmail('user');

  const createBody = {
    ...createConfig.body,
    UserName: randomUserName,
    EmailAddress: randomEmail
  };

  console.log('\n--- Create User Request ---');
  console.log('Endpoint:', createConfig.api.endpoint);
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
  expect(created.StatusCode).toBe(201);

  // Step 2: Deactivate the same user
  const deactivateContext = await request.newContext({
    extraHTTPHeaders: {
      ...deactivateConfig.headers
    }
  });

  const deactivateUrl = `${deactivateConfig.api.endpoint}?userName=${randomUserName}`;

  console.log('\n--- Deactivate User Request ---');
  console.log('Endpoint:', deactivateUrl);

  const deactivateResponse = await deactivateContext.delete(deactivateUrl);
  const deactivateStatus = deactivateResponse.status();
  const deactivateResText = await deactivateResponse.text();

  console.log('\n--- Deactivate User Response ---');
  console.log('Status:', deactivateStatus);
  console.log('Body:', deactivateResText);

  expect(deactivateStatus).toBe(200);

  const deactivated = JSON.parse(deactivateResText);
  expect(deactivated.StatusCode).toBe(200);
  console.log(`User "${randomUserName}" successfully created and deactivated.`);
});

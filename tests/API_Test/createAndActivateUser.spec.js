const { test, expect, request } = require('@playwright/test');
const createConfig = require('../API_JSON/CreateUser.json');
const activateConfig = require('../API_JSON/createAndActivateUser.json');
const { generateRandomName, generateRandomEmail } = require('../../src/util');

test('API_ActivateUser_Test: Create and Activate a User', async () => {
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      ...createConfig.headers
    }
  });

  // Step 1: Create a User
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

  // Step 2: Activate the same user
  const activateContext = await request.newContext({
    extraHTTPHeaders: {
      ...activateConfig.headers
    }
  });

  const activateUrl = `${activateConfig.api.endpoint}?userName=${randomUserName}`;

  console.log('\n--- Activate User Request ---');
  console.log('Endpoint:', activateUrl);

  const activateResponse = await activateContext.post(activateUrl);

  const activateStatus = activateResponse.status();
  const activateResText = await activateResponse.text();

  console.log('\n--- Activate User Response ---');
  console.log('Status:', activateStatus);
  console.log('Body:', activateResText);

  expect(activateStatus).toBe(200);

  const activated = JSON.parse(activateResText);
  expect(activated.StatusCode).toBe(200);
  console.log(`User "${randomUserName}" created and activated successfully.`);
});

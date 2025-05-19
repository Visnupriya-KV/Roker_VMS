const { test, expect, request } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const config = require('../API_JSON/CreateUserGroup.json');
const {generateRandomGroupName} = require("../../src/util");

test('API_CreateUserGroup_Test: Create a user group with random name and log it', async () => {
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      ...config.headers
    }
  });

  const randomGroupName = generateRandomGroupName();
  const requestBody = {
    ...config.body,
    GroupName: randomGroupName,
    NewGroupName: randomGroupName
  };

  // 🔍 Log API request details
  console.log('\n********************API Request Details********************');
  console.log('Endpoint     :', config.api.endpoint);
  console.log('Method       : POST');
  console.log('Headers      :', JSON.stringify(config.headers, null, 2));
  console.log('Request Body :', JSON.stringify(requestBody, null, 2));

  const response = await apiContext.post(config.api.endpoint, {
    data: requestBody
  });

  const status = response.status();
  const responseBody = await response.text();

  // 🔍 Log API response details
  console.log('\n________API Response Detail_______');
  console.log('Status     :', status);
  console.log('Raw Response :', responseBody);

  expect([200, 201]).toContain(status);

  let parsed;
  try {
    parsed = JSON.parse(responseBody);
  } catch (err) {
    throw new Error(`Failed to parse JSON: ${err}`);
  }

  expect(parsed).toHaveProperty('StatusMessage');
  expect(parsed).toHaveProperty('StatusCode');

  if (parsed.StatusCode === 200) {
    console.log(`Group "${randomGroupName}" created successfully.`);

    // Save group name to a file
    const logData = {
      GroupName: randomGroupName,
      Timestamp: new Date().toISOString()
    };
    fs.writeFileSync(logFilePath, JSON.stringify(logData, null, 2));
    console.log(`Group name logged to: ${logFilePath}`);
  } else {
    console.warn(`Group creation may have failed: ${parsed.StatusMessage}`);
  }
});

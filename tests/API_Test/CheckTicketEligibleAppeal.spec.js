const { test, expect, request } = require('@playwright/test');
const config = require('../API_JSON/CheckTicketEligibleAppeal.json');

test('API_CheckTicketEligibleAppeal_Test: Validate citation eligibility for appeal', async () => {
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      ...config.headers
    }
  });

  const response = await apiContext.post(config.api.checkAppealEligibility);
  const responseBody = await response.text();

  console.log('📡 Status:', response.status());
  console.log('📦 Raw Response Body:', responseBody);

  // ✅ Validate status
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  // ✅ Parse and validate JSON structure
  let parsed;
  try {
    parsed = JSON.parse(responseBody);
  } catch (err) {
    throw new Error(`❌ Failed to parse response as JSON: ${err}`);
  }

  // ✅ Basic validations
  expect(parsed).toHaveProperty('StatusMessage');
  expect(parsed).toHaveProperty('StatusCode');
  expect(parsed).toHaveProperty('Content');

  expect(['True', 'False']).toContain(parsed.StatusMessage);
  expect(parsed.StatusCode).toBe(200);
  expect(typeof parsed.Content).toBe('string');

  // ✅ Optional: Log and validate Content message
  console.log('📝 Appeal Status:', parsed.Content);

  // Optional: Add more strict validations if needed
  const allowedMessages = [
    'Appeal Enabled.',
    'Appeal Disabled.',
    'Appeal Disabled as Ticket is already in Appeal.',
    'Appeal Disabled as Ticket in Review.',
    'Appeal Disabled as Ticket in Extension.'
  ];

  expect(allowedMessages).toContain(parsed.Content);
});


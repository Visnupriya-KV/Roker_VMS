const { test, expect, request } = require('@playwright/test');
const config = require('../API_JSON/UpdateTicketEnforcement.json');

test('API_UpdateTicketEnforcement_Test: Update ticket enforcement data and validate response', async () => {
  const apiContext = await request.newContext({
    extraHTTPHeaders: config.headers
  });

  const response = await apiContext.post(config.api.updateTicketEnforcement, {
    data: config.requestBody
  });

  const status = response.status();
  const responseBody = await response.text();

  console.log('📡 Status:', status);
  console.log('📦 Raw Response:', responseBody);

  let parsed;
  try {
    parsed = JSON.parse(responseBody);
  } catch (err) {
    throw new Error(` Failed to parse response JSON: ${err}`);
  }

  // ✅ Basic expectations
  expect([200, 201]).toContain(status);
  expect(parsed).toHaveProperty('StatusMessage');
  expect(parsed).toHaveProperty('StatusCode');
  expect(parsed).toHaveProperty('Content');

  // Optional logs
  if (parsed.StatusCode === 200) {
    console.log('✅ Ticket updated:', parsed.Content);
  } else {
    console.warn(` Ticket update failed: ${parsed.StatusMessage} - ${parsed.Content}`);
  }
});


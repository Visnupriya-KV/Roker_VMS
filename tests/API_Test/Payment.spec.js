const { test, expect, request } = require('@playwright/test');
const config = require('../API_JSON/Payment.json');

test('API_PostPayment: Make a payment and verify the response', async () => {
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      ...config.headers
    }
  });

  const response = await apiContext.post(config.api.endpoint, {
    data: config.body
  });

  const status = response.status();
  const responseBody = await response.text();

  console.log('📡 Status:', status);
  console.log('Response:', responseBody);

  expect([200, 201]).toContain(status);

  let parsed;
  try {
    parsed = JSON.parse(responseBody);
  } catch (err) {
    throw new Error(`Failed to parse response JSON: ${err}`);
  }

  // Optional assertions depending on expected response
  expect(parsed).toHaveProperty('StatusMessage');
  expect(parsed).toHaveProperty('StatusCode');
});

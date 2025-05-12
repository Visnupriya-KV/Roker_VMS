const { test, expect, request } = require('@playwright/test');
const config = require('../API_JSON/CreatePayment.json');

test('API_CreatePayment_Test: Submit a payment and validate response', async () => {
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      ...config.headers
    }
  });

  const response = await apiContext.post(config.api.endpoint, {
    data: config.payload
  });

  const status = response.status();
  const responseBody = await response.text();

  console.log('📡 Status:', status);
  console.log('Raw Response:', responseBody);

  expect([200]).toContain(status);

  let parsed;
  try {
    parsed = JSON.parse(responseBody);
  } catch (err) {
    throw new Error(`Failed to parse response JSON: ${err}`);
  }

  expect(parsed).toHaveProperty('StatusCode');
  expect(parsed).toHaveProperty('StatusMessage');

  if (parsed.StatusCode === 200) {
    console.log('✅ Payment successfully created:', parsed.StatusMessage);
  } else {
    console.warn(`Payment failed: ${parsed.StatusMessage}`);
  }
});

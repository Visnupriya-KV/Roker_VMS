const { test, expect, request } = require('@playwright/test');
const config = require('../API_JSON/AppealRequest.json');

test('API_AppealRequest_Test: Submit an appeal request and validate response', async () => {
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      ...config.headers
    }
  });

  const response = await apiContext.post(config.api.appealRequest, {
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

  // ✅ Base expectations
  expect([200]).toContain(status);
  expect(parsed).toHaveProperty('StatusMessage');
  expect(parsed).toHaveProperty('StatusCode');
  expect(parsed).toHaveProperty('Content');

  // 🧠 Optional: Smart checks based on response
  if (parsed.StatusCode === 200) {
    console.log('✅ Appeal Submitted:', parsed.Content);
  } else {
    console.warn(`Appeal Failed: ${parsed.StatusMessage} - ${parsed.Content}`);
  }
});


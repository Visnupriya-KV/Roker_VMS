const { test, expect, request } = require('@playwright/test');
const config = require('../API_JSON/ticketlookupByTicketNo.json');

test('API_TicketLookup_ByTicketNo_Test: Validate ticket lookup response', async () => {
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      ...config.headers
    }
  });

  const { endpoint, queryParams } = config.api;
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = `${endpoint}?${queryString}`;

  const response = await apiContext.get(fullUrl);
  const status = response.status();
  const body = await response.text();

  console.log('📡 Status:', status);
  console.log('Response:', body);

  expect([200]).toContain(status);

  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch (err) {
    throw new Error(`Failed to parse JSON: ${err}`);
  }

  expect(parsed).toHaveProperty('StatusMessage');
  expect(parsed).toHaveProperty('StatusCode');

  if (parsed.StatusCode === 200 && parsed.Content?.length > 0) {
    console.log('✅ Ticket Found:', parsed.Content[0]);
  } else {
    console.warn('No ticket found or unexpected response.');
  }
});

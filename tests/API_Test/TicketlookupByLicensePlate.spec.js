const { test, expect, request } = require('@playwright/test');
const config = require('../API_JSON/TicketlookupByLicensePlate.json');
const qs = require('querystring');

test('API_TicketLookup_ByLicensePlate_Test: Validate lookup response', async () => {
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      ...config.headers
    }
  });

  // Build full URL with query params
  const fullUrl = `${config.api.endpoint}?${qs.stringify(config.api.queryParams)}`;

  const response = await apiContext.get(fullUrl);
  const status = response.status();
  const bodyText = await response.text();

  console.log('📡 Status:', status);
  console.log('Response:', bodyText);

  expect([200]).toContain(status);

  let parsed;
  try {
    parsed = JSON.parse(bodyText);
  } catch (err) {
    throw new Error(`Failed to parse JSON: ${err}`);
  }

  expect(parsed).toHaveProperty('StatusMessage');
  expect(parsed).toHaveProperty('StatusCode');

  if (parsed.StatusCode === 200 && parsed.Content?.length > 0) {
    console.log('✅ Tickets found:', parsed.Content.length);
    expect(parsed.Content[0]).toHaveProperty('LicensePlate', config.api.queryParams.licensePlate);
  } else {
    console.warn('No tickets found or unsuccessful lookup.');
  }
});

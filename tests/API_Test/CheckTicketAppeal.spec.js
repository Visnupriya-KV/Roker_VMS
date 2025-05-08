const { test, expect, request } = require('@playwright/test');
const config = require('../API_JSON/CheckTicketAppeal.json');

test('API_CheckTicketAppeal_Test: Check if ticket is in appeal via API only', async () => {
  const apiContext = await request.newContext();

  const response = await apiContext.post(
    `${config.api.checkTicketAppeal}?CitationNo=${config.citationNumber}`,
    {
      headers: config.headers
    }
  );

  console.log('📡 API Status:', response.status());

  const responseBody = await response.text();
  console.log('API Response:', responseBody);

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
});


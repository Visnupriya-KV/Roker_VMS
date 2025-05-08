const { test, expect, request } = require('@playwright/test');
const config = require('../API_JSON/getticketstage.json');


test('API_Getticketstage_Test: GET ticket stage by citationNo', async ({ playwright }) => {
  const apiContext = await playwright.request.newContext();

  const citationNo = config.requestBody.CitationNo;
  const url = `${config.api.getTicketStage}?citationNo=${citationNo}`;
  const headers = config.headers;

  const response = await apiContext.get(url, { headers });

  const status = response.status();
  const responseBody = await response.text();

  console.log('📦 Status Code:', status);
  console.log('Response Body:', responseBody);

  expect(status).toBe(200);
});


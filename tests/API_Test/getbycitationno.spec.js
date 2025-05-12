const { test, expect, request } = require('@playwright/test');
const config = require('../API_JSON/getbycitationno.json');

test('API_Get_CitationNoDetails: Validate citation ticket response', async () => {
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      ...config.headers
    }
  });

  const response = await apiContext.get(config.api.endpoint);
  const status = response.status();
  const responseBody = await response.text();

  console.log('📡 Status:', status);
  console.log('Response:', responseBody);

  expect([200]).toContain(status);

  let parsed;
  try {
    parsed = JSON.parse(responseBody);
  } catch (err) {
    throw new Error(`Failed to parse JSON: ${err}`);
  }

  // High-level checks
  expect(parsed).toHaveProperty('StatusMessage', 'Success');
  expect(parsed).toHaveProperty('StatusCode', 200);
  expect(Array.isArray(parsed.Content)).toBe(true);
  expect(parsed.Content.length).toBeGreaterThan(0);

  // Detailed content validation
  const citation = parsed.Content[0];

  expect(citation).toHaveProperty('CitationNo', 'BNREEE');
  expect(citation).toHaveProperty('TagNumber');
  expect(citation).toHaveProperty('Province');
  expect(citation).toHaveProperty('IssueDate');
  expect(citation).toHaveProperty('IssueTime');
  expect(citation).toHaveProperty('AmountDue');
  expect(citation).toHaveProperty('PayableCode');
});

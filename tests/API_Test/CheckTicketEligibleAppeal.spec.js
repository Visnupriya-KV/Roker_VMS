const { test, expect, request } = require('@playwright/test');
const commonHeaders = require('../API_JSON/Common/CommonHeaders.json'); // Import common headers
const commonEndpoints = require('../API_JSON/Common/CommonEndpoints.json'); // Import common endpoints
const config = require('../API_JSON/CheckTicketEligibleAppeal.json'); // Import API-specific data

test('API_CheckTicketEligibleAppeal_Test: Validate citation eligibility for appeal', async () => {
  // Setup API context with headers
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      accept: commonHeaders.headers.accept // Pass only the `accept` header
    }
  });

  // Construct the URL using CommonEndpoints.json and citationNumber from CheckTicketEligibleAppeal.json
  const url = `${commonEndpoints.endpoints.checkAppealEligibility}?CitationNo=${config.citationNumber}`;

  // Log Request Info
  console.log('\nREQUEST');
  console.log('URL:', url);
  console.log('Headers:', JSON.stringify({ accept: commonHeaders.headers.accept }, null, 2));

  // Make the API call
  const response = await apiContext.post(url);
  const responseBody = await response.text();
  const status = response.status();

  // Log Response Info
  console.log('\nRESPONSE');
  console.log('Status Code:', status);
  console.log('Body:', responseBody);

  // Validate HTTP status
  expect(status, 'Expected HTTP 200 OK').toBe(200);

  // Parse JSON response
  let parsed;
  try {
    parsed = JSON.parse(responseBody);
  } catch (err) {
    throw new Error(`Failed to parse response as JSON:\n${err.message}`);
  }

  // Schema Validations
  expect(parsed).toHaveProperty('StatusMessage');
  expect(parsed).toHaveProperty('StatusCode');
  expect(parsed).toHaveProperty('Content');

  // Value Validations - Allowed responses
  const allowedResponses = [
    {
      StatusMessage: "True",
      StatusCode: 200,
      Content: "Appeal Enabled"
    },
    {
      StatusMessage: "True",
      StatusCode: 200,
      Content: "Appeal Disabled"
    },
    {
      StatusMessage: "False",
      StatusCode: 200,
      Content: "Appeal Disabled as Ticket is already in Appeal."
    },
    {
      StatusMessage: "False",
      StatusCode: 200,
      Content: "Appeal Disabled as Ticket in Review."
    },
    {
      StatusMessage: "False",
      StatusCode: 200,
      Content: "Appeal Disabled as Ticket in Extension."
    }
  ];

  const isResponseAllowed = allowedResponses.some(expected =>
    expected.StatusMessage === parsed.StatusMessage &&
    expected.StatusCode === parsed.StatusCode &&
    expected.Content === parsed.Content
  );

  expect(isResponseAllowed, 'Response does not match any of the allowed formats').toBeTruthy();

  console.log('\nTest Passed: Response matched one of the approved formats.\n');
});


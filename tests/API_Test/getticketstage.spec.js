const { test, expect, request } = require('@playwright/test');
const commonHeaders = require('../API_JSON/Common/CommonHeaders.json'); // Import common headers
const commonEndpoints = require('../API_JSON/Common/CommonEndpoints.json'); // Import common endpoints
const config = require('../API_JSON/getticketstage.json'); // Import citationNo-specific data

test('API_Getticketstage_Test: GET ticket stage by citationNo', async () => {
  // Setup API context with headers
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      accept: commonHeaders.headers.accept // Pass only the `accept` header
    }
  });

  // Construct the endpoint using CommonEndpoints.json and citationNo from getticketstage.json
  const endpoint = `${commonEndpoints.endpoints.getTicketStage}?citationNo=${config.requestBody.CitationNo}`;

  // Log API request
  console.log('\n========= API REQUEST =========');
  console.log('Method       : GET');
  console.log('Endpoint     :', endpoint);
  console.log('Headers      :', JSON.stringify({ accept: commonHeaders.headers.accept }, null, 2));
  console.log('Query Params :', `citationNo=${config.requestBody.CitationNo}`);

  // Send the API request
  const response = await apiContext.get(endpoint);
  const status = response.status();
  const responseBody = await response.text();

  // Log API response
  console.log('\n========= API RESPONSE =========');
  console.log('Status Code   :', status);
  console.log('Raw Body      :', responseBody);

  // Validate HTTP status
  expect(status).toBe(200);

  let parsed;
  try {
    parsed = JSON.parse(responseBody);
  } catch (err) {
    throw new Error(`Failed to parse JSON response: ${err}`);
  }

  // Log parsed response
  console.log('\n========= PARSED RESPONSE =========');
  console.log(JSON.stringify(parsed, null, 2));

  // Validate response structure
  expect(parsed).toHaveProperty('StatusMessage', 'Success');
  expect(parsed).toHaveProperty('StatusCode', 200);

  const { Content } = parsed;

  // Validate Content structure and StageName value
  if (
    typeof Content === 'object' &&
    ['TICKET ISSUED', 'CLOSED'].includes(Content.StageName) &&
    typeof Content.StageCompleted === 'number' &&
    typeof Content.TagState === 'string' &&
    typeof Content.HoldPayment === 'string'
  ) {
    console.log(`\nValid ticket stage response received. StageName: ${Content.StageName}`);
  } else {
    throw new Error(`Unexpected Content structure or StageName:\n${JSON.stringify(Content, null, 2)}`);
  }
});


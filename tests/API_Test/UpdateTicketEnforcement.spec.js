const { test, expect, request } = require('@playwright/test');
const updateConfig = require('../API_JSON/UpdateTicketEnforcement.json'); // Import UpdateTicketEnforcement-specific data
const commonHeaders = require('../API_JSON/Common/CommonHeaders.json'); // Import common headers
const commonEndpoints = require('../API_JSON/Common/CommonEndpoints.json'); // Import common endpoints

test('API_UpdateTicketEnforcement_Test: Update ticket enforcement data and validate response', async () => {
  // Setup API context with headers
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      accept: commonHeaders.headers.accept, // Pass the `accept` header
      'Content-Type': commonHeaders.headers['Content-Type'] // Pass the `Content-Type` header
    }
  });

  // Construct the endpoint using CommonEndpoints.json
  const endpoint = commonEndpoints.endpoints.updateTicketEnforcement;

  // Log API Request
  console.log('\n********** API REQUEST **********');
  console.log('Endpoint      :', endpoint);
  console.log('Headers       :', JSON.stringify({
    accept: commonHeaders.headers.accept,
    'Content-Type': commonHeaders.headers['Content-Type']
  }, null, 2));
  console.log('Request Body  :', JSON.stringify(updateConfig.requestBody, null, 2));

  // Make the API request
  const response = await apiContext.post(endpoint, {
    data: updateConfig.requestBody
  });

  const status = response.status();
  const responseBody = await response.text();

  // Log API Response
  console.log('\n********** API RESPONSE **********');
  console.log('Status Code   :', status);
  console.log('Response Body :', responseBody);

  // Basic validations
  expect([200, 201]).toContain(status);

  let parsed;
  try {
    parsed = JSON.parse(responseBody);
  } catch (err) {
    throw new Error(`Failed to parse JSON: ${err}`);
  }

  // Strict response validation
  expect(parsed).toHaveProperty('StatusMessage', 'Success');
  expect(parsed).toHaveProperty('StatusCode', 200);
  expect(parsed).toHaveProperty('Content', 'Record successfully updated.');

  console.log('\nTicket enforcement record updated successfully.');
});

const { test, expect, request } = require('@playwright/test');
const commonHeaders = require('../../utils/Common/CommonHeaders.json'); // Import common headers
const commonEndpoints = require('../../utils/Common/CommonEndpoints.json'); // Import common endpoints
const config = require('../../data/API_JSON/ticketlookupByTicketNo.json'); // Import ticket-specific data

test('API_TicketLookup_ByTicketNo_Test: Validate ticket lookup response', async () => {
  // Setup API context with headers
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      accept: commonHeaders.headers.accept // Pass only the `accept` header
    }
  });

  // Construct URL using CommonEndpoints.json and query parameters from ticketlookupByTicketNo.json
  const queryString = new URLSearchParams(config.api.queryParams).toString();
  const fullUrl = `${commonEndpoints.endpoints.ticketlookupByTicketNo}?${queryString}`;

  // Log API Request
  console.log('\n********** API REQUEST **********');
  console.log('Method       : GET');
  console.log('Endpoint     :', commonEndpoints.endpoints.ticketlookupByTicketNo);
  console.log('Query Params :', JSON.stringify(config.api.queryParams, null, 2));
  console.log('Full URL     :', fullUrl);
  console.log('Headers      :', JSON.stringify({ accept: commonHeaders.headers.accept }, null, 2));

  // Send request
  const response = await apiContext.get(fullUrl);
  const status = response.status();
  const body = await response.text();

  // Log API Response
  console.log('\n********** API RESPONSE **********');
  console.log('Status Code  :', status);
  console.log('Response Body:', body);

  // Validate HTTP status
  expect(status).toBe(200);

  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch (err) {
    throw new Error(`Failed to parse JSON: ${err}`);
  }

  expect(parsed).toHaveProperty('StatusMessage', 'Success');
  expect(parsed).toHaveProperty('StatusCode', 200);

  // Validate Content structure
  if (
    typeof parsed.Content === 'object' &&
    parsed.Content?.TotalTickets > 0 &&
    Array.isArray(parsed.Content.TicketSummonsInfo) &&
    parsed.Content.TicketSummonsInfo.length > 0
  ) {
    const ticket = parsed.Content.TicketSummonsInfo[0];

    // Required field validations
    expect(ticket).toHaveProperty('IssueNo');
    expect(ticket).toHaveProperty('LicPlate');
    expect(ticket).toHaveProperty('IssueDate');
    expect(ticket).toHaveProperty('AmountDue');
    expect(ticket).toHaveProperty('DueDate');

    console.log('\nTicket Found:');
    console.log(JSON.stringify(ticket, null, 2));
  } else {
    throw new Error('Unexpected response: Ticket not found or invalid Content structure.');
  }
});

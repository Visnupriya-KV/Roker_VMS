const { test, expect, request } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const commonHeaders = require('../API_JSON/Common/CommonHeaders.json'); // Import common headers
const commonEndpoints = require('../API_JSON/Common/CommonEndpoints.json'); // Import common endpoints
const config = require('../API_JSON/AppealUploadDoc.json'); // Import API-specific data

test('API_AppealUploadDoc_Test: Upload a document and expect exact successful response', async () => {
  // Setup API context with headers
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      accept: commonHeaders.headers.accept // Only pass the `accept` header
    }
  });

  // Resolve and validate file path
  const absoluteFilePath = path.resolve(__dirname, config.formData.filePath);
  console.log('\nREQUEST');
  console.log('Upload URL:', commonEndpoints.endpoints.appealUploadDoc); // Use endpoint from CommonEndpoints.json
  console.log('Headers:', JSON.stringify({ accept: commonHeaders.headers.accept }, null, 2));
  console.log('File Path:', absoluteFilePath);

  if (!fs.existsSync(absoluteFilePath)) {
    throw new Error(`File not found: ${absoluteFilePath}`);
  }

  const fileStream = fs.createReadStream(absoluteFilePath);

  // Perform the upload
  const response = await apiContext.post(commonEndpoints.endpoints.appealUploadDoc, {
    multipart: {
      files: fileStream, // Ensure the field name matches server expectations
      CitationNo: config.formData.CitationNo // Use CitationNo from AppealUploadDoc.json
    }
  });

  const status = response.status();
  const responseText = await response.text();

  console.log('\nRESPONSE');
  console.log('Status Code:', status);
  console.log('Body:', responseText);

  if (status !== 200) {
    throw new Error(`Unexpected status code: ${status}`);
  }

  let parsedResponse;
  try {
    parsedResponse = JSON.parse(responseText);
  } catch (err) {
    throw new Error(`Failed to parse JSON response: ${err.message}`);
  }

  // Expected exact success response
  const expectedResponse = {
    StatusMessage: "Document(s) uploaded succesfully.",
    StatusCode: 200,
    Content: []
  };

  // Assert HTTP status
  expect(status, 'Expected HTTP 200 OK').toBe(200);

  // Strictly match the response payload
  expect(parsedResponse, 'Response does not match the exact expected success response').toEqual(expectedResponse);

  console.log('\nTest Passed: Document uploaded and expected response received.\n');
});

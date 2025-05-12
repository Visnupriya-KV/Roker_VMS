const { test, expect, request } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const config = require('../API_JSON/AppealUploadDoc.json');

test('API_AppealUploadDoc_Test: Upload a document and validate response', async () => {
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      ...config.headers
    }
  });

  // Resolve the absolute path correctly based on spec file location
  const absoluteFilePath = path.resolve(__dirname, config.formData.filePath);
  console.log(`File path resolved: ${absoluteFilePath}`);

  if (!fs.existsSync(absoluteFilePath)) {
    throw new Error(`File not found: ${absoluteFilePath}`);
  }

  const response = await apiContext.post(config.api.uploadEndpoint, {
    multipart: {
      files: fs.createReadStream(absoluteFilePath),
      CitationNo: config.formData.CitationNo
    }
  });

  const status = response.status();
  const responseBody = await response.text();

  console.log('Status:', status);
  console.log('Raw Response:', responseBody);

  let parsed;
  try {
    parsed = JSON.parse(responseBody);
  } catch (err) {
    throw new Error(`Failed to parse response JSON: ${err}`);
  }

  // Expectations
  expect([200]).toContain(status);
  expect(parsed).toHaveProperty('StatusMessage');
  expect(parsed).toHaveProperty('StatusCode');

  if (parsed.StatusCode === 200) {
    console.log('✅ Upload Successful:', parsed.StatusMessage);
  } else {
    console.warn(`⚠️ Upload Failed: ${parsed.StatusMessage}`);
  }
});

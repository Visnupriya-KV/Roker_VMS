// utils/dataGenerator.js

export function generateRandomString(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateRandomAddress() {
  const streets = ['Main St', 'Park Ave', 'Broadway', '5th Ave', 'Elm St', 'Oak St', 'Maple St'];
  const street = streets[Math.floor(Math.random() * streets.length)];
  const number = Math.floor(Math.random() * 1000 + 1);
  return `${number} ${street}`;
}

export function generateUniqueLocationName(prefix = 'AutoTestName') {
  return `${prefix}_${generateRandomString(4)}`;
}

export function generateUniqueFeeName(baseName = "AutoTestFee") {
  const uniqueSuffix = Math.random().toString(36).substring(2, 6);
  return `${baseName}_${uniqueSuffix}`;
}

export function generateUniqueName(baseName) {
  const uniqueSuffix = Math.random().toString(36).substring(2, 6);
  return `${baseName}_${uniqueSuffix}`;
}

export function generateRandomLocation() {
  const locations = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Boston",
    "Houston",
    "San Francisco",
    "Seattle",
    "Denver",
    "Miami",
    "Dallas"
  ];
  const randomIndex = Math.floor(Math.random() * locations.length);
  return locations[randomIndex];
}

export function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function selectRandomOption(dropdownLocator) {
  // Wait for at least one option to appear
  await dropdownLocator.locator('option').first().waitFor({ state: 'attached', timeout: 10000 });

  // Get all option elements
  const options = await dropdownLocator.locator('option').all();

  if (options.length === 0) {
    throw new Error('No options found in dropdown');
  }

  // Pick a random index
  const randomIndex = Math.floor(Math.random() * options.length);
  const option = options[randomIndex];

  // Get value or text as fallback
  let value = await option.getAttribute('value');
  if (!value) {
    value = await option.textContent();
    value = value.trim();
  }

  await dropdownLocator.selectOption(value);
  return value;
}

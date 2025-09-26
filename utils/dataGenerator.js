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

export function generateUniqueLocationName(prefix = 'TestName') {
  return `${prefix}_${generateRandomString(4)}`;
}

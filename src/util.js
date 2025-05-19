function generateRandomGroupName(prefix = 'TestGroup') {
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${randomSuffix}`;
}

function generateRandomName(prefix = 'name', length = 6) {
  const randomPart = Math.random().toString(36).substring(2, 2 + length);
  return `${prefix}_${randomPart}`;
}

function generateRandomEmail(prefix = 'user', domain = 'yopmail.com') {
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${randomPart}@${domain}`;
}

module.exports = {
  generateRandomGroupName,
  generateRandomName,
  generateRandomEmail
};

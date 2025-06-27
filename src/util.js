function generateRandomGroupName(prefix = 'AutoGroup') {
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${randomSuffix}`;
}

function generateRandomName(prefix = 'Autoname', length = 6) {
  const randomPart = Math.random().toString(36).substring(2, 2 + length);
  return `${prefix}_${randomPart}`;
}

function generateRandomEmail(prefix = 'Autouser', domain = 'yopmail.com') {
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${randomPart}@${domain}`;
}

function generateRandomString(prefix = 'Autovalue', length = 6) {
  const random = Math.random().toString(36).substring(2, 2 + length);
  return `${prefix}_${random}`;
}

module.exports = {
  generateRandomGroupName,
  generateRandomName,
  generateRandomEmail,
  generateRandomString
};

function generateRandomGroupName(prefix = 'TestGroup') {
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${randomSuffix}`;
  }

  module.exports = {generateRandomGroupName}
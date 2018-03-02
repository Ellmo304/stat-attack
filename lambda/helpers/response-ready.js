// REMOVE AMPERSANDS AND REPLACE WITH 'AND'
module.exports = function (string) {
  return string.replace(/&/g, 'and').replace(/\s{2,}/g, ' ');
};

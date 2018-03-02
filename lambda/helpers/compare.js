module.exports = function compare(a, b) {
  if (a.start_time < b.start_time) {
    return -1;
  }
  if (a.start_time > b.start_time) {
    return 1;
  }
  return 0;
};

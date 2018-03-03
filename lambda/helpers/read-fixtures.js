import formatString from './format-string';

module.exports = function (fixtures) {
  let string = '';
  for (let i = 0; i < fixtures.length; i++) {
    if (i === 0) {
      string += `${formatString(fixtures[i].home)} host ${formatString(fixtures[i].away)}`;
    }
    else if (i !== fixtures.length - 1) {
      string += `, ${formatString(fixtures[i].home)} host ${formatString(fixtures[i].away)}`;
    }
    else {
      string += `and ${formatString(fixtures[i].home)} host ${formatString(fixtures[i].away)}`;
    }
  }
  string += '.';
  return string;
};

module.exports = function (team) {
  return team.replace(/&/g, 'and').replace(/ FC/g, '').replace(/AFC /g, '');
};

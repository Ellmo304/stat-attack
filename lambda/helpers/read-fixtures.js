import formatTeam from './format-team';

module.exports = function (fixtures) {

  // CONVERT FIXTURES OBJECT TO ARRAY AS WE NEED TO LOOP OVER TO GET THE NUMBER OF DAYS AND FIXTURES
  const fixturesArray = Object.keys(fixtures).map(key => fixtures[key]);

  let string = '';

  for (let i = 0; i < fixturesArray.length; i++) {
    string += `On ${fixturesArray[i][0].day}: `;

    for (let j = 0; j < fixturesArray[i].length; j++) {
      if (j === 0) {
        string += `${formatTeam(fixturesArray[i][j].home)} host ${formatTeam(fixturesArray[i][j].away)}`;
      }
      else if (j !== fixturesArray[i].length - 1) {
        string += `, ${formatTeam(fixturesArray[i][j].home)} host ${formatTeam(fixturesArray[i][j].away)}`;
      }
      else {
        // extra comma at start for pause
        string += `, and ${formatTeam(fixturesArray[i][j].home)} host ${formatTeam(fixturesArray[i][j].away)}`;
      }
    }
    string += '. ';
  }

  return string;
};

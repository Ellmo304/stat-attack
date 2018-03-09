import rp from 'request-promise';
import { API_TOKEN } from '../constants/constants';
import formatString from '../helpers/format-string';

module.exports = function () {
  rp({
    headers: { 'X-Auth-Token': API_TOKEN },
    url: 'http://api.football-data.org/v1/competitions/445/leagueTable', // prem league this year, current matchday
    dataType: 'json',
    type: 'GET',
  })
    .then((response) => {
      const data = JSON.parse(response);
      const standings = [];
      for (let i = 0; i < data.standing.length; i++) {
        standings.push({ name: data.standing[i].teamName, points: data.standing[i].points });
      }
      console.log('STANDINGS: ', standings);
      this.attributes.standings = standings;
      this.attributes.currentMatchday = data.matchday;
      this.attributes.expecting = 'continueTable';
      this.emit(
        ':ask',
        `Here are the current standings on matchday ${data.matchday}.
        At the top of the table are ${formatString(standings[0].name)} with ${standings[0].points} points. They are followed by ${formatString(standings[1].name)} with ${standings[1].points} points, ${formatString(standings[2].name)} with ${standings[2].points} points and ${formatString(standings[3].name)} with ${standings[3].points} points. ${formatString(standings[4].name)} are fifth with ${standings[4].points} points, followed by ${formatString(standings[5].name)} with ${standings[5].points} points, ${formatString(standings[6].name)} with ${standings[6].points} points, ${formatString(standings[7].name)} with ${standings[7].points} points, ${formatString(standings[8].name)} with ${standings[8].points} points and ${formatString(standings[9].name)} with ${standings[9].points} points. Would you like to hear the rest of the table?`,
        'Would you like me to read the bottom half of the table?'
      );
    })
    .catch((err) => {
      console.log('API Error: ', err);
      this.emit(':ask', 'Sorry, I can\'t find the current standings at the moment. How else can I help?', 'How else can I help?');
    });
};

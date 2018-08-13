import rp from 'request-promise';
import { API_TOKEN } from '../constants/constants';
import formatTeam from '../helpers/format-team';

module.exports = function () {
  rp({
    headers: { 'X-Auth-Token': API_TOKEN },
    url: 'http://api.football-data.org/v2/competitions/2021/standings', // prem league this year, current matchday
    dataType: 'json',
    type: 'GET',
  })
    .then((response) => {
      const data = JSON.parse(response);
      console.log('DATA: ', data);
      const standings = [];
      for (let i = 0; i < data.standings[0].table.length; i++) {
        standings.push({ name: data.standings[0].table[i].team.name, points: data.standings[0].table[i].points });
      }
      console.log('STANDINGS: ', standings);
      this.attributes.standings = standings;
      this.attributes.currentMatchday = data.season.currentMatchday;
      this.attributes.expecting = 'continueTable';
      this.emit(
        ':ask',
        `Here are the current standings on matchday ${data.season.currentMatchday}.
        At the top of the table are ${formatTeam(standings[0].name)} with ${standings[0].points} points. They are followed by ${formatTeam(standings[1].name)} with ${standings[1].points} points, ${formatTeam(standings[2].name)} with ${standings[2].points} points and ${formatTeam(standings[3].name)} with ${standings[3].points} points. ${formatTeam(standings[4].name)} are fifth with ${standings[4].points} points, followed by ${formatTeam(standings[5].name)} with ${standings[5].points} points, ${formatTeam(standings[6].name)} with ${standings[6].points} points, ${formatTeam(standings[7].name)} with ${standings[7].points} points, ${formatTeam(standings[8].name)} with ${standings[8].points} points and ${formatTeam(standings[9].name)} with ${standings[9].points} points. Would you like to hear the rest of the table?`,
        'Would you like me to read the bottom half of the table?'
      );
    })
    .catch((err) => {
      console.log('API Error: ', err);
      this.attributes.expecting = 'anythingElse';
      this.emit(':ask', 'Sorry, I can\'t find the current standings at the moment. Can I help with anything else today?', 'Can I help with anything else today?');
    });
};

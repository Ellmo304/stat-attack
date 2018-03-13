import rp from 'request-promise';
import { API_TOKEN } from '../constants/constants';

module.exports = function (team, matchday) {
  rp({
    headers: { 'X-Auth-Token': API_TOKEN },
    url: `http://api.football-data.org/v1/competitions/445/fixtures/?matchday=${matchday}`, // this gameweek's fixture list
    dataType: 'json',
    type: 'GET',
  })
    .then((response) => {
      const data = JSON.parse(response);
      const results = [];
      for (let i = 0; i < data.fixtures.length; i++) {
        results.push({
          home: data.fixtures[i].homeTeamName,
          away: data.fixtures[i].awayTeamName,
          homeGoals: data.fixtures[i].result.goalsHomeTeam,
          awayGoals: data.fixtures[i].result.goalsAwayTeam,
          status: data.fixtures[i].status,
          matchday: data.fixtures[i].matchday,
        });
      }
      this.attributes.currentResults = results;
      this.attributes.teamSlot = team;
      this.attributes.matchdaySlot = matchday;
      this.emitWithState('TellResults');
    })
    .catch((err) => {
      console.log('API ERROR: ', err);
      this.attributes.expecting = 'anythingElse';
      this.emit(':ask', 'Sorry, I\'m having trouble finding the results at the moment. Can I help with anything else today?', 'Can I help with anything else today?');
    });
};

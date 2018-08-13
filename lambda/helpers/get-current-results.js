import rp from 'request-promise';
import { API_TOKEN } from '../constants/constants';

module.exports = function (team, matchday) {
  rp({
    headers: { 'X-Auth-Token': API_TOKEN },
    url: `http://api.football-data.org/v2/competitions/2021/matches/?matchday=${matchday}`, // this gameweek's fixture list
    dataType: 'json',
    type: 'GET',
  })
    .then((response) => {
      const data = JSON.parse(response);
      console.log('DATA: ', data);
      const results = [];
      for (let i = 0; i < data.matches.length; i++) {
        results.push({
          home: data.matches[i].homeTeam.name,
          away: data.matches[i].awayTeam.name,
          homeGoals: data.matches[i].score.fullTime.homeTeam,
          awayGoals: data.matches[i].score.fullTime.awayTeam,
          status: data.matches[i].status,
          matchday: data.matches[i].matchday,
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
